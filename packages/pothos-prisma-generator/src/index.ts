import SchemaBuilder, { SchemaTypes } from "@pothos/core";
import { PothosPrismaGeneratorPlugin } from "./libs/PothosPrismaGeneratorPlugin.js";
import type { GeneratorCallback } from "./global-types.ts";
export * from "./libs/generator/PrismaCrudGenerator.js";
export * from "./libs/generator/PrismaSchemaGenerator.js";
export * from "./libs/createPothosSchema.js";
export * from "./global-types.js";

const pluginName = "pothosPrismaGenerator" as const;
const allowPluginReRegistration = SchemaBuilder.allowPluginReRegistration;
SchemaBuilder.allowPluginReRegistration = true;
SchemaBuilder.registerPlugin(pluginName, PothosPrismaGeneratorPlugin);
SchemaBuilder.allowPluginReRegistration = allowPluginReRegistration;
export default pluginName;

export const addSchemaGeneratorCallback = <Types extends SchemaTypes>(
  builder: PothosSchemaTypes.SchemaBuilder<Types>,
  callback: GeneratorCallback<Types>
) => {
  const options = builder.options[pluginName];
  if (options) {
    if (!options.callbacks) {
      options.callbacks = [];
    }
    options.callbacks.push(callback);
  }
};
