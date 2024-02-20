import { error, json } from "@sveltejs/kit";
import { and, eq, ilike, inArray, or } from "drizzle-orm";
import z from "zod";

import type { RequestHandler } from "./$types";

import { user, userRole } from "$lib/db/schema";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";
import { parseIntSearchParams } from "$lib/util/parseIntSearchParams";

const UserRoleZod = z.array(z.enum(userRole)).optional();

const findMany = (
  take: number = 50,
  skip?: number,
  search?: string,
  role: userRole[] = ["ADMIN", "MEMBER"],
) =>
  drizzle
    .select({ id: user.id, role: user.role, name: user.name, email: user.email })
    .from(user)
    .where(
      and(
        inArray(user.role, role),
        search ? or(eq(user.name, search), ilike(user.name, `${search}%`)) : true,
      ),
    )
    .limit(take)
    .offset(skip);
export const GET: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }

  const first = parseIntSearchParams(event.url, "first");
  const skip = parseIntSearchParams(event.url, "skip");
  const search = event.url.searchParams.get("search") ?? undefined;
  const role = event.url.searchParams.get("role") ?? undefined;

  return json(
    await findMany(first, skip, search, role ? UserRoleZod.parse(JSON.parse(role)) : undefined),
  );
};

export type GetMembers = Awaited<ReturnType<typeof findMany>>;
