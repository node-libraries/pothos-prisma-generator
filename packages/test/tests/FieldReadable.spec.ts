import { beforeAllAsync } from "../libs/async";
import { createPrismaClient } from "../libs/client";
import { getClient, setFieldDirective } from "../libs/test-tools";

describe("Order", () => {
  const prisma = createPrismaClient({});

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
    await expect(client.FindManyUser()).rejects.toMatchObject([{}]);
  });
});
