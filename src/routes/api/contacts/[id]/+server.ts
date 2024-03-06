import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { z } from "zod";

import { contact } from "$lib/db/schema";
import { ContactInput } from "$lib/schema/types";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";

const update = (id: string, data: z.infer<typeof ContactInput>) =>
  drizzle.update(contact).set(data).where(eq(contact.id, id));

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

const deleteContact = (id: string) => drizzle.delete(contact).where(eq(contact.id, id));

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
