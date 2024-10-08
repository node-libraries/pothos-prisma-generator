/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaSchemaGenerator } from "./generator/PrismaSchemaGenerator.js";
import type { SchemaTypes } from "@pothos/core";
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
    | PothosSchemaTypes.MutationFieldBuilder<T, ParentShape>
): any => {
  return t.builder.options.prisma.client;
};

const getWhere = (where: object) => {
  if (!where || Object.keys(where).length === 0) return {};
  return { where };
};

export const createModelObject = (generator: PrismaSchemaGenerator<any>) => {
  const builder = generator.getBuilder();
  generator.getModels().map((model) => {
    const modelName = model.name;
    const selectFields = new Set(generator.getModelExcludeField(modelName));
    builder.prismaObject(modelName, {
      fields: (t) => {
        const fields = model.fields
          .filter(({ name }) => !selectFields.has(name))
          .flatMap((field) => {
            const modelName = field.type;
            if (field.isId) {
              return [[field.name, t.exposeID(field.name)] as const];
            }
            if (field.kind === "scalar") {
              return [
                [
                  field.name,
                  t.expose(field.name, {
                    type: field.isList
                      ? t.listRef(modelName).listType
                      : modelName,
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
                    type: field.isList
                      ? [generator.getEnum(modelName)]
                      : generator.getEnum(modelName),
                    nullable: !field.isRequired,
                  }),
                ] as const,
              ];
            }

            const createField = () => {
              const operationPrefix = field.isList ? "findMany" : "findFirst";
              const options =
                generator.getModelOptions(modelName)[operationPrefix];
              return t.relation(field.name, {
                ...options,
                nullable: !field.isRequired,
                args: field.isList
                  ? ({
                      ...generator.findManyArgs(modelName),
                      ...generator.pagerArgs(),
                    } as never)
                  : undefined,
                query: (args, ctx) => {
                  const authority = generator.getAuthority(ctx);
                  const modelOrder = generator.getModelOrder(
                    modelName,
                    operationPrefix,
                    authority
                  );
                  const generatorParams = {
                    params: {
                      root: undefined,
                      args,
                      ctx,
                      info: undefined,
                    },
                    prisma: undefined,
                    modelName,
                    operationPrefix,
                    authority,
                  } as const;
                  const modelWhere = generator.getModelWhere(generatorParams);
                  const modelLimit = generator.getModelLimit(
                    modelName,
                    operationPrefix,
                    authority
                  );
                  const take =
                    modelLimit && typeof args.limit === "number"
                      ? Math.min(modelLimit, args.limit)
                      : modelLimit ?? args.limit;

                  const where = {
                    ...(typeof args.filter === "object" ? args.filter : {}),
                    ...modelWhere,
                  };
                  const skip = args.offset;
                  if (!field.isList) return { where };
                  return {
                    ...getWhere(where),
                    orderBy:
                      args.orderBy && Object.keys(args.orderBy).length
                        ? args.orderBy
                        : modelOrder,
                    take,
                    skip,
                  };
                },
                onNull: "error",
              });
            };

            const createCount = () => {
              const operationPrefix = "count";
              const options =
                generator.getModelOptions(modelName)[operationPrefix];
              return t.relationCount(`${field.name}`, {
                ...options,
                args: {
                  filter: t.arg({
                    type: generator.getWhere(modelName),
                    required: false,
                  }) as never,
                },
                where: (args: { filter?: object }, ctx: object) => {
                  const authority = generator.getAuthority(ctx);
                  const generatorParams = {
                    params: {
                      root: undefined,
                      args,
                      ctx,
                      info: undefined,
                    },
                    prisma: undefined,
                    modelName,
                    operationPrefix,
                    authority,
                  } as const;
                  const modelWhere = generator.getModelWhere(generatorParams);
                  const where = { ...args.filter, ...modelWhere };
                  return Object.keys(where).length ? where : undefined;
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
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            args: {
              filter: t.arg({
                type: generator.getWhere(modelName),
                required: false,
              }),
            },
            resolve: async (
              root: unknown,
              args: unknown[],
              ctx: object,
              info: unknown
            ) => {
              const prisma = getPrisma(t);
              const authority = generator.getAuthority(ctx);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelWhere = generator.getModelWhere(generatorParams);
              const where = { ...args.filter, ...modelWhere };
              return prisma[lowerFirst(modelName)].count({
                ...getWhere(where),
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
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            nullable: true,
            args: {
              ...generator.findManyArgs(modelName),
            },

            resolve: async (
              query: any,
              root: any,
              args: any,
              ctx: object,
              info: any
            ) => {
              const prisma = getPrisma(t);
              const authority = generator.getAuthority(ctx);

              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelOrder = generator.getModelOrder(
                modelName,
                operationPrefix,
                authority
              );
              const modelWhere = generator.getModelWhere(generatorParams);
              const where = { ...args.filter, ...modelWhere };
              const result = await prisma[lowerFirst(modelName)].findFirst({
                ...query,
                ...getWhere(where),
                orderBy:
                  args.orderBy && Object.keys(args.orderBy).length
                    ? args.orderBy
                    : modelOrder,
              });

              return result;
            },
          }),
        ];
      })
  );
};

export const createModelUniqueQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>
) => {
  const operationPrefix = "findUnique";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix)
      )
      .map((model) => {
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            args: {
              filter: t.arg({
                type: generator.getWhereUnique(modelName),
                required: true,
              }),
            },

            resolve: async (
              query: any,
              root: any,
              args: any,
              ctx: object,
              info: any
            ) => {
              const prisma = getPrisma(t);
              const authority = generator.getAuthority(ctx);

              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelWhere = generator.getModelWhere(generatorParams);
              const where = { ...args.filter, ...modelWhere };
              return prisma[lowerFirst(modelName)].findUniqueOrThrow({
                ...query,
                ...getWhere(where),
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
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: [modelName],
            args: {
              ...generator.findManyArgs(modelName),
              ...generator.pagerArgs(),
            },
            resolve: async (
              query: any,
              root: any,
              args: any,
              ctx: object,
              info: any
            ) => {
              const prisma = getPrisma(t);
              const authority = generator.getAuthority(ctx);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);

              const modelOrder = generator.getModelOrder(
                modelName,
                operationPrefix,
                authority
              );
              const modelWhere = generator.getModelWhere(generatorParams);
              const modelLimit = generator.getModelLimit(
                modelName,
                operationPrefix,
                authority
              );

              const where = { ...args.filter, ...modelWhere };
              const take =
                modelLimit && args.limit
                  ? Math.min(modelLimit, args.limit)
                  : modelLimit ?? args.limit;
              const skip = args.offset;
              const result = await prisma[lowerFirst(modelName)].findMany({
                ...query,
                ...getWhere(where),
                orderBy:
                  args.orderBy && Object.keys(args.orderBy).length
                    ? args.orderBy
                    : modelOrder,
                take,
                skip,
              });
              return result;
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
        const modelName = name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            args: {
              input: t.arg({
                type: generator.getCreateInput(modelName),
                required: true,
              }),
            },
            resolve: async (
              query: any,
              root: any,
              args: any,
              ctx: object,
              info: any
            ) => {
              const authority = generator.getAuthority(ctx);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);

              const modelInput = generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx
              );

              return prisma[lowerFirst(modelName)].create({
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
      .map(({ name: modelName }) => {
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            args: {
              input: t.arg({
                type: [generator.getCreateInput(modelName)],
                required: true,
              }),
            },
            resolve: async (
              root: any,
              args: { input: any[] },
              ctx: object,
              info: any
            ) => {
              const authority = generator.getAuthority(ctx);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelInput = generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx
              );

              return prisma[lowerFirst(modelName)]
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
      .map(({ name: modelName }) => {
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            args: {
              where: t.arg({
                type: generator.getWhereUnique(modelName),
                required: true,
              }),
              data: t.arg({
                type: generator.getUpdateInput(modelName),
                required: true,
              }),
            },
            resolve: async (
              query: any,
              root: any,
              args: any,
              ctx: object,
              info: any
            ) => {
              const authority = generator.getAuthority(ctx);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelWhere = generator.getModelWhere(generatorParams);
              const modelInput = generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx
              );

              return prisma[lowerFirst(modelName)].update({
                ...query,
                ...getWhere({ ...args.where, ...modelWhere }),
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
      .map(({ name: modelName }) => {
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            args: {
              where: t.arg({
                type: generator.getWhere(modelName),
                required: true,
              }),
              data: t.arg({
                type: generator.getUpdateInput(
                  modelName,
                  generator.getModelInputFields(modelName)[operationPrefix]
                ),
                required: true,
              }),
            },
            resolve: async (
              root: any,
              args: { where: any; data: any },
              ctx: object,
              info: any
            ) => {
              const authority = generator.getAuthority(ctx);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelWhere = generator.getModelWhere(generatorParams);
              const modelInput = generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx
              );

              return prisma[lowerFirst(modelName)]
                .updateMany({
                  ...getWhere({ ...args.where, ...modelWhere }),
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
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            args: {
              where: t.arg({
                type: generator.getWhereUnique(modelName),
                required: true,
              }),
            },
            resolve: async (
              query: any,
              root: any,
              args: any,
              ctx: object,
              info: any
            ) => {
              const authority = generator.getAuthority(ctx);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelWhere = generator.getModelWhere(generatorParams);

              return prisma[lowerFirst(modelName)].delete({
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
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            args: {
              where: t.arg({
                type: generator.getWhere(modelName),
                required: true,
              }),
            },
            resolve: async (
              root: any,
              args: { where: any },
              ctx: object,
              info: any
            ) => {
              const authority = generator.getAuthority(ctx);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: {
                  root,
                  args,
                  ctx,
                  info,
                },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              await generator.checkModelExecutable(generatorParams);
              const modelWhere = generator.getModelWhere(generatorParams);

              return prisma[lowerFirst(modelName)]
                .deleteMany({
                  ...getWhere({ ...args.where, ...modelWhere }),
                })
                .then(({ count }: { count: number }) => count);
            },
          }),
        ];
      })
  );
};
