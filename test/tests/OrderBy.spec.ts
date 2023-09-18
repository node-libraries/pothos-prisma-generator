import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { OrderBy } from "../generated/graphql";
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
      `@pothos-generator order {orderBy:{id:"desc"},authority:["ADMIN"]}`,
      `@pothos-generator order {orderBy:{id:"asc"}}`,
    ]);
    const client = await getClient();
    return { user, client, admin };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("findManyCategory", async () => {
    const { client, admin } = await property;
    const categories = await prisma.category.findMany({
      orderBy: [{ id: "asc" }],
    });
    await client.FindManyCategory().then((result) => {
      const { findManyCategory } = result;
      expect(findManyCategory.map(({ id }) => id)).toEqual(
        categories.map(({ id }) => id)
      );
    });
    await client.FindManyCategory({}, { user: admin }).then((result) => {
      const { findManyCategory } = result;
      expect(findManyCategory.map(({ id }) => id)).toEqual(
        categories.map(({ id }) => id).reverse()
      );
    });
    await client
      .FindManyCategory({ orderBy: { id: OrderBy.Asc } }, { user: admin })
      .then((result) => {
        const { findManyCategory } = result;
        expect(findManyCategory.map(({ id }) => id)).toEqual(
          categories.map(({ id }) => id)
        );
      });

    const post = await prisma.post.create({
      data: {
        categories: {
          connect: categories.map((category) => ({ id: category.id })),
        },
      },
    });

    await client
      .FindUniquePost(
        { filter: { id: post.id }, categoryOrderBy: { id: OrderBy.Asc } },
        { user: admin }
      )
      .then((result) => {
        const { findUniquePost } = result;
        expect(findUniquePost.categories.map(({ id }) => id)).toEqual(
          categories.map(({ id }) => id)
        );
      });

    await client
      .FindUniquePost({ filter: { id: post.id } }, { user: admin })
      .then((result) => {
        const { findUniquePost } = result;
        expect(findUniquePost.categories.map(({ id }) => id)).toEqual(
          categories.map(({ id }) => id).reverse()
        );
      });
  });
});
