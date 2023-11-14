import { OAuthRequestError } from "@lucia-auth/oauth";
import type { RequestHandler } from "@sveltejs/kit";

import { auth, googleAuth } from "$lib/server/lucia";

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
  const storedState = cookies.get("google_oauth_state");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, { status: 400 });
  }
  try {
    const { getExistingUser, googleUser, createUser } = await googleAuth.validateCallback(code);
    const existingUser = await getExistingUser();
    const user = existingUser
      ? existingUser
      : await createUser({ attributes: { role: "UNAUTHORIZED", name: googleUser.name } });
    const session = await auth.createSession({ userId: user.userId, attributes: {} });
    locals.auth.setSession(session);
    return new Response(null, { status: 302, headers: { Location: "/" } });
  } catch (e) {
    return new Response(null, { status: e instanceof OAuthRequestError ? 400 : 500 });
  }
};
