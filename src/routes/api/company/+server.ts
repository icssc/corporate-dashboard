import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { CompanyInput } from "$lib/schema/types";
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
export const GET: RequestHandler = async ({ url }) => {
  const first = parseIntSearchParams(url, "first");
  const skip = parseIntSearchParams(url, "skip");

  return json(await findMany(first, skip));
};
export type GetCompany = Awaited<ReturnType<typeof findMany>>;

export const POST: RequestHandler = ({ request }) => {
  const input = CompanyInput.safeParse(request.json());

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
