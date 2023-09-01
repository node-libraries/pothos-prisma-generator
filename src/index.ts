import SchemaBuilder, { BasePlugin, SchemaTypes } from "@pothos/core";
import "./global-types";
import {
  BigIntResolver,
  ByteResolver,
  DateTimeResolver,
  JSONResolver,
} from "graphql-scalars";
import {
  createModelListQuery,
  createModelMutation,
  createManyModelMutation,
  createModelObject,
  createModelQuery,
  deleteManyModelMutation,
  deleteModelMutation,
  updateManyModelMutation,
  updateModelMutation,
} from "./libs/createPothosSchema";
import { PrismaSchemaGenerator } from "./libs/generator/PrismaSchemaGenerator";

export class PothosPrismaGeneratorPlugin<
  Types extends SchemaTypes
> extends BasePlugin<Types> {
  beforeBuild(): void {
    const builder = this.builder;

    // Add custom scalar types
    if (builder.options.pothosPrismaGenerator?.autoScalers !== false) {
      builder.addScalarType("BigInt" as never, BigIntResolver, {});
      builder.addScalarType("Byte" as never, ByteResolver, {});
      builder.addScalarType("DateTime" as never, DateTimeResolver, {});
      builder.addScalarType("Json" as never, JSONResolver, {});
    }

    const generator = new PrismaSchemaGenerator(builder);
    const replace = builder.options.pothosPrismaGenerator?.replace;
    replace &&
      Object.entries(replace).forEach(([key, value]) => {
        generator.addReplaceValue(key, value);
      });
    const authority = builder.options.pothosPrismaGenerator?.authority;
    authority && generator.setAuthority(authority);
    createModelObject(generator);

    if (!builder.configStore.typeConfigs.has("Query")) {
      builder.queryType({});
    }

    builder.queryFields((t) => ({
      ...createModelQuery(t, generator),
      ...createModelListQuery(t, generator),
    }));

    if (!builder.configStore.typeConfigs.has("Mutation")) {
      builder.mutationType({});
    }

    builder.mutationFields((t) => ({
      ...createModelMutation(t, generator),
      ...createManyModelMutation(t, generator),
      ...updateModelMutation(t, generator),
      ...updateManyModelMutation(t, generator),
      ...deleteModelMutation(t, generator),
      ...deleteManyModelMutation(t, generator),
    }));
  }
}

const pluginName = "pothosPrismaGenerator" as const;
const allowPluginReRegistration = SchemaBuilder.allowPluginReRegistration;
SchemaBuilder.allowPluginReRegistration = true;
SchemaBuilder.registerPlugin(pluginName, PothosPrismaGeneratorPlugin);
SchemaBuilder.allowPluginReRegistration = allowPluginReRegistration;
export default pluginName;
