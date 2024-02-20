import { pgTable, uniqueIndex, pgEnum, text, timestamp, index, bigint } from "drizzle-orm/pg-core";

export const userRole = ["ADMIN", "MEMBER", "UNAUTHORIZED"] as const;

export const contactStatus = [
  "SEE_NEXT_YEAR",
  "REJECTED",
  "BOUNCED",
  "AUTOMATED_FOLLOWUP_SENT",
  "IN_PROGRESS_AUTOMATION_DISABLED",
  "INITIAL_EMAIL_SENT",
  "NOT_CONTACTED",
] as const;

export const userRoleEnum = pgEnum("UserRole", userRole);
export const contactStatusEnum = pgEnum("ContactStatus", contactStatus);

export const company = pgTable(
  "Company",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    url: text("url"),
  },
  (table) => {
    return {
      idKey: uniqueIndex("Company_id_key").on(table.id),
    };
  },
);

export const contact = pgTable(
  "Contact",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email"),
    title: text("title"),
    companyId: text("companyId")
      .notNull()
      .references(() => company.id, { onDelete: "restrict", onUpdate: "cascade" }),
    status: contactStatusEnum("status").notNull(),
    committeeMemberUserId: text("committeeMemberUserId").references(() => user.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    lastContactDate: timestamp("lastContactDate", { precision: 3, mode: "string" }),
    followupDate: timestamp("followupDate", { precision: 3, mode: "string" }),
    notes: text("notes"),
  },
  (table) => {
    return {
      idKey: uniqueIndex("Contact_id_key").on(table.id),
    };
  },
);

export const user = pgTable(
  "User",
  {
    id: text("id").primaryKey().notNull(),
    role: userRoleEnum("role").default("UNAUTHORIZED").notNull(),
    name: text("name"),
    email: text("email"),
  },
  (table) => {
    return {
      idKey: uniqueIndex("User_id_key").on(table.id),
    };
  },
);

export const session = pgTable(
  "Session",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      idKey: uniqueIndex("Session_id_key").on(table.id),
      userIdIdx: index("Session_user_id_idx").on(table.userId),
    };
  },
);

export const key = pgTable(
  "Key",
  {
    id: text("id").primaryKey().notNull(),
    hashedPassword: text("hashed_password"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      idKey: uniqueIndex("Key_id_key").on(table.id),
      userIdIdx: index("Key_user_id_idx").on(table.userId),
    };
  },
);
