import { createBuilder } from "../libs/builder";

const builder = createBuilder();

builder.options.pothosSchemaExporter = {
  output: "generated/schema.graphql",
};
builder.toSchema();
