import { error, json } from "@sveltejs/kit";
import z from "zod";

import type { RequestHandler } from "./$types";

import { contact } from "$lib/db/schema";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";
import { parseIntSearchParams } from "$lib/util/parseIntSearchParams";

const SortingState = z.array(
  z.object({
    desc: z.boolean(),
    id: z.custom<keyof typeof contact.$inferSelect>((key) => {
      return typeof key === "string" && key in contact.$inferSelect;
    }),
  }),
);

const findMany = (
  take: number = 50,
  skip?: number,
  filter?: string,
  sorting?: z.infer<typeof SortingState>,
) =>
  drizzle.query.contact
    .findMany({
      limit: take,
      offset: skip,
      columns: {
        id: true,
        name: true,
        email: true,
        title: true,
        status: true,
        lastContactDate: true,
        followupDate: true,
        notes: true,
      },
      with: {
        company: true,
        committeeMember: true,
      },
      where: filter ? (contacts, { eq }) => eq(contacts.committeeMemberUserId, filter) : undefined,
      orderBy: sorting?.[0]?.id
        ? (contacts, { asc, desc }) => [
            sorting[0].desc ? desc(contacts[sorting[0].id]) : asc(contacts[sorting[0].id]),
          ]
        : undefined,
    })
    .then((result) =>
      result.map(({ company, committeeMember, ...results }) => ({
        ...results,
        company: { id: company.id, name: company.name },
        committeeMember: { id: committeeMember?.id, name: committeeMember?.name },
      })),
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

// const create = (data: z.infer<typeof ContactInput>) =>
//   "connect" in data.company
//     ? drizzle.insert(contact).values(
//         (() => {
//           const { company, ...other } = data;
//           return { ...other, companyId: company.connect.id };
//         })(),
//       )
//     : drizzle.transaction(async (txn) => {
//         const { id } = await txn
//           .insert(company)
//           .values(data.company.create)
//           .returning({ id: company.id });
//         await txn.insert(contact).values(
//           (() => {
//             const { company: _, ...other } = data;
//             return { ...other, companyId: id };
//           })(),
//         );
//       });

// export const POST: RequestHandler = async (event) => {
//   const session = await auth.handleRequest(event).validate();
//   if (!session || session.user.role === "UNAUTHORIZED") {
//     throw error(401);
//   }
//   const input = ContactInput.safeParse(event.request.json());
//   if (input.success) {
//     return json(await create(input.data));
//   } else {
//     throw error(500, input.error);
//   }
// };

// export type PostContact = Awaited<ReturnType<typeof create>>;
