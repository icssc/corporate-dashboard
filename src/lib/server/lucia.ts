import { prisma } from "@lucia-auth/adapter-prisma";
import { google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
} from "$env/static/private";
import { prisma as client } from "$lib/server/prisma";

export const auth = lucia({
  adapter: prisma(client),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  getUserAttributes: ({ role, name, email }) => ({ role, name, email }),
});

export const googleAuth = google(auth, {
  clientId: GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
  scope: ["https://www.googleapis.com/auth/userinfo.email"],
});

export type Auth = typeof auth;
