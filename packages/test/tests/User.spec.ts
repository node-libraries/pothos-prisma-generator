import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import {
  getClient,
  setFieldDirective,
  setModelDirective,
} from "../libs/test-tools";

describe("User", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    setModelDirective("User", [
      `@pothos-generator operation {include:["createOne","updateOne","findMany"]}`,
      `@pothos-generator option {include:["mutation"],option:{authScopes:{ADMIN:true}}}`,
    ]);
    setFieldDirective("User", "roles", [
      ` @pothos-generator readable ["ADMIN"]`,
    ]);
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@example.com" },
    });
    const [client] = await getClient();
    return { user, admin, client };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("FindManyUser", async () => {
    const { client, admin } = await property;
    await expect(
      client.FindManyUser({}, { user: admin })
    ).resolves.toMatchObject({
      findManyUser: expect.any(Array),
    });
  });

  it("FindManyUser(Error)", async () => {
    const { client, user } = await property;
    await expect(client.FindManyUser({}, {})).rejects.toMatchObject([
      {
        message: "No permission",
      },
    ]);
    await expect(client.FindManyUser({}, { user })).rejects.toMatchObject([
      {
        message: "No permission",
      },
    ]);
  });

  it("UpdateOneUser", async () => {
    const { client, admin, user } = await property;
    await expect(
      client.UpdateOneUser(
        { data: { name: "test_abc" }, where: { id: user.id } },
        { user: admin }
      )
    ).resolves.toMatchObject({
      updateOneUser: expect.any(Object),
    });
  });

  it("UpdateOneUser(Error)", async () => {
    const { client, user } = await property;
    await expect(
      client.UpdateOneUser(
        { data: { name: "test_abc" }, where: { id: user.id } },
        { user }
      )
    ).rejects.toMatchObject([
      {
        message: "Not authorized to resolve Mutation.updateOneUser",
      },
    ]);
  });
  it("UpdateMany(Error)", async () => {
    const { client, admin } = await property;
    await expect(
      client.UpdateManyUser(
        { data: { name: "test_abc" }, where: {} },
        { user: admin }
      )
    ).rejects.toThrow();
  });
});
