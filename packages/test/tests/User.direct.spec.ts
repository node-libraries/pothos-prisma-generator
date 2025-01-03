import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { addSchemaGeneratorCallback } from "../../pothos-prisma-generator/src";
import { getClient } from "../libs/test-tools";

describe("User(Direct)", () => {
  const prisma = new PrismaClient({});
  const property = beforeAllAsync(async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@example.com" },
    });
    const client = await getClient((builder) => {
      addSchemaGeneratorCallback(builder, ({ generator }) => {
        generator.addModelOptions(
          "User",
          { include: ["mutation"] },
          { authScopes: { ADMIN: true } }
        );
        generator.addModelOperations("User", {
          include: ["createOne", "updateOne", "findMany"],
        });
        generator.addFieldDirectives("User", "roles", "readable", ["ADMIN"]);
      });
    });
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
    const { client, admin, user } = await property;
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
    ).rejects.toMatchObject([
      {
        message:
          'Cannot query field "updateManyUser" on type "Mutation". Did you mean "updateOneUser", "updateManyPost", "createOneUser", or "updateManyCategory"?',
      },
    ]);
  });
});
