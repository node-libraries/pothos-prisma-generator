import { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "./client";

declare let global: { prisma?: PrismaClient };

export type Context = {
  user?: { name: string; id: string; roles: string[] };
};

global.prisma?.$disconnect();

export const prisma =
  global.prisma ??
  createPrismaClient({
    log: [
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

global.prisma = prisma;
