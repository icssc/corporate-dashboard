import { error, json } from "@sveltejs/kit";
import type { SortingState } from "@tanstack/svelte-table";
import z from "zod";

import type { RequestHandler } from "./$types";

import { ContactInput } from "$lib/schema/types";
import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";
import { parseIntSearchParams } from "$lib/util/parseIntSearchParams";

const findMany = (take: number = 50, skip?: number, filter?: string, sorting?: SortingState) =>
  prisma.contact.findMany({
    where: { committeeMemberUserId: filter },
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      company: {
        select: { id: true, name: true },
      },
      status: true,
      committeeMember: {
        select: { id: true, name: true },
      },
      lastContactDate: true,
      followupDate: true,
      notes: true,
    },
    take,
    skip,
    ...(sorting && {
      orderBy: {
        [sorting[0].id]: sorting[0].desc ? "desc" : "asc",
      },
    }),
  });

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
  prisma.contact.create({
    data,
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
