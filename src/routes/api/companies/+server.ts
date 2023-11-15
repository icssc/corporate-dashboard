import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { CompanyInput } from "$lib/schema/types";
import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";
import { parseIntSearchParams } from "$lib/util";

const findMany = (take: number = 50, skip?: number) =>
  prisma.company.findMany({
    select: {
      id: true,
      name: true,
      url: true,
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
    return json(
      prisma.company.create({
        data: input.data,
      }),
    );
  } else {
    throw error(500, input.error);
  }
};
