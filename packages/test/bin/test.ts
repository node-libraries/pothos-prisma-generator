import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const main = async () => {
  const v = await prisma.test.findFirst();
  console.log(v);
};

main();
