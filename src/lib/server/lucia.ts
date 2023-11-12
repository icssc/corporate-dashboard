import { prisma } from "@lucia-auth/adapter-prisma";
import { google } from "@lucia-auth/oauth/providers";
import { PrismaClient } from "@prisma/client";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

import { dev } from "$app/environment";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
} from "$env/static/private";

const client = new PrismaClient();

export const auth = lucia({
  adapter: prisma(client),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  getUserAttributes: (data) => ({ email: data.email }),
});

export const googleAuth = google(auth, {
  clientId: GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
});

export type Auth = typeof auth;
