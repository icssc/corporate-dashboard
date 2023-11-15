import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { ContactInput } from "$lib/schema/types";
import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";
import { parseIntSearchParams } from "$lib/util/parseIntSearchParams";

const findMany = (take: number = 50, skip?: number, filter?: string) =>
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
  });

export const GET: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const first = parseIntSearchParams(event.url, "first");
  const skip = parseIntSearchParams(event.url, "skip");
  const filter = event.url.searchParams.get("filter") ?? undefined;

  return json(await findMany(first, skip, filter));
};

export type GetContacts = Awaited<ReturnType<typeof findMany>>;

export const POST: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const input = ContactInput.safeParse(event.request.json());
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
