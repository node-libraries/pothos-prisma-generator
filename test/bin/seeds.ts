import { PrismaClient, Role } from "@prisma/client";

export const prisma = new PrismaClient();

const formatNumber = (num: number) => {
  return num.toString().padStart(2, "0");
};

const main = async () => {
  // add user

  const users = await prisma.user.count().then(async (count) => {
    if (!count) {
      return prisma.$transaction(
        [
          {
            name: "admin",
            email: "admin@example.com",
            roles: ["ADMIN", "USER"] satisfies Role[],
          },
          { name: "example", email: "example@example.com" },
        ].map((data) => {
          return prisma.user.create({
            data,
          });
        })
      );
    }
    return prisma.category.findMany();
  });

  // add category
  const categories = await prisma.category.count().then(async (count) => {
    if (!count) {
      await prisma.category.createMany({
        data: Array(10)
          .fill(0)
          .map((_, i) => ({ name: `Category${formatNumber(i + 1)}` })),
      });
    }
    return prisma.category.findMany();
  });
  // add post
  await prisma.post.count().then(async (count) => {
    if (!count) {
      for (let i = 0; i < 30; i++) {
        await prisma.post.create({
          data: {
            title: `Post${formatNumber(i + 1)}`,
            content: `Post${formatNumber(i + 1)} content`,
            authorId: users[1].id,
            published: i % 4 !== 0,
            categories: {
              connect: [
                { id: categories[i % 2].id },
                { id: categories[i % 10].id },
              ],
            },
          },
        });
      }
    }
  });
};

main();
