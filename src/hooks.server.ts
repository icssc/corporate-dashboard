import type { Handle } from "@sveltejs/kit";

import { auth } from "$lib/server/lucia";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  return resolve(event);
};
