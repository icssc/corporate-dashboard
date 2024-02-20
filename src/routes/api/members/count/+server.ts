import { error, json } from "@sveltejs/kit";
import z from "zod";

import type { RequestHandler } from "./$types";

import { user, userRole } from "$lib/db/schema";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";

const UserRoleZod = z.array(z.enum(userRole)).optional();

const count = (role: UserRole[] = ["ADMIN", "MEMBER"]) =>
  drizzle.select({ count: count() }).from(user).where(arrayIn(user.role, role));

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
