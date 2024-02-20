import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { company } from "$lib/db/schema";
import { CompanyInput } from "$lib/schema/types";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";
import { parseIntSearchParams } from "$lib/util";

const findMany = (take: number = 50, skip?: number) =>
  drizzle
    .select({ id: company.id, name: company.name, url: company.url })
    .limit(take)
    .offset(skip)
    .from(company);
export const GET: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const first = parseIntSearchParams(event.url, "first");
  const skip = parseIntSearchParams(event.url, "skip");
  return json(await findMany(first, skip));
};
export type GetCompany = Awaited<ReturnType<typeof findMany>>;

export const POST: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const input = CompanyInput.safeParse(event.request.json());
  if (input.success) {
    return json(await drizzle.insert(company).values(input.data));
  } else {
    throw error(500, input.error);
  }
};
