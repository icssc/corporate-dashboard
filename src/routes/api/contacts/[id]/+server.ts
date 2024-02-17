import { error, json, type RequestHandler } from "@sveltejs/kit";

import { ContactInput } from "$lib/schema/types";
import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma";

export const PATCH: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const input = ContactInput.safeParse(event.request.json());
  if (input.success) {
    return json(
      await prisma.contact.update({
        where: { id: event.params.id },
        data: input.data,
      }),
    );
  }
  throw error(500, input.error);
};

export const DELETE: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (session?.user?.role !== "ADMIN") {
    throw error(401);
  }
  return json(await prisma.contact.delete({ where: { id: event.params.id } }));
};
