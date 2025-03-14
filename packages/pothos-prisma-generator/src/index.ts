import SchemaBuilder, { SchemaTypes, type FieldRef } from "@pothos/core";
import { PothosPrismaGeneratorPlugin } from "./libs/PothosPrismaGeneratorPlugin.js";
import type { GeneratorCallback } from "./global-types.ts";
import type { PrismaModelTypes } from "@pothos/plugin-prisma";
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

export const addModelField = <
  Types extends SchemaTypes,
  Name extends keyof Types["PrismaTypes"],
  Model extends PrismaModelTypes & Types["PrismaTypes"][Name],
  Shape extends Model["Shape"]
>(
  builder: PothosSchemaTypes.SchemaBuilder<Types>,
  {
    modelName,
    fieldName,
    field,
  }: {
    modelName: Name & string;
    fieldName: string;
    field: (
      t: PothosSchemaTypes.PrismaObjectFieldBuilder<Types, Model, Shape>
    ) => FieldRef<Types>;
  }
) => {
  const options = builder.options[pluginName];
  if (options) {
    if (!options.modelFields) {
      options.modelFields = {};
    }
    if (!options.modelFields[modelName]) {
      options.modelFields[modelName] = {};
    }
    options.modelFields[modelName][fieldName] = field;
  }
};
