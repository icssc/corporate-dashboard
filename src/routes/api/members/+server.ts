import { UserRole } from "@prisma/client";
import { error, json } from "@sveltejs/kit";
import z from "zod";

import type { RequestHandler } from "./$types";

import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";
import { parseIntSearchParams } from "$lib/util/parseIntSearchParams";

const UserRoleZod = z.array(z.nativeEnum(UserRole)).optional();

const findMany = (
  take: number = 50,
  skip?: number,
  search?: string,
  role: UserRole[] = ["ADMIN", "MEMBER"],
) =>
  prisma.user.findMany({
    where: {
      role: { in: role },
      ...(search && { OR: [{ name: { search } }, { name: { startsWith: search } }] }),
    },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
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
  const role = event.url.searchParams.get("role") ?? undefined;

  return json(await findMany(first, skip, search, UserRoleZod.parse(role)));
};

export type GetMembers = Awaited<ReturnType<typeof findMany>>;
