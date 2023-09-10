import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { OrderBy } from "../generated/graphql";
import { getApolloServer, getClient } from "../libs/test-tools";

describe("Category", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    const server = await getApolloServer();
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const client = await getClient();
    return { server, user, client };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("findManyCategory", async () => {
    const { client } = await property;
    await client.FindManyCategory().then((result) => {
      const findManyCategory = result.findManyCategory;
      expect(findManyCategory).not.toHaveLength(0);
      /// @pothos-generator order {orderBy:{name:"asc"}}
      const names = findManyCategory.map((category) => category.name);
      expect(names).toEqual([...names].sort());

      // published: false is not included
      const posts = findManyCategory.flatMap((category) => category.posts);
      expect(posts.some(({ published }) => published === false)).toBe(false);
    });
  });

  it("findManyCategory(authenticated)", async () => {
    const { client, user } = await property;
    await client.FindManyCategory({}, { user }).then((result) => {
      const findManyCategory = result.findManyCategory;
      expect(findManyCategory).not.toHaveLength(0);
      /// @pothos-generator order {orderBy:{name:"asc"},authority:["authenticated"]}
      const names = findManyCategory.map((category) => category.name);
      expect(names).toEqual([...names].sort());
      // published: false is included
      const posts = findManyCategory.flatMap((category) => category.posts);
      expect(posts.some(({ published }) => published === false)).toBe(true);
    });
  });

  it("findManyCategory(Args)", async () => {
    const { client } = await property;
    await client
      .FindManyCategory({
        filter: { name: { equals: "Category01" } },
        postsFilter: { title: { equals: "Post03" } },
        orderBy: { id: OrderBy.Desc },
      })
      .then((result) => {
        const findManyCategory = result.findManyCategory;
        expect(findManyCategory).toHaveLength(1);
        const ids = findManyCategory.map((category) => category.id);
        expect(ids).toEqual([...ids].sort().reverse());
        expect(findManyCategory[0].posts).toHaveLength(1);
      });
  });
});
