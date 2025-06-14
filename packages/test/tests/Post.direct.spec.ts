import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { getClient } from "../libs/test-tools";

describe("Post", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@example.com" },
    });
    const [client] = await getClient((builder) => {
      builder.addModelOperations("Post", {
        exclude: ["deleteMany"],
      });
      builder.addModelDirectives("Post", "executable", {
        include: ["mutation"],
        authority: ["USER"],
      });
      builder.addModelDirectives("Post", "input-field", {
        fields: { exclude: ["id", "createdAt", "updatedAt", "author"] },
      });
      builder.addModelDirectives("Post", "input-data", {
        authority: ["ADMIN"],
      });
      // generator.addModelDirectives("Post", "input-data", {
      //   data: { authorId: "%%USER%%" },
      // });
      builder.addModelDirectives("Post", "where", {
        include: ["query"],
        where: {},
        authority: ["USER"],
      });
      builder.addModelDirectives("Post", "where", {
        include: ["query"],
        where: { published: true },
      });
      builder.addModelDirectives("Post", "where", {
        include: ["update", "delete"],
        where: { authorId: "%%USER%%" },
      });
      builder.addModelDirectives("Post", "order", {
        orderBy: { title: "asc" },
      });
      builder.addModelParameterCallback((params, generatorParams) => {
        if (
          generatorParams.modelName === "Post" &&
          !generatorParams.authority.includes("ADMIN") &&
          generatorParams.operationPrefix === "createOne"
        ) {
          if (!generatorParams.params.ctx.user?.id)
            throw new Error("No permission");
          return {
            ...params,
            input: {
              ...params.input,
              authorId: generatorParams.params.ctx.user.id,
            },
          };
        }
        return params;
      });
    });
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
    await expect(
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

    await expect(
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
