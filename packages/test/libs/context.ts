import { PrismaClient } from "@prisma/client";

declare let global: { prisma?: PrismaClient };

export type Context = {
  user?: { name: string; id: string; roles: string[] };
};

global.prisma?.$disconnect();

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: [
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

global.prisma = prisma;
