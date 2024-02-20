import { error, json, type RequestHandler } from "@sveltejs/kit";
import type { z } from "zod";

import { ContactInput } from "$lib/schema/types";
import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";

const update = (id: string, data: z.infer<typeof ContactInput>) =>
  prisma.contact.update({ where: { id }, data });

export const PATCH: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }

  const input = ContactInput.safeParse(event.request.json());
  if (!input.success) {
    throw error(500, input.error);
  }

  const id = event.params.id;
  if (!id) throw error(500, "ID is a required parameter.");
  return json(await update(id, input.data));
};

export type PatchContact = Awaited<ReturnType<typeof update>>;

const deleteContact = (id: string) => prisma.contact.delete({ where: { id } });

export const DELETE: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }

  const id = event.params.id;
  if (!id) throw error(500, "ID is a required parameter.");

  return json(await deleteContact(id));
};

export type DeleteContact = Awaited<ReturnType<typeof deleteContact>>;
