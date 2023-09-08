/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @transform-path ./generator/PrismaSchemaGenerator.js
import { PrismaSchemaGenerator } from "./generator/PrismaSchemaGenerator";
import type {
  InputFieldRef,
  InputShapeFromFields,
  SchemaTypes,
} from "@pothos/core";
type LowerFirst<T extends string> = T extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${R}`
  : T;

const lowerFirst = <T extends string>(str: T) => {
  return (str.charAt(0).toLowerCase() + str.slice(1)) as LowerFirst<T>;
};

const getPrisma = <T extends SchemaTypes, ParentShape>(
  t:
    | PothosSchemaTypes.ObjectFieldBuilder<T, ParentShape>
    | PothosSchemaTypes.QueryFieldBuilder<T, ParentShape>
    | PothosSchemaTypes.MutationFieldBuilder<T, ParentShape>,
  ctx = {}
): any => {
  const prisma = t.builder.options.prisma.client;
  return typeof prisma === "function" ? prisma(ctx) : prisma;
};

export const createModelObject = (generator: PrismaSchemaGenerator<any>) => {
  const builder = generator.getBuilder();
  generator.getModels().map((model) => {
    const selectFields = new Set(
      generator.getModelSelect(model.name)["findFirst"]
    );
    builder.prismaObject(model.name, {
      fields: (t) => {
        const fields = model.fields
          .filter(({ name }) => selectFields.has(name))
          .flatMap((field) => {
            if (field.isId) {
              return [[field.name, t.exposeID(field.name)] as const];
            }
            if (field.kind === "scalar") {
              return [
                [
                  field.name,
                  t.expose(field.name, {
                    type: field.isList ? t.listRef(field.type) : field.type,
                    nullable: !field.isRequired,
                  }),
                ] as const,
              ];
            }
            if (field.kind === "enum") {
              return [
                [
                  field.name,
                  t.expose(field.name, {
                    type: generator.getEnum(field.type)!,
                    nullable: !field.isRequired,
                  }),
                ] as const,
              ];
            }

            const createField = () => {
              const operationPrefix = field.isList ? "findMany" : "findFirst";
              const options = generator.getModelOptions(field.type)[
                operationPrefix
              ];
              return t.relation(field.name, {
                ...options,
                args: field.isList
                  ? {
                      ...generator.findManyArgs(field.type),
                      ...generator.pagerArgs(),
                    }
                  : undefined,
                query: (args, ctx) => {
                  const authority = generator.getAuthority(ctx);
                  const modelOrder = generator.getModelOrder(
                    field.type,
                    operationPrefix,
                    authority
                  );
                  const modelWhere = generator.getModelWhere(
                    field.type,
                    operationPrefix,
                    authority,
                    ctx
                  );
                  const modelLimit = generator.getModelLimit(
                    model.name,
                    operationPrefix,
                    authority
                  );
                  const take =
                    modelLimit && args.limit
                      ? Math.min(modelLimit, args.limit)
                      : modelLimit ?? args.limit;

                  const where = { ...args.filter, ...modelWhere };
                  const skip = args.offset;
                  if (!field.isList) return { where };
                  return {
                    where: Object.keys(where).length ? where : undefined,
                    orderBy:
                      args.orderBy && Object.keys(args.orderBy).length
                        ? args.orderBy
                        : modelOrder,
                    take,
                    skip,
                  };
                },
              });
            };

            const createCount = () => {
              const operationPrefix = "count";
              const options = generator.getModelOptions(field.type)[
                operationPrefix
              ];
              return t.relationCount(`${field.name}`, {
                ...options,
                args: {
                  filter: t.arg({
                    type: generator.getWhere(model.name),
                    required: false,
                  }),
                },
                where: (args: { filter?: object }, ctx: object) => {
                  const authority = generator.getAuthority(ctx);
                  const modelWhere = generator.getModelWhere(
                    field.type,
                    operationPrefix,
                    authority,
                    ctx
                  );
                  return { ...args.filter, ...modelWhere };
                },
              });
            };

            return field.isList
              ? [
                  [field.name, createField()] as const,
                  [`${field.name}Count`, createCount()] as const,
                ]
              : [[field.name, createField()] as const];
          });
        return Object.fromEntries(fields);
      },
    });
  });
};

export const createModelCountQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "count";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map((model) => {
        const options = generator.getModelOptions(model.name)[operationPrefix];
        return [
          `${operationPrefix}${model.name}`,
          t.int({
            ...options,
            args: {
              filter: t.arg({
                type: generator.getWhere(model.name),
                required: false,
              }),
            },
            resolve: async (
              _root,
              args: InputShapeFromFields<{
                filter: InputFieldRef<any, "Arg">;
              }>,
              ctx,
              _info
            ) => {
              const prisma = getPrisma(t, ctx);
              const authority = generator.getAuthority(ctx);
              const modelWhere = generator.getModelWhere(
                model.name,
                operationPrefix,
                authority,
                ctx
              );
              const where = { ...args.filter, ...modelWhere };
              return prisma[lowerFirst(model.name)].count({
                where: Object.keys(where).length ? where : undefined,
              });
            },
          }),
        ];
      })
  );
};

export const createModelQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "findFirst";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map((model) => {
        const options = generator.getModelOptions(model.name)[operationPrefix];
        return [
          `${operationPrefix}${model.name}`,
          t.prismaField({
            ...options,
            type: model.name,
            nullable: true,
            args: {
              ...generator.findManyArgs(model.name),
              ...generator.pagerArgs(),
            },

            resolve: async (query, _root, args, ctx, _info) => {
              const prisma = getPrisma(t, ctx);
              const authority = generator.getAuthority(ctx);
              const modelOrder = generator.getModelOrder(
                model.name,
                operationPrefix,
                authority
              );
              const modelWhere = generator.getModelWhere(
                model.name,
                operationPrefix,
                authority,
                ctx
              );
              const modelLimit = generator.getModelLimit(
                model.name,
                operationPrefix,
                authority
              );
              const where = { ...args.filter, ...modelWhere };
              const take =
                modelLimit && args.limit
                  ? Math.min(modelLimit, args.limit)
                  : modelLimit ?? args.limit;
              const skip = args.offset;
              return prisma[lowerFirst(model.name)].findFirst({
                ...query,
                where: Object.keys(where).length ? where : undefined,
                orderBy:
                  args.orderBy && Object.keys(args.orderBy).length
                    ? args.orderBy
                    : modelOrder,
                take,
                skip,
              });
            },
          }),
        ];
      })
  );
};

export const createModelListQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "findMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map((model) => {
        const options = generator.getModelOptions(model.name)[operationPrefix];
        return [
          `${operationPrefix}${model.name}`,
          t.prismaField({
            ...options,
            type: [model.name],
            args: {
              ...generator.findManyArgs(model.name),
              ...generator.pagerArgs(),
            },
            resolve: async (query, _root, args, ctx, _info) => {
              const prisma = getPrisma(t, ctx);
              const authority = generator.getAuthority(ctx);
              const modelOrder = generator.getModelOrder(
                model.name,
                operationPrefix,
                authority
              );
              const modelWhere = generator.getModelWhere(
                model.name,
                operationPrefix,
                authority,
                ctx
              );
              const where = { ...args.filter, ...modelWhere };
              const take = args.limit;
              const skip = args.offset;
              return prisma[lowerFirst(model.name)].findMany({
                ...query,
                where: Object.keys(where).length ? where : undefined,
                orderBy:
                  args.orderBy && Object.keys(args.orderBy).length
                    ? args.orderBy
                    : modelOrder,
                take,
                skip,
              });
            },
          }),
        ];
      })
  );
};

export const createModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "createOne";
  return Object.fromEntries(
    generator
      .getModels()
      .filter(({ name }) =>
        generator.getModelOperations(name).includes(operationPrefix)
      )
      .map(({ name }) => {
        const options = generator.getModelOptions(name)[operationPrefix];
        return [
          `${operationPrefix}${name}`,
          t.prismaField({
            ...options,
            type: name,
            args: {
              input: t.arg({
                type: generator.getCreateInput(name),
                required: true,
              }),
            },
            resolve: async (query, _root, args, ctx, _info) => {
              const authority = generator.getAuthority(ctx);
              const modelInput = generator.getModelInputData(
                name,
                operationPrefix,
                authority,
                ctx
              );
              const prisma = getPrisma(t, ctx);
              return prisma[lowerFirst(name)].create({
                ...query,
                data: { ...args.input, ...modelInput },
              });
            },
          }),
        ];
      })
  );
};

export const createManyModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "createMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter(({ name }) =>
        generator.getModelOperations(name).includes(operationPrefix)
      )
      .map(({ name }) => {
        const options = generator.getModelOptions(name)[operationPrefix];
        return [
          `${operationPrefix}${name}`,
          t.int({
            ...options,
            args: {
              input: t.arg({
                type: [generator.getCreateInput(name)],
                required: true,
              }),
            },
            resolve: async (_root, args, ctx, _info) => {
              const authority = generator.getAuthority(ctx);
              const modelInput = generator.getModelInputData(
                name,
                operationPrefix,
                authority,
                ctx
              );
              const prisma = getPrisma(t, ctx);
              return prisma[lowerFirst(name)]
                .createMany({
                  data: args.input.map((v) => ({ ...v, ...modelInput })),
                })
                .then(({ count }: { count: number }) => count);
            },
          }),
        ];
      })
  );
};

export const updateModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "updateOne";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map(({ name }) => {
        const options = generator.getModelOptions(name)[operationPrefix];
        return [
          `${operationPrefix}${name}`,
          t.prismaField({
            ...options,
            type: name,
            args: {
              where: t.arg({
                type: generator.getWhereUnique(name),
                required: true,
              }),
              data: t.arg({
                type: generator.getUpdateInput(name),
                required: true,
              }),
            },
            resolve: async (query, _root, args, ctx, _info) => {
              const authority = generator.getAuthority(ctx);
              const modelWhere = generator.getModelWhere(
                name,
                operationPrefix,
                authority,
                ctx
              );
              const modelInput = generator.getModelInputData(
                name,
                operationPrefix,
                authority,
                ctx
              );
              const prisma = getPrisma(t, ctx);
              return prisma[lowerFirst(name)].update({
                ...query,
                where: {
                  ...args.where,
                  ...modelWhere,
                },
                data: {
                  ...args.data,
                  ...modelInput,
                },
              });
            },
          }),
        ];
      })
  );
};

export const updateManyModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "updateMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map(({ name }) => {
        const options = generator.getModelOptions(name)[operationPrefix];
        return [
          `${operationPrefix}${name}`,
          t.int({
            ...options,
            args: {
              where: t.arg({
                type: generator.getWhere(name),
                required: true,
              }),
              data: t.arg({
                type: generator.getUpdateInput(
                  name,
                  generator.getModelInputFields(name)[operationPrefix]
                ),
                required: true,
              }),
            },
            resolve: async (_parent, args, ctx, _info) => {
              const authority = generator.getAuthority(ctx);
              const modelWhere = generator.getModelWhere(
                name,
                operationPrefix,
                authority,
                ctx
              );
              const modelInput = generator.getModelInputData(
                name,
                operationPrefix,
                authority,
                ctx
              );
              const prisma = getPrisma(t, ctx);
              return prisma[lowerFirst(name)]
                .updateMany({
                  where: { ...args.where, ...modelWhere },
                  data: { ...args.data, ...modelInput },
                })
                .then(({ count }: { count: number }) => count);
            },
          }),
        ];
      })
  );
};

export const deleteModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "deleteOne";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map((model) => {
        const options = generator.getModelOptions(model.name)[operationPrefix];
        return [
          `${operationPrefix}${model.name}`,
          t.prismaField({
            ...options,
            type: model.name,
            args: {
              where: t.arg({
                type: generator.getWhereUnique(model.name),
                required: true,
              }),
            },
            resolve: async (query, _root, args, ctx, _info) => {
              const authority = generator.getAuthority(ctx);
              const modelWhere = generator.getModelWhere(
                model.name,
                operationPrefix,
                authority,
                ctx
              );
              const prisma = getPrisma(t, ctx);
              return prisma[lowerFirst(model.name)].delete({
                ...query,
                where: { ...args.where, ...modelWhere },
              });
            },
          }),
        ];
      })
  );
};

export const deleteManyModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "deleteMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map((model) => {
        const options = generator.getModelOptions(model.name)[operationPrefix];
        return [
          `${operationPrefix}${model.name}`,
          t.int({
            ...options,
            args: {
              where: t.arg({
                type: generator.getWhere(model.name),
                required: true,
              }),
            },
            resolve: async (_parent, args, ctx, _info) => {
              const authority = generator.getAuthority(ctx);
              const modelWhere = generator.getModelWhere(
                model.name,
                operationPrefix,
                authority,
                ctx
              );
              const prisma = getPrisma(t, ctx);
              return prisma[lowerFirst(model.name)]
                .deleteMany({
                  where: { ...args.where, ...modelWhere },
                })
                .then(({ count }: { count: number }) => count);
            },
          }),
        ];
      })
  );
};
