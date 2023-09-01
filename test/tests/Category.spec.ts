import { PrismaClient } from "@prisma/client";
import gql from "graphql-tag";
import { beforeAllAsync } from "jest-async";
import { getApolloServer, getBodyData } from "../libs/test-tools";

describe("Category", () => {
  const prisma = new PrismaClient({});

  const property = beforeAllAsync(async () => {
    const server = await getApolloServer();
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    return { server, user };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("Query: findManyCategory", async () => {
    const { server } = await property;
    await server
      .executeOperation(
        {
          query: gql`
            query FindManyCategory {
              findManyCategory {
                id
                name
                posts {
                  id
                  published
                  title
                  content
                  author {
                    id
                    name
                    createdAt
                    updatedAt
                  }
                  createdAt
                  updatedAt
                  publishedAt
                }
                createdAt
                updatedAt
              }
            }
          `,
        },
        { contextValue: { prisma } }
      )
      .then((result) => {
        const { data } = getBodyData(result);
        const findManyCategory = data?.findManyCategory;
        expect(findManyCategory).not.toHaveLength(0);
        expect;
      });
  });
});
