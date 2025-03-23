import SchemaBuilder from "@pothos/core";
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
