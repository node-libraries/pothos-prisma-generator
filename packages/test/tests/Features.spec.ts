import { beforeAllAsync } from "../libs/async";
import { createPrismaClient } from "../libs/client";
import { getClient, getSchema, setFieldDirective } from "../libs/test-tools";

describe("Features ①-⑦ tests", () => {
  const prisma = createPrismaClient({});

  const property = beforeAllAsync(async () => {
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@example.com" },
    });
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const [client, requester] = await getClient();
    return { admin, user, client, requester };
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("① Filter logical operators (AND, OR, NOT) & mode: Insensitive", () => {
    it("filters with AND, OR, NOT", async () => {
      const { client, admin } = await property;

      // AND
      const andRes = await client.FindManyUser(
        {
          filter: {
            AND: [
              { email: { contains: "admin" } },
              { email: { endsWith: "example.com" } },
            ],
          },
        },
        { user: admin },
      );
      expect(andRes.findManyUser.length).toBeGreaterThanOrEqual(1);
      expect(andRes.findManyUser.every((u) => u.email.includes("admin"))).toBe(
        true,
      );

      // OR
      const orRes = await client.FindManyUser(
        {
          filter: {
            OR: [
              { email: { equals: "admin@example.com" } },
              { email: { equals: "example@example.com" } },
            ],
          },
        },
        { user: admin },
      );
      expect(orRes.findManyUser.length).toBe(2);

      // NOT
      const notRes = await client.FindManyUser(
        {
          filter: {
            NOT: { email: { equals: "admin@example.com" } },
          },
        },
        { user: admin },
      );
      expect(
        notRes.findManyUser.some((u) => u.email === "admin@example.com"),
      ).toBe(false);
    });

    it("filters with mode: Insensitive", async () => {
      const { client, admin } = await property;
      const res = await client.FindManyUser(
        {
          filter: {
            email: {
              contains: "ADMIN",
              mode: "Insensitive",
            },
          },
        },
        { user: admin },
      );
      expect(res.findManyUser.length).toBeGreaterThanOrEqual(1);
      expect(
        res.findManyUser.some((u) => u.email === "admin@example.com"),
      ).toBe(true);
    });
  });

  describe("② createMany dedicated input with scalar / foreign key only", () => {
    it("creates multiple posts via createManyPost with authorId", async () => {
      const { client, admin } = await property;
      const titlePrefix = `bulk_${Date.now()}`;
      const count = await client.CreateManyPost(
        {
          input: [
            {
              title: `${titlePrefix}_1`,
              content: "content 1",
              authorId: admin.id,
              published: true,
            },
            {
              title: `${titlePrefix}_2`,
              content: "content 2",
              authorId: admin.id,
              published: false,
            },
          ],
        },
        { user: admin },
      );
      expect(count.createManyPost).toBe(2);

      const created = await prisma.post.findMany({
        where: { title: { startsWith: titlePrefix } },
      });
      expect(created.length).toBe(2);

      // cleanup
      await prisma.post.deleteMany({
        where: { title: { startsWith: titlePrefix } },
      });
    });
  });

  describe("③ OrderBy excludes list relations", () => {
    it("does not include 1-to-many list relations in OrderBy inputs", () => {
      const schema = getSchema();
      const postOrderByType = schema.getType("PostOrderBy") as any;
      const postOrderByFields = postOrderByType.getFields();
      expect(postOrderByFields.author).toBeDefined(); // single relation (Many-to-One) is allowed
      expect(postOrderByFields.categories).toBeUndefined(); // list relation (Many-to-Many / One-to-Many) excluded

      const userOrderByType = schema.getType("UserOrderBy") as any;
      const userOrderByFields = userOrderByType.getFields();
      expect(userOrderByFields.posts).toBeUndefined(); // list relation (One-to-Many) excluded
      expect(userOrderByFields.roles).toBeUndefined(); // scalar list excluded
    });
  });

  describe("④ upsertOne mutation", () => {
    it("upserts a user (creates when not exists, updates when exists)", async () => {
      const { client, admin } = await property;
      const testEmail = `upsert_${Date.now()}@example.com`;

      // 1. Create via upsert
      const created = await client.UpsertOneUser(
        {
          where: { email: testEmail },
          create: {
            email: testEmail,
            name: "Upsert Created",
          },
          update: {
            name: "Upsert Updated",
          },
        },
        { user: admin },
      );
      expect(created.upsertOneUser.name).toBe("Upsert Created");
      expect(created.upsertOneUser.email).toBe(testEmail);

      // 2. Update via upsert
      const updated = await client.UpsertOneUser(
        {
          where: { email: testEmail },
          create: {
            email: testEmail,
            name: "Should Not Create",
          },
          update: {
            name: "Upsert Updated",
          },
        },
        { user: admin },
      );
      expect(updated.upsertOneUser.name).toBe("Upsert Updated");

      // cleanup
      await prisma.user.delete({ where: { email: testEmail } });
    });
  });

  describe("⑤ cursor & distinct", () => {
    it("paginates with cursor", async () => {
      const { client, admin } = await property;
      const users = await client.FindManyUser({ limit: 2 }, { user: admin });
      expect(users.findManyUser.length).toBe(2);

      const cursorRes = await client.FindManyUser(
        {
          cursor: { id: users.findManyUser[0].id },
          limit: 1,
        },
        { user: admin },
      );
      expect(cursorRes.findManyUser.length).toBe(1);
      expect(cursorRes.findManyUser[0].id).toBe(users.findManyUser[0].id);
    });

    it("filters with distinct", async () => {
      const { client, admin } = await property;
      const title = `distinct_${Date.now()}`;
      await prisma.post.createMany({
        data: [
          { title, content: "desc A", authorId: admin.id },
          { title, content: "desc B", authorId: admin.id },
        ],
      });

      const distinctRes = await client.FindManyPost(
        {
          filter: { title: { equals: title } },
          distinct: ["title"],
        },
        { user: admin },
      );
      expect(distinctRes.findManyPost.length).toBe(1);

      // cleanup
      await prisma.post.deleteMany({ where: { title } });
    });
  });

  describe("⑥ Async authority, replace, and parameter callbacks", () => {
    it("works with async authority and async replace functions", async () => {
      const reset = setFieldDirective("User", "roles", [
        `@pothos-generator readable ["ADMIN"]`,
      ]);
      try {
        const [customClient] = await getClient((builder) => {
          builder.options.pothosPrismaGenerator!.authority = async ({
            context,
          }) => {
            await new Promise((r) => setTimeout(r, 10));
            return context.user?.roles ?? [];
          };
          builder.options.pothosPrismaGenerator!.replace = {
            "%%ASYNC_NAME%%": async () => {
              await new Promise((r) => setTimeout(r, 10));
              return "Async Replaced Name";
            },
          };
          builder.addModelParameterCallback(async (params) => {
            await new Promise((r) => setTimeout(r, 10));
            return params;
          });
        });

        const { admin, user } = await property;

        // Async authority with ADMIN permission succeeds
        const res = await customClient.FindManyUser(
          { limit: 1 },
          { user: admin },
        );
        expect(res.findManyUser.length).toBe(1);

        // Async authority without ADMIN permission rejects on readable field
        await expect(
          customClient.FindManyUser({ limit: 1 }, { user }),
        ).rejects.toMatchObject([
          {
            message: "No permission",
          },
        ]);
      } finally {
        reset();
      }
    });
  });

  describe("⑦ Field-level writable directive & authority checks", () => {
    it("excludes field with writable false from input types", () => {
      const reset = setFieldDirective("User", "name", [
        `@pothos-generator writable false`,
      ]);
      try {
        const schema = getSchema();
        const userCreateInput = schema.getType("UserCreateInput") as any;
        expect(userCreateInput.getFields().name).toBeUndefined();

        const userUpdateInput = schema.getType("UserUpdateInput") as any;
        expect(userUpdateInput.getFields().name).toBeUndefined();
      } finally {
        reset();
      }
    });

    it("enforces writable authority on input fields with array or object notation", async () => {
      // 1. Array notation: writable ["ADMIN"]
      const resetArray = setFieldDirective("User", "name", [
        `@pothos-generator writable ["ADMIN"]`,
      ]);
      try {
        const [customClient] = await getClient();
        const { user, admin } = await property;

        await expect(
          customClient.UpdateOneUser(
            {
              where: { id: user.id },
              data: { name: "New Name" },
            },
            { user: { ...user, roles: ["USER"] } },
          ),
        ).rejects.toMatchObject([
          {
            message: "Field 'name' is not writable for your authority",
          },
        ]);

        const res = await customClient.UpdateOneUser(
          {
            where: { id: user.id },
            data: { name: "Admin Updated" },
          },
          { user: admin },
        );
        expect(res.updateOneUser.name).toBe("Admin Updated");
      } finally {
        resetArray();
      }

      // 2. Object notation: writable { authority: ["ADMIN"] }
      const resetObj = setFieldDirective("User", "name", [
        `@pothos-generator writable { authority: ["ADMIN"] }`,
      ]);
      try {
        const [customClient] = await getClient();
        const { user } = await property;

        await expect(
          customClient.UpdateOneUser(
            {
              where: { id: user.id },
              data: { name: "Forbidden Name" },
            },
            { user: { ...user, roles: ["USER"] } },
          ),
        ).rejects.toMatchObject([
          {
            message: "Field 'name' is not writable for your authority",
          },
        ]);
      } finally {
        resetObj();
      }
    });
  });
});
