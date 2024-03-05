import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type z from "zod";

import type { RequestHandler } from "./$types";

import { user } from "$lib/db/schema";
import { MemberInput } from "$lib/schema/types";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";

const findUnique = (id: string) =>
  drizzle.selectDistinct({ id: user.id, name: user.name }).from(user).where(eq(user.id, id));

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
  drizzle.update(user).set(data).where(eq(user.id, id));

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
