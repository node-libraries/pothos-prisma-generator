import SchemaBuilder, {
  BasePlugin,
  BuildCache,
  PothosOutputFieldConfig,
  SchemaTypes,
} from "@pothos/core";
import "../global-types.js";
import { GraphQLFieldResolver } from "graphql";
import {
  BigIntResolver,
  ByteResolver,
  DateTimeResolver,
  HexadecimalResolver,
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
  createModelCountQuery,
  createModelUniqueQuery,
} from "./createPothosSchema.js";
import { PrismaSchemaGenerator } from "./generator/PrismaSchemaGenerator.js";

export class PothosPrismaGeneratorPlugin<
  Types extends SchemaTypes,
  T extends object = object
> extends BasePlugin<Types, T> {
  generator: PrismaSchemaGenerator<Types>;
  constructor(
    buildCache: BuildCache<Types>,
    name: keyof PothosSchemaTypes.Plugins<Types, T>
  ) {
    super(buildCache, name);
    const generator = new PrismaSchemaGenerator<Types>(this.builder);
    this.generator = generator;
    const builder = this.builder;
    builder.options.pothosPrismaGenerator?.callbacks?.forEach((callback) =>
      callback({ builder, generator })
    );
    generator.createModels();
    generator.modelFields =
      builder.options.pothosPrismaGenerator?.modelFields ?? {};
  }
  beforeBuild(): void {
    const builder = this.builder;
    const generator = this.generator;

    // Add custom scalar types
    if (builder.options.pothosPrismaGenerator?.autoScalers !== false) {
      builder.addScalarType("BigInt" as never, BigIntResolver, {});
      builder.addScalarType("Bytes" as never, ByteResolver, {});
      builder.addScalarType("DateTime" as never, DateTimeResolver, {});
      builder.addScalarType("Json" as never, JSONResolver, {});
      builder.addScalarType("Decimal" as never, HexadecimalResolver, {});
    }

    const replace = builder.options.pothosPrismaGenerator?.replace;
    if (replace) {
      Object.entries(replace).forEach(([key, value]) => {
        generator.addReplaceValue(key, value);
      });
    }
    const authority = builder.options.pothosPrismaGenerator?.authority;
    if (authority) {
      generator.setAuthority(authority);
    }
    createModelObject(generator);

    if (!builder.configStore.typeConfigs.has("Query")) {
      builder.queryType({});
    }

    builder.queryFields(
      (t) =>
        ({
          ...createModelCountQuery(t, generator),
          ...createModelUniqueQuery(t, generator),
          ...createModelQuery(t, generator),
          ...createModelListQuery(t, generator),
        } as never)
    );

    if (!builder.configStore.typeConfigs.has("Mutation")) {
      builder.mutationType({});
    }

    builder.mutationFields(
      (t) =>
        ({
          ...createModelMutation(t, generator),
          ...createManyModelMutation(t, generator),
          ...updateModelMutation(t, generator),
          ...updateManyModelMutation(t, generator),
          ...deleteModelMutation(t, generator),
          ...deleteManyModelMutation(t, generator),
        } as never)
    );
  }
  wrapResolve(
    resolver: GraphQLFieldResolver<unknown, SchemaTypes["Context"], object>,
    fieldConfig: PothosOutputFieldConfig<SchemaTypes>
  ) {
    const fieldDirectives = Object.values(
      this.generator.fieldDirectives[fieldConfig.parentType] ?? {}
    ).filter((v) => Object.keys(v).length);
    if (fieldDirectives.length) {
      const readable = this.generator.getFieldReadable(
        fieldConfig.parentType,
        fieldConfig.name
      );

      const newResolver: GraphQLFieldResolver<
        unknown,
        SchemaTypes["Context"],
        object
      > = (source, args, context, info) => {
        const authority = this.generator.getAuthority(context);
        if (readable) {
          if (!authority.some((v) => readable.has(v)))
            throw new Error("No permission");
        }
        return resolver(source, args, context, info);
      };
      return newResolver;
    }

    return resolver;
  }
}

const schemaBuilderProto =
  SchemaBuilder.prototype as PothosSchemaTypes.SchemaBuilder<SchemaTypes>;

schemaBuilderProto.addModelFields = function (modelName, fields) {
  const options = this.options.pothosPrismaGenerator;
  if (options) {
    if (!options.modelFields) {
      options.modelFields = {};
    }
    if (!options.modelFields[modelName]) {
      options.modelFields[modelName] = {} as never;
    }
    options.modelFields[modelName] = {
      ...options.modelFields[modelName],
      ...fields,
    };
  }
};

schemaBuilderProto.addSchemaGenerator = function (callback) {
  const options = this.options.pothosPrismaGenerator;
  if (options) {
    if (!options.callbacks) {
      options.callbacks = [];
    }
    options.callbacks.push(callback);
  }
};

schemaBuilderProto.addModelOptions = function (
  modelName,
  filterOperations,
  options
) {
  this.addSchemaGenerator((c) => {
    c.generator.addModelOptions(modelName, filterOperations, options);
  });
};

schemaBuilderProto.addModelOperations = function (modelName, filterOperations) {
  this.addSchemaGenerator((c) => {
    c.generator.addModelOperations(modelName, filterOperations);
  });
};

schemaBuilderProto.addModelDirectives = function (
  modelName,
  directive,
  values
) {
  this.addSchemaGenerator((c) => {
    c.generator.addModelDirectives(modelName, directive, values);
  });
};

schemaBuilderProto.addFieldDirectives = function (
  modelName,
  fieldName,
  directive,
  value
) {
  this.addSchemaGenerator((c) => {
    c.generator.addFieldDirectives(modelName, fieldName, directive, value);
  });
};

schemaBuilderProto.addModelParameterCallback = function (callback) {
  this.addSchemaGenerator((c) => {
    c.generator.addModelParameterCallback(callback);
  });
};
