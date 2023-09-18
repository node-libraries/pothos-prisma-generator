import {
  getClient,
  setFieldDirective,
  setModelDirective,
} from "../libs/test-tools";

describe("ErrorDirective", () => {
  it("model directive error", async () => {
    const restore = setModelDirective("Post", [
      `@pothos-generator operation1 {exclude:["deleteMany"]}`,
    ]);
    await expect(getClient()).rejects.toThrow(
      /^Error parsing schema directive: Post/
    );
    restore();
  });
  it("model parse error", async () => {
    const restore = setModelDirective("Post", [
      `@pothos-generator operation {exclude-["deleteMany"]}`,
    ]);
    await expect(getClient()).rejects.toThrow(
      /SyntaxError: JSON5: invalid character '-'/
    );
    restore();
  });
  it("field directive error", async () => {
    const restore = setFieldDirective("User", "roles", [
      ` @pothos-generator readable2 ["ADMIN"]`,
    ]);
    await expect(getClient()).rejects.toThrow(
      /^Error parsing schema directive: User.roles/
    );
    restore();
  });
  it("field parse error", async () => {
    const restore = setFieldDirective("User", "roles", [
      ` @pothos-generator readable [ADMIN]`,
    ]);
    await expect(getClient()).rejects.toThrow(
      /SyntaxError: JSON5: invalid character 'A'/
    );
    restore();
  });
});
