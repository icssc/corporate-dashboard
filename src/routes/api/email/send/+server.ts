import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import { auth } from "$lib/server/lucia";

export const POST: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  return json({});
};
