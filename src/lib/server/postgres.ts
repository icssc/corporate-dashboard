import p from "postgres";

import { DATABASE_URL } from "$env/static/private";

export const postgres = p(DATABASE_URL, { max: 1, ssl: { rejectUnauthorized: false } });
