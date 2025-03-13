import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { getClient, setModelDirective } from "../libs/test-tools";

describe("Order", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@example.com" },
    });
    setModelDirective("Category", [
      `@pothos-generator limit {authority:["ADMIN"]}`,
      `@pothos-generator limit {limit:5}`,
    ]);
    const [client] = await getClient();
    return { user, client, admin };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("findManyCategory", async () => {
    const { client, admin } = await property;
    await client.FindManyCategory().then((result) => {
      const { findManyCategory } = result;
      expect(findManyCategory).toHaveLength(5);
    });
    await client.FindManyCategory({ limit: 3 }).then((result) => {
      const { findManyCategory } = result;
      expect(findManyCategory).toHaveLength(3);
    });
    await client.FindManyCategory({}, { user: admin }).then((result) => {
      const { findManyCategory } = result;
      expect(findManyCategory.length).toBeGreaterThan(5);
    });

    const categories = await prisma.category.findMany();
    const post = await prisma.post.create({
      data: {
        categories: {
          connect: categories.map((category) => ({ id: category.id })),
        },
      },
    });
    await client.FindUniquePost({ filter: { id: post.id } }).then((result) => {
      const { findUniquePost } = result;
      expect(findUniquePost?.categories).toHaveLength(5);
    });
    await client
      .FindUniquePost({ filter: { id: post.id }, categoryLimit: 3 })
      .then((result) => {
        const { findUniquePost } = result;
        expect(findUniquePost?.categories).toHaveLength(3);
      });
  });
});
