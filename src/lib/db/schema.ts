import { pgSchema, pgEnum, text, timestamp, bigint, varchar } from "drizzle-orm/pg-core";

export const schema = pgSchema("dev");

export const userRole = ["ADMIN", "MEMBER", "UNAUTHORIZED"] as const;
export const userRoleEnum = pgEnum("UserRole", userRole);

export const user = schema.table("auth_user", {
  id: varchar("id", {
    length: 15,
  }).primaryKey(),
  role: userRoleEnum("role").default("UNAUTHORIZED").notNull(),
  name: text("name"),
  email: text("email"),
});

export const session = schema.table("user_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});

export const key = schema.table("user_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});

export const contactStatus = [
  "SEE_NEXT_YEAR",
  "REJECTED",
  "BOUNCED",
  "AUTOMATED_FOLLOWUP_SENT",
  "IN_PROGRESS_AUTOMATION_DISABLED",
  "INITIAL_EMAIL_SENT",
  "NOT_CONTACTED",
] as const;

export const contactStatusEnum = pgEnum("ContactStatus", contactStatus);

export const company = schema.table("company", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  url: text("url"),
});

export const contact = schema.table("contact", {
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
  lastContactDate: timestamp("lastContactDate", { precision: 3 }),
  followupDate: timestamp("followupDate", { precision: 3 }),
  notes: text("notes"),
});
