import { UserRole } from "@prisma/client";
import { error, json } from "@sveltejs/kit";
import z from "zod";

import type { RequestHandler } from "./$types";

import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";

const UserRoleZod = z.array(z.nativeEnum(UserRole)).optional();

const count = async (role: UserRole[] = ["ADMIN", "MEMBER"]) => ({
  count: await prisma.user.count({
    where: {
      role: { in: role },
    },
  }),
});

export const GET: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }

  const role = event.url.searchParams.get("role") ?? undefined;
  const roleArray = role?.split(",");

  return json(await count(UserRoleZod.parse(roleArray)));
};

export type GetMembersCount = Awaited<ReturnType<typeof count>>;
