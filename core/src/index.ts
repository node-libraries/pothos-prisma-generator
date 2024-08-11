import SchemaBuilder, { SchemaTypes } from "@pothos/core";
import { PrismaSchemaGenerator } from "./libs/generator/PrismaSchemaGenerator.js";
import { PothosPrismaGeneratorPlugin } from "./libs/PothosPrismaGeneratorPlugin.js";
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

export type CustomGeneratorNames = "checkModelExecutable";

export const addCustomGenerator = <
  Types extends Partial<PothosSchemaTypes.UserSchemaTypes>,
  K extends keyof PrismaSchemaGenerator<Types> & CustomGeneratorNames
>(
  builder: PothosSchemaTypes.SchemaBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<Types>
  >,
  name: K,
  callback: PrismaSchemaGenerator<Types>[K]
) => {
  const option = builder.options[pluginName];
  if (option) {
    if (!option.custom) {
      option.custom = {};
    }
    option.custom[name] = [...(option.custom[name] ?? []), callback];
  }
};
