import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { getClient, setFieldDirective } from "../libs/test-tools";

describe("Order", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    setFieldDirective("User", "roles", [` @pothos-generator readable []`]);
    const [client] = await getClient();
    return { client };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("findManyCategory", async () => {
    const { client } = await property;
    expect(client.FindManyUser()).rejects.toMatchObject([{}]);
  });
});
