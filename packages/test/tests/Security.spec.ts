import { createPrismaClient } from "../libs/client";
import { beforeAllAsync } from "../libs/async";
import { getClient, setModelDirective } from "../libs/test-tools";
import { createBuilder } from "../libs/builder";
import { PrismaSchemaGenerator } from "pothos-prisma-generator";
import gql from "graphql-tag";

describe("Security fixes", () => {
  const prisma = createPrismaClient({});

  const property = beforeAllAsync(async () => {
    // Post モデルに mutation の実行権限を ADMIN のみに制限
    setModelDirective("Post", [
      `@pothos-generator executable {include:["createOne"],authority:["ADMIN"]}`,
      `@pothos-generator limit {limit:5}`,
      `@pothos-generator where {include:["query"],where:{published:true}}`,
      `@pothos-generator input-data {data:{author:{connect:{id:"%%USER%%"}}},authority:["ADMIN"]}`,
      `@pothos-generator operation {exclude:["deleteMany"]}`,
      `@pothos-generator operation {exclude:["createMany"]}`,
    ]);

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "example@example.com" },
    });
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@example.com" },
    });
    const [client, requester] = await getClient();
    return { user, admin, client, requester };
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  it("createOne enforces executable permission check", async () => {
    const { client, user, admin } = await property;

    // 一般ユーザーは createOne の権限が無いため 'No permission' エラーになること
    await expect(
      client.CreateOnePost(
        { input: { title: "Forbidden", content: "Forbidden" } },
        { user }
      )
    ).rejects.toMatchObject([
      {
        message: "No permission",
      },
    ]);

    // 未認証ユーザーもエラーになること
    await expect(
      client.CreateOnePost({
        input: { title: "Unauth", content: "Unauth" },
      })
    ).rejects.toMatchObject([
      {
        message: "No permission",
      },
    ]);

    // ADMIN は成功すること
    await expect(
      client.CreateOnePost(
        { input: { title: "Allowed", content: "Allowed" } },
        { user: admin }
      )
    ).resolves.toMatchObject({
      createOnePost: {
        title: "Allowed",
      },
    });
  });

  it("prevents modelLimit bypass via negative limit or zero limit", async () => {
    const { client } = await property;

    // 負の limit を渡しても、全件取得や逆走バイパスにならず安全に 0 件（または上限内）になること
    const resNegative = await client.FindManyPost({ limit: -100 });
    expect(resNegative.findManyPost).toHaveLength(0);

    // limit: 0 の場合も 0 件になること
    const resZero = await client.FindManyPost({ limit: 0 });
    expect(resZero.findManyPost).toHaveLength(0);

    // limit なしの場合は modelLimit(5) が適用されること
    const resDefault = await client.FindManyPost();
    expect(resDefault.findManyPost.length).toBeLessThanOrEqual(5);
  });

  it("multiple operation directives properly merge without overriding", async () => {
    const { requester, admin } = await property;

    // exclude: deleteMany と exclude: createMany の両方が GraphQL スキーマから除外されていること
    await expect(
      requester(
        gql`
          mutation {
            deleteManyPost(where: {})
          }
        `,
        { user: admin }
      )
    ).rejects.toThrow();

    await expect(
      requester(
        gql`
          mutation {
            createManyPost(input: [])
          }
        `,
        { user: admin }
      )
    ).rejects.toThrow();
  });

  it("replaceValue does not mutate original object across multiple requests", () => {
    const testBuilder = createBuilder();
    const generator = new PrismaSchemaGenerator(testBuilder);

    generator.addReplaceValue(
      "%%USER%%",
      ({ context }: { context: { user?: { id: string } } }) => context.user?.id
    );

    const template = {
      nested: {
        author: {
          id: "%%USER%%",
        },
      },
      list: ["%%USER%%"],
    };

    // User A のコンテキストで置換
    const resA = generator.replaceValue(template, {
      context: { user: { id: "user-A" } },
    });
    expect(resA.nested.author.id).toBe("user-A");
    expect(resA.list[0]).toBe("user-A");

    // 元のオブジェクトが破壊されていないこと
    expect(template.nested.author.id).toBe("%%USER%%");
    expect(template.list[0]).toBe("%%USER%%");

    // User B のコンテキストで置換した際、User A の値で汚染されていないこと
    const resB = generator.replaceValue(template, {
      context: { user: { id: "user-B" } },
    });
    expect(resB.nested.author.id).toBe("user-B");
    expect(resB.list[0]).toBe("user-B");

    // 未ログイン（user is undefined）の場合に undefined に置換され、%%USER%% が残らないこと
    const resAnon = generator.replaceValue(template, { context: {} });
    expect(resAnon.nested.author.id).toBeUndefined();
    expect(resAnon.list[0]).toBeUndefined();
  });
});
