import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { google } from "googleapis";
import postgres from "postgres";

import { email } from "../src/lib/db/schema";

async function main() {
  const { DATABASE_URL, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, MAILER_REFRESH_TOKEN } =
    process.env;
  const db = drizzle(postgres(DATABASE_URL, { max: 1, ssl: { rejectUnauthorized: false } }), {
    schema: { email },
  });
  const auth = new google.auth.OAuth2(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: MAILER_REFRESH_TOKEN });
  const gmail = google.gmail({ version: "v1", auth });
  const messages = await db
    .select({ id: email.id, raw: email.raw })
    .from(email)
    .orderBy(asc(email.submittedAt))
    .limit(15);
  for (const { id, raw } of messages) {
    await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
    await db.delete(email).where(eq(email.id, id));
    await new Promise((_) => setTimeout(_, 1000));
  }
  process.exit(0);
}

main().then();
