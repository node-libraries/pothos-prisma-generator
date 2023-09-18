import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { getClient, setModelDirective } from "../libs/test-tools";

describe("Post", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    setModelDirective("Post", [
      `@pothos-generator operation {exclude:["deleteMany"]}`,
      `@pothos-generator executable {include:["mutation"],authority:["USER"]}`,
      `@pothos-generator input-field {fields:{exclude:["id","createdAt","updatedAt","author"]}}`,
      `@pothos-generator input-data {data:{},authority:["ADMIN"]}`,
      `@pothos-generator input-data {data:{authorId:"%%USER%%"}}`,
      `@pothos-generator where {include:["query"],where:{},authority:["USER"]}`,
      `@pothos-generator where {include:["query"],where:{published:true}}`,
      `@pothos-generator where {include:["update","delete"],where:{authorId:"%%USER%%"}}`,
      `@pothos-generator order {orderBy:{title:"asc"}}`,
    ]);
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@example.com" },
    });
    const client = await getClient();
    return { user, client, admin };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("findManyPost", async () => {
    const { client } = await property;
    await client.FindManyPost().then((result) => {
      const { findManyPost } = result;
      // published: false is not included
      expect(findManyPost.some(({ published }) => published === false)).toBe(
        false
      );
    });
  });
  it("findManyPost(Auth)", async () => {
    const { client, user } = await property;
    await client.FindManyPost({}, { user }).then((result) => {
      const { findManyPost } = result;
      expect(findManyPost).not.toHaveLength(0);
      // published: false is included
      expect(findManyPost.some(({ published }) => published === false)).toBe(
        true
      );
    });
  });
  it("CreateOnePost", async () => {
    const { client, user, admin } = await property;
    expect(
      client.CreateOnePost(
        { input: { title: "Title", content: "Content" } },
        { user }
      )
    ).resolves.toMatchObject({
      createOnePost: {
        title: "Title",
        content: "Content",
        authorId: user.id,
      },
    });

    expect(
      client.CreateOnePost(
        { input: { title: "Title", content: "Content" } },
        { user: admin }
      )
    ).resolves.toMatchObject({
      createOnePost: {
        title: "Title",
        content: "Content",
        authorId: null,
      },
    });
  });

  it("CreateOnePost(Auth error)", async () => {
    const { client } = await property;
    await expect(
      client.CreateOnePost({
        input: { title: "Title", content: "Content" },
      })
    ).rejects.toHaveLength(1);
  });
});
