import { createPrismaClient } from "../libs/client";

export const prisma = createPrismaClient();

const main = async () => {
  const v = await prisma.post.findFirst();
  console.log(v);
};

main();
