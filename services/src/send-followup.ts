import { PrismaClient } from "@prisma/client";
import type { Handler } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: Handler = async (_event, _context) => {
  
};
