import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
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
    });
  });
});
