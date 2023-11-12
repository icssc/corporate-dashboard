import z from "zod";

export const CompanyInput = z.object({
  name: z.string(),
  url: z.string().url().optional(),
});
export const Company = CompanyInput.and(
  z.object({
    id: z.string().uuid(),
  }),
);

const ContactStatus = z.enum(["BLAH"]);
export const ContactInput = z.object({
  name: z.string(),
  email: z.string().url().optional(),
  title: z.string().url().optional(),
  status: ContactStatus,
});
export const Contact = ContactInput.and(
  z.object({
    id: z.string().uuid(),
  }),
);
