import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { getApolloServer, getClient } from "../libs/test-tools";

describe("Post", () => {
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
    const { client, user } = await property;
    await client
      .CreateOnePost(
        { input: { title: "Title", content: "Content" } },
        { user }
      )
      .then((result) => {
        const { createOnePost } = result;
        expect(createOnePost).toHaveProperty("title", "Title");
        expect(createOnePost).toHaveProperty("content", "Content");
        expect(createOnePost).toHaveProperty("authorId", user.id);
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
