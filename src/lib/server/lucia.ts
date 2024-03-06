import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, STAGE } from "$env/static/private";
import { postgres } from "$lib/server/postgres";

export const auth = lucia({
  adapter: postgresAdapter(postgres, {
    user: "auth_user",
    key: "user_key",
    session: "user_session",
  }),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  getUserAttributes: ({ role, name, email }) => ({ role, name, email }),
});

export const googleAuth = google(auth, {
  clientId: GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: `${
    STAGE
      ? STAGE === "prod"
        ? "https://corporate.internal.icssc.club"
        : `${STAGE}-corporate.internal.icssc.club`
      : "http://localhost:5173"
  }/signin/google/callback`,
  scope: ["https://www.googleapis.com/auth/userinfo.email"],
});

export type Auth = typeof auth;
