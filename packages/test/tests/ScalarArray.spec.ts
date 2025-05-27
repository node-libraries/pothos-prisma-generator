import { PrismaClient } from "@prisma/client";
import { beforeAllAsync } from "jest-async";
import { getClient } from "../libs/test-tools";

describe("ScalarArray", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    const typeTest = await prisma.typeTest.findFirst({
      where: { role: "USER" },
    });
    const [client] = await getClient();
    return { typeTest, client };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("should create TypeTest with scalarList array using Prisma", async () => {
    const result = await prisma.typeTest.create({
      data: {
        role: "USER",
        scalarList: ["item1", "item2", "item3"],
      },
    });
    expect(result.scalarList).toEqual(["item1", "item2", "item3"]);
    expect(result.role).toBe("USER");
  });

  it("should update TypeTest scalarList array using Prisma", async () => {
    const { typeTest } = await property;
    if (!typeTest) throw new Error("TypeTest not found");
    const result = await prisma.typeTest.update({
      where: { id: typeTest.id },
      data: {
        scalarList: ["updated1", "updated2"],
      },
    });
    expect(result.scalarList).toEqual(["updated1", "updated2"]);
  });

  it("should find TypeTest with scalarList array using Prisma", async () => {
    const { typeTest } = await property;
    if (!typeTest) throw new Error("TypeTest not found");
    const result = await prisma.typeTest.findUnique({
      where: { id: typeTest.id },
    });
    expect(result?.scalarList).toBeDefined();
    expect(Array.isArray(result?.scalarList)).toBe(true);
  });

  it("should find many TypeTest with scalarList arrays using Prisma", async () => {
    const result = await prisma.typeTest.findMany({});
    expect(result.length).toBeGreaterThan(0);
    result.forEach((item) => {
      expect(Array.isArray(item.scalarList)).toBe(true);
    });
  });

  it("should handle empty scalarList array using Prisma", async () => {
    const result = await prisma.typeTest.create({
      data: {
        role: "ADMIN",
        scalarList: [],
      },
    });
    expect(result.scalarList).toEqual([]);
  });

  it("should count TypeTest records using Prisma", async () => {
    const result = await prisma.typeTest.count({});
    expect(result).toBeGreaterThan(0);
  });

  it("should filter TypeTest by scalarList content", async () => {
    await prisma.typeTest.create({
      data: {
        role: "USER",
        scalarList: ["test", "filter"],
      },
    });
    const result = await prisma.typeTest.findMany({
      where: {
        scalarList: {
          has: "test",
        },
      },
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(item => item.scalarList.includes("test"))).toBe(true);
  });
});
