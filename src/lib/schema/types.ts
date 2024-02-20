import z from "zod";

import { contactStatus, userRole } from "$lib/db/schema";

export const CompanyInput = z.object({
  name: z.string(),
  url: z.string().url().optional(),
});

export const ContactInput = z.object({
  name: z.string(),
  email: z.string().url().optional(),
  title: z.string().url().optional(),
  company: z.union([
    z.object({
      connect: z.object({
        id: z.string(),
      }),
    }),
    z.object({
      create: CompanyInput,
    }),
  ]),
  status: z.enum(contactStatus),
  lastContactDate: z.string().datetime().optional(),
  followupDate: z.string().datetime().optional(),
  notes: z.string(),
});

export const MemberInput = z.object({
  role: z.enum(userRole),
});
