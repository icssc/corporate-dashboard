import { error, json } from "@sveltejs/kit";
import type { SortingState } from "@tanstack/svelte-table";
import { asc, desc, eq } from "drizzle-orm";
import z from "zod";

import type { RequestHandler } from "./$types";

import { company, contact, user } from "$lib/db/schema";
import { ContactInput } from "$lib/schema/types";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";
import { parseIntSearchParams } from "$lib/util/parseIntSearchParams";

const findMany = (take: number = 50, skip?: number, filter?: string, sorting?: SortingState) =>
  drizzle
    .select()
    .from(contact)
    .where(eq(contact.committeeMemberUserId, filter))
    .innerJoin(company, eq(contact.companyId, company.id))
    .innerJoin(user, eq(contact.committeeMemberUserId, user.id))
    .limit(take)
    .offset(skip)
    .orderBy(sorting ? (sorting[0].desc ? desc(sorting[0].id) : asc(sorting[0].id)) : undefined)
    .then((result) =>
      result.map(({ company, committeeMember, ...results }) => ({
        ...results,
        company: { id: company.id, name: company.name },
        committeeMember: { id: committeeMember.id, name: committeeMember.name },
      })),
    );

const SortingState = z.array(
  z.object({
    desc: z.boolean(),
    id: z.string(),
  }),
);

export const GET: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const first = parseIntSearchParams(event.url, "first");
  const skip = parseIntSearchParams(event.url, "skip");
  const filter = event.url.searchParams.get("filter") ?? undefined;
  const sorting = event.url.searchParams.get("sorting") ?? undefined;

  return json(
    await findMany(
      first,
      skip,
      filter,
      sorting ? SortingState.parse(JSON.parse(sorting)) : undefined,
    ),
  );
};

export type GetContacts = Awaited<ReturnType<typeof findMany>>;

const create = (data: z.infer<typeof ContactInput>) =>
  "connect" in data.company
    ? drizzle.insert(contact).values(
        (() => {
          const { company, ...other } = data;
          return { ...other, companyId: company.connect.id };
        })(),
      )
    : drizzle.transaction(async (txn) => {
        const { id } = await txn
          .insert(company)
          .values(data.company.create)
          .returning({ id: company.id });
        await txn.insert(contact).values(
          (() => {
            const { company: _, ...other } = data;
            return { ...other, companyId: id };
          })(),
        );
      });

export const POST: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const input = ContactInput.safeParse(event.request.json());
  if (input.success) {
    return json(await create(input.data));
  } else {
    throw error(500, input.error);
  }
};

export type PostContact = Awaited<ReturnType<typeof create>>;
