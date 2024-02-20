import { drizzle as d } from "drizzle-orm/postgres-js";

import * as schema from "$lib/db/schema";
import { postgres } from "$lib/server/postgres";

export const drizzle = d(postgres, { schema });
