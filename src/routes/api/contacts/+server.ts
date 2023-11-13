import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import parseIntSearchParams from "$lib/helpers/parseIntSearchParams";
import prisma from "$lib/server/prisma";
import { ContactInput } from "$lib/zod/types";

const findMany = (take: number = 50, skip?: number) =>
  prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      company: {
        select: { id: true, name: true },
      },
      status: true,
      lastContactDate: true,
      followupDate: true,
      notes: true,
    },
    take,
    skip,
  });
export const GET: RequestHandler = async ({ url }) => {
  const first = parseIntSearchParams(url, "first");
  const skip = parseIntSearchParams(url, "skip");

  return json(await findMany(first, skip));
};
export type GetContacts = Awaited<ReturnType<typeof findMany>>;

export const POST: RequestHandler = ({ request }) => {
  const input = ContactInput.safeParse(request.json());

  if (input.success) {
    return json(
      prisma.contact.create({
        data: input.data,
      }),
    );
  } else {
    throw error(500, input.error);
  }
};
