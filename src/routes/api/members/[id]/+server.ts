import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";

const findUnique = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

export const GET: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }

  const id = event.params.id;

  return json(await findUnique(id));
};

export type GetMember = Awaited<ReturnType<typeof findUnique>>;
