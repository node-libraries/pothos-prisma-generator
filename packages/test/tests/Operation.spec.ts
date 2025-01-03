import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { OrderBy } from "../generated/graphql";
import { getClient, setModelDirective } from "../libs/test-tools";

describe("Post2", () => {
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
  it("countPost", async () => {
    const { client } = await property;
    await client.CountPost().then((result) => {
      const { countPost } = result;
      expect(countPost).toBeGreaterThan(0);
    });

    const postCount = await prisma.post.count({ where: { published: true } });
    await client
      .CountPost({ filter: { published: { equals: true } } })
      .then((result) => {
        const { countPost } = result;
        expect(countPost).toBe(postCount);
      });
  });

  it("findManyPost", async () => {
    const { client } = await property;
    await client.FindManyPost().then((result) => {
      const { findManyPost } = result;
      expect(findManyPost).not.toHaveLength(0);
    });

    const postCount = await prisma.post.count({
      where: { published: true },
    });
    await client
      .FindManyPost({ filter: { published: { equals: true } } })
      .then((result) => {
        const { findManyPost } = result;
        expect(findManyPost).toHaveLength(postCount);
      });
    await client.FindManyPost({ limit: 5 }).then((result) => {
      const { findManyPost } = result;
      expect(findManyPost).toHaveLength(5);
    });
    await client
      .FindManyPost({ orderBy: { id: OrderBy.Asc } })
      .then((result) => {
        const { findManyPost } = result;
        const sortedPosts = [...findManyPost].sort((a, b) =>
          a.id.localeCompare(b.id)
        );
        expect(findManyPost).toMatchObject(sortedPosts);
      });
    await client
      .FindManyPost({ orderBy: { id: OrderBy.Desc } })
      .then((result) => {
        const { findManyPost } = result;
        const sortedPosts = [...findManyPost]
          .sort((a, b) => a.id.localeCompare(b.id))
          .reverse();
        expect(findManyPost).toMatchObject(sortedPosts);
      });

    const post = await prisma.post.findMany({
      skip: 5,
      take: 5,
      orderBy: [{ published: "desc" }, { id: "asc" }],
    });
    await client
      .FindManyPost({
        offset: 5,
        limit: 5,
        orderBy: [{ published: OrderBy.Desc }, { id: OrderBy.Asc }],
      })
      .then((result) => {
        const { findManyPost } = result;
        expect(findManyPost.map(({ id }) => id)).toEqual(
          post.map(({ id }) => id)
        );
      });
    await client
      .FindManyPost({
        offset: 5,
        limit: 5,
        orderBy: [{ published: OrderBy.Desc }, { id: OrderBy.Desc }],
      })
      .then((result) => {
        const { findManyPost } = result;
        expect(findManyPost.map(({ id }) => id)).not.toEqual(
          post.map(({ id }) => id)
        );
      });
  });

  it("FindFirstPost", async () => {
    const { client } = await property;
    await client.FindFirstPost().then((result) => {
      const { findFirstPost } = result;
      expect(findFirstPost).not.toBeNull();
    });

    const post = await prisma.post.findFirstOrThrow();
    await client
      .FindFirstPost({ filter: { id: { equals: post.id } } })
      .then((result) => {
        const { findFirstPost } = result;
        expect(findFirstPost?.id).toBe(post.id);
      });

    const descPost = await prisma.post.findFirstOrThrow({
      orderBy: { id: "desc" },
    });
    await client
      .FindFirstPost({ orderBy: { id: OrderBy.Desc } })
      .then((result) => {
        const { findFirstPost } = result;
        expect(findFirstPost?.id).toBe(descPost.id);
      });
  });

  it("findUniquePost", async () => {
    const { client } = await property;
    const post = await prisma.post.findFirstOrThrow();
    await client.FindUniquePost({ filter: { id: post.id } }).then((result) => {
      const { findUniquePost } = result;
      expect(findUniquePost).not.toBeNull();
    });
  });

  it("createOnePost", async () => {
    const { client } = await property;
    await client
      .CreateOnePost({ input: { title: "Title", content: "Content" } })
      .then((result) => {
        const { createOnePost } = result;
        expect(createOnePost).toMatchObject({
          title: "Title",
          content: "Content",
        });
      });
  });
  it("createManyPost", async () => {
    const { client } = await property;
    await client
      .CreateManyPost({
        input: [
          { title: "Title", content: "Content" },
          { title: "Title2", content: "Content2" },
        ],
      })
      .then((result) => {
        const { createManyPost } = result;
        expect(createManyPost).toBe(2);
      });
  });
  it("updateOnePost", async () => {
    const { client } = await property;
    const post = await prisma.post.create({
      data: { title: "Title", content: "Content" },
    });
    await client
      .UpdateOnePost({
        where: { id: post.id },
        data: { title: "Title2", content: "Content2" },
      })
      .then((result) => {
        const { updateOnePost } = result;
        expect(updateOnePost).toMatchObject({
          title: "Title2",
          content: "Content2",
        });
      });
  });
  it("UpdateManyPost", async () => {
    const { client } = await property;
    const post = await prisma.post.create({
      data: { title: "Title", content: "Content" },
    });
    const post2 = await prisma.post.create({
      data: { title: "Title", content: "Content" },
    });
    await client
      .UpdateManyPost({
        where: { id: { in: [post.id, post2.id] } },
        data: { title: "Title2", content: "Content2" },
      })
      .then((result) => {
        const { updateManyPost } = result;
        expect(updateManyPost).toBe(2);
      });
  });

  it("deleteOnePost", async () => {
    const { client } = await property;
    const post = await prisma.post.create({
      data: { title: "Title", content: "Content" },
    });
    await client
      .DeleteOnePost({
        where: { id: post.id },
      })
      .then((result) => {
        const { deleteOnePost } = result;
        expect(deleteOnePost).toMatchObject({
          title: "Title",
          content: "Content",
        });
      });
  });
  it("deleteManyPost", async () => {
    const { client } = await property;
    const post = await prisma.post.create({
      data: { title: "Title", content: "Content" },
    });
    const post2 = await prisma.post.create({
      data: { title: "Title", content: "Content" },
    });
    await client
      .DeleteManyPost({
        where: { id: { in: [post.id, post2.id] } },
      })
      .then((result) => {
        const { deleteManyPost } = result;
        expect(deleteManyPost).toBe(2);
      });
  });
});
