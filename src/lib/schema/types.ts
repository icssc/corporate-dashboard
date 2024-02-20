import { ContactStatus, UserRole } from "@prisma/client";
import z from "zod";

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
  status: z.nativeEnum(ContactStatus),
  lastContactDate: z.string().datetime().optional(),
  followupDate: z.string().datetime().optional(),
  notes: z.string(),
});

export const MemberInput = z.object({
  role: z.nativeEnum(UserRole),
});
