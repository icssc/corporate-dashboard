import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";
import { parseIntSearchParams } from "$lib/util/parseIntSearchParams";

const findMany = (take: number = 50, skip?: number, search?: string) =>
  prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "MEMBER"] },
      ...(search && { OR: [{ name: { search } }, { name: { startsWith: search } }] }),
    },
    select: {
      id: true,
      name: true,
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
  const search = event.url.searchParams.get("search") ?? undefined;

  return json(await findMany(first, skip, search));
};

export type GetMembers = Awaited<ReturnType<typeof findMany>>;
