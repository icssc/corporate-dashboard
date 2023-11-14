import { google } from "googleapis";

import { MAILER_CLIENT_ID, MAILER_CLIENT_SECRET, MAILER_REFRESH_TOKEN } from "$env/static/private";

const auth = new google.auth.OAuth2(MAILER_CLIENT_ID, MAILER_CLIENT_SECRET);
auth.setCredentials({ refresh_token: MAILER_REFRESH_TOKEN });
export const gmail = google.gmail({ version: "v1", auth });
