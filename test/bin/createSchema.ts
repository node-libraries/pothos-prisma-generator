import { createBuilder } from "../libs/builder";

const builder = createBuilder();

builder.options.pothosSchemaExporter = {
  output: "test/generated/schema.graphql",
};
builder.toSchema();
