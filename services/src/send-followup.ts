import { PrismaClient } from "@prisma/client";
import type { Handler } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: Handler = async (_event, _context) => {
  (await prisma.contact.findMany({ where: { status: "INITIAL_EMAIL_SENT" } }))
    .filter((x) => x.followupDate && x.followupDate < new Date())
    .forEach((_) => {}); // TODO implement email send logic
};
