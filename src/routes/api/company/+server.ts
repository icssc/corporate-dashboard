import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import parseIntSearchParams from "$lib/helpers/parseIntSearchParams";
import prisma from "$lib/server/prisma";
import { CompanyInput } from "$lib/zod/types";

export const GET: RequestHandler = ({ url }) => {
  const first = parseIntSearchParams(url, "first");
  const skip = parseIntSearchParams(url, "skip");

  return json(
    prisma.company.findMany({
      select: {
        id: true,
        name: true,
        url: true,
      },
      take: first,
      skip: skip,
    }),
  );
};

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
