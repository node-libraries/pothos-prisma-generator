import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

export const createPrismaClient = (options?: Prisma.PrismaClientOptions) => {
  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/postgres?schema=test";
  const url = new URL(databaseUrl);
  const schema = url.searchParams.get("schema") ?? undefined;
  const adapter = new PrismaPg(databaseUrl, { schema });
  return new PrismaClient({ ...options, adapter });
};
