import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { OrderBy } from "../generated/graphql";
import { getClient, setModelDirective } from "../libs/test-tools";

describe("Category", () => {
  setModelDirective("Post", [
    `@pothos-generator where {include:["query"],where:{},authority:["USER"]}`,
    `@pothos-generator where {include:["query"],where:{published:true}}`,
  ]);
  setModelDirective("Category", [
    `@pothos-generator order {orderBy:{name:"asc"}}`,
    `@pothos-generator input-field {fields:{exclude:["id","createdAt","updatedAt","posts"]}}`,
    `@pothos-generator limit {limit:10}`,
  ]);

  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const client = await getClient();
    return { user, client };
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
        categoryFilter: { name: { equals: "Category01" } },
        postFilter: { title: { equals: "Post03" } },
        categoryOrderBy: { id: OrderBy.Desc },
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
