import z from "zod";

export const CompanyInput = z.object({
  name: z.string(),
  url: z.string().url().optional(),
});

const ContactStatus = z.enum([
  "NOT_CONTACTED",
  "INITIAL_EMAIL_SENT",
  "IN_PROGRESS_AUTOMATION_DISABLED",
  "AUTOMATED_FOLLOWUP_SENT",
  "BOUNCED",
  "REJECTED",
  "SEE_NEXT_YEAR",
]);
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
  status: ContactStatus,
  lastContactDate: z.string().datetime().optional(),
  followupDate: z.string().datetime().optional(),
  notes: z.string(),
});
