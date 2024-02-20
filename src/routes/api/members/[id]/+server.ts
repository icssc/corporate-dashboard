import { error, json } from "@sveltejs/kit";
import type z from "zod";

import type { RequestHandler } from "./$types";

import { MemberInput } from "$lib/schema/types";
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

const update = (id: string, data: z.infer<typeof MemberInput>) =>
  prisma.user.update({
    where: { id },
    data,
  });

export const PUT: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  if (session.user.role !== "ADMIN") {
    throw error(401);
  }

  const id = event.params.id;

  const data = await event.request.json();
  return json(await update(id, MemberInput.parse(data)));
};

export type PutMember = Awaited<ReturnType<typeof update>>;
