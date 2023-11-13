import { fail, redirect } from "@sveltejs/kit";

import type { Actions } from "./$types";

import { auth } from "$lib/server/lucia";

export const actions: Actions = {
  signout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) return fail(401);
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
    throw redirect(302, "/signin");
  },
};
