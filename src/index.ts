import SchemaBuilder, {
  BasePlugin,
  BuildCache,
  SchemaTypes,
} from "@pothos/core";
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
  generator: PrismaSchemaGenerator<Types>;
  constructor(
    buildCache: BuildCache<Types>,
    name: keyof PothosSchemaTypes.Plugins<Types>
  ) {
    super(buildCache, name);
    this.generator = new PrismaSchemaGenerator(this.builder);
  }
  beforeBuild(): void {
    const builder = this.builder;

    // Add custom scalar types
    if (builder.options.pothosPrismaGenerator?.autoScalers !== false) {
      builder.addScalarType("BigInt" as never, BigIntResolver, {});
      builder.addScalarType("Byte" as never, ByteResolver, {});
      builder.addScalarType("DateTime" as never, DateTimeResolver, {});
      builder.addScalarType("Json" as never, JSONResolver, {});
    }

    const generator = this.generator;
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
  // wrapResolve(
  //   resolver: GraphQLFieldResolver<unknown, Types["Context"], object>,
  //   fieldConfig: PothosOutputFieldConfig<Types>
  // ): GraphQLFieldResolver<unknown, Types["Context"], object> {
  //   // const getObjectTypeRef = (type: PothosOutputFieldType<Types>) => {
  //   //   const isList = type.kind === "List";
  //   //   const typeConfig = type.kind === "List" ? type.type : type;
  //   //   return typeConfig.kind === "Object"
  //   //     ? ([
  //   //         isList,
  //   //         this.buildCache.getTypeConfig(typeConfig.ref).name,
  //   //       ] as const)
  //   //     : [];
  //   // };

  //   // const [isList, modelName] = getObjectTypeRef(fieldConfig.type);
  //   // const generator = this.generator;
  //   // if (modelName) {
  //   //   const operationPrefix = isList ? "findMany" : "findFirst";
  //   //   const orderOperation = generator.modelOrder[modelName][operationPrefix];
  //   //   const whereOperation = generator.modelWhere[modelName][operationPrefix];
  //   //   if (orderOperation?.length || whereOperation?.length) {
  //   //     return async (parent, args, context, info) => {
  //   //       const authority = await generator.getAuthority(context);
  //   //       const modelOrder = await generator.getModelOrder(
  //   //         modelName,
  //   //         operationPrefix,
  //   //         authority
  //   //       );
  //   //       const modelWhere = await generator.getModelWhere(
  //   //         modelName,
  //   //         operationPrefix,
  //   //         authority,
  //   //         context
  //   //       );
  //   //       const where = {
  //   //         ...(args as { filter: object }).filter,
  //   //         ...modelWhere,
  //   //       };
  //   //       if (!field.isList) return { where };
  //   //       return {
  //   //         where: Object.keys(where).length ? where : undefined,
  //   //         orderBy:
  //   //           args.orderBy && Object.keys(args.orderBy).length
  //   //             ? args.orderBy
  //   //             : modelOrder,
  //   //       };

  //   //       return resolver(parent, args, context, info);
  //   //     };
  //   //   }
  //   // }
  //   return resolver;
  // }
}

const pluginName = "pothosPrismaGenerator" as const;
const allowPluginReRegistration = SchemaBuilder.allowPluginReRegistration;
SchemaBuilder.allowPluginReRegistration = true;
SchemaBuilder.registerPlugin(pluginName, PothosPrismaGeneratorPlugin);
SchemaBuilder.allowPluginReRegistration = allowPluginReRegistration;
export default pluginName;
