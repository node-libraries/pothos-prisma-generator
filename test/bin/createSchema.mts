import { builder } from "../libs/builder";

builder.options.pothosSchemaExporter = {
  output: "test/generated/schema.graphql",
};
builder.toSchema();
