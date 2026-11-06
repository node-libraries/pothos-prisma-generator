/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FieldRef, SchemaTypes } from "@pothos/core";
import { PrismaSchemaGenerator } from "./generator/PrismaSchemaGenerator.js";

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
): any => {
  return t.builder.options.prisma.client;
};

const getWhere = (where: object | undefined) => {
  if (!where || Object.keys(where).length === 0) return {};
  return { where };
};

export const createModelObject = (generator: PrismaSchemaGenerator<any>) => {
  const builder = generator.getBuilder();
  generator.getModels().map((model) => {
    const modelName = model.name;
    const selectFields = new Set(generator.getModelExcludeField(modelName));
    const modelFields = generator.modelFields[modelName] ?? {};
    builder.prismaObject(modelName, {
      fields: (t) => {
        const fields = model.fields
          .filter(({ name }) => !selectFields.has(name))
          .flatMap((field) => {
            const modelName = field.type;
            if (field.isId) {
              return [
                [
                  field.name,
                  t.exposeID(field.name, { nullable: false }),
                ] as const,
              ];
            }
            if (field.kind === "scalar") {
              return [
                [
                  field.name,
                  t.expose(field.name, {
                    type: field.isList ? [modelName] : modelName,
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
                query: async (
                  args: {
                    filter: object;
                    limit?: number;
                    offset?: number;
                    orderBy?: object;
                    cursor?: object;
                    distinct?: unknown[];
                  },
                  ctx,
                ) => {
                  const authority = await generator.getAuthority(ctx);
                  const modelOrder = generator.getModelOrder(
                    modelName,
                    operationPrefix,
                    authority,
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
                  generator.checkModelExecutable(generatorParams);
                  const modelWhere =
                    await generator.getModelWhere(generatorParams);
                  const modelLimit = generator.getModelLimit(
                    modelName,
                    operationPrefix,
                    authority,
                  );

                  const safeLimit =
                    typeof args.limit === "number"
                      ? Math.max(0, args.limit)
                      : undefined;
                  const safeOffset =
                    typeof args.offset === "number"
                      ? Math.max(0, args.offset)
                      : undefined;

                  const take =
                    modelLimit !== undefined && safeLimit !== undefined
                      ? Math.min(modelLimit, safeLimit)
                      : (modelLimit ?? safeLimit);

                  const {
                    where,
                    take: resolvedTake,
                    skip,
                    orderBy,
                    cursor,
                    distinct,
                  } = await generator.getParameters(
                    {
                      where: {
                        ...(typeof args.filter === "object" ? args.filter : {}),
                        ...modelWhere,
                      },
                      take,
                      skip: safeOffset,
                      orderBy:
                        args.orderBy && Object.keys(args.orderBy).length
                          ? args.orderBy
                          : modelOrder,
                      cursor: args.cursor,
                      distinct: args.distinct,
                    },
                    generatorParams,
                  );
                  if (!field.isList) return {};
                  return {
                    ...getWhere(where),
                    orderBy,
                    take: resolvedTake,
                    skip,
                    cursor,
                    distinct,
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
                where: async (args: { filter?: object }, ctx: object) => {
                  const authority = await generator.getAuthority(ctx);
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
                  generator.checkModelExecutable(generatorParams);
                  const modelWhere =
                    await generator.getModelWhere(generatorParams);

                  const { where } = await generator.getParameters(
                    {
                      where: { ...args.filter, ...modelWhere },
                    },
                    generatorParams,
                  );

                  return where && Object.keys(where).length ? where : undefined;
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

        return Object.fromEntries([
          ...fields,
          ...Object.entries(modelFields).map(([key, callback]) => [
            key,
            callback(t),
          ]),
        ]);
      },
    });
  });
};

export const createModelCountQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
): Record<string, FieldRef<any, any, "Query">> => {
  const operationPrefix = "count";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map((model) => {
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            nullable: false,
            args: {
              filter: t.arg({
                type: generator.getWhere(modelName),
                required: false,
              }),
            },
            resolve: async (
              root: unknown,
              args: any,
              ctx: object,
              info: unknown,
            ) => {
              const prisma = getPrisma(t);
              const authority = await generator.getAuthority(ctx);
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
              generator.checkModelExecutable(generatorParams);
              const modelWhere = await generator.getModelWhere(generatorParams);

              const { where } = await generator.getParameters(
                {
                  where: { ...args.filter, ...modelWhere },
                },
                generatorParams,
              );

              return prisma[lowerFirst(modelName)].count({
                ...getWhere(where),
              });
            },
          }),
        ];
      }),
  );
};

export const createModelQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
) => {
  const operationPrefix = "findFirst";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
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
              query: object,
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const prisma = getPrisma(t);
              const authority = await generator.getAuthority(ctx);

              const generatorParams = {
                params: {
                  query,
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
              generator.checkModelExecutable(generatorParams);
              const modelOrder = generator.getModelOrder(
                modelName,
                operationPrefix,
                authority,
              );
              const modelWhere = await generator.getModelWhere(generatorParams);
              const { where, orderBy, cursor, distinct } =
                await generator.getParameters(
                  {
                    where: { ...args.filter, ...modelWhere },
                    orderBy:
                      args.orderBy && Object.keys(args.orderBy).length
                        ? args.orderBy
                        : modelOrder,
                    cursor: args.cursor,
                    distinct: args.distinct,
                  },
                  generatorParams,
                );

              const result = await prisma[lowerFirst(modelName)].findFirst({
                ...query,
                ...getWhere(where),
                orderBy,
                cursor,
                distinct,
              });

              return result;
            },
          }),
        ];
      }),
  );
};

export const createModelUniqueQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
) => {
  const operationPrefix = "findUnique";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map((model) => {
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            nullable: false,
            args: {
              filter: t.arg({
                type: generator.getWhereUnique(modelName),
                required: true,
              }),
            },

            resolve: async (
              query: any,
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const prisma = getPrisma(t);
              const authority = await generator.getAuthority(ctx);

              const generatorParams = {
                params: {
                  query,
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
              generator.checkModelExecutable(generatorParams);
              const modelWhere = await generator.getModelWhere(generatorParams);
              const { where } = await generator.getParameters(
                {
                  where: { ...args.filter, ...modelWhere },
                },
                generatorParams,
              );

              return prisma[lowerFirst(modelName)].findUniqueOrThrow({
                ...query,
                ...getWhere(where),
              });
            },
          }),
        ];
      }),
  );
};

export const createModelListQuery = (
  t: PothosSchemaTypes.QueryFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
) => {
  const operationPrefix = "findMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map((model) => {
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: [modelName],
            nullable: false,
            args: {
              ...generator.findManyArgs(modelName),
              ...generator.pagerArgs(),
            },
            resolve: async (
              query: any,
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const prisma = getPrisma(t);
              const authority = await generator.getAuthority(ctx);
              const generatorParams = {
                params: { query, root, args, ctx, info },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              generator.checkModelExecutable(generatorParams);

              const modelOrder = generator.getModelOrder(
                modelName,
                operationPrefix,
                authority,
              );
              const modelWhere = await generator.getModelWhere(generatorParams);
              const modelLimit = generator.getModelLimit(
                modelName,
                operationPrefix,
                authority,
              );
              const safeLimit =
                typeof args.limit === "number"
                  ? Math.max(0, args.limit)
                  : undefined;
              const safeOffset =
                typeof args.offset === "number"
                  ? Math.max(0, args.offset)
                  : undefined;

              const take =
                modelLimit !== undefined && safeLimit !== undefined
                  ? Math.min(modelLimit, safeLimit)
                  : (modelLimit ?? safeLimit);

              const {
                where,
                take: resolvedTake,
                skip,
                orderBy,
                cursor,
                distinct,
              } = await generator.getParameters(
                {
                  where: { ...args.filter, ...modelWhere },
                  take,
                  skip: safeOffset,
                  orderBy:
                    args.orderBy && Object.keys(args.orderBy).length
                      ? args.orderBy
                      : modelOrder,
                  cursor: args.cursor,
                  distinct: args.distinct,
                },
                generatorParams,
              );

              const result = await prisma[lowerFirst(modelName)].findMany({
                ...query,
                ...getWhere(where),
                orderBy,
                take: resolvedTake,
                skip,
                cursor,
                distinct,
              });
              return result;
            },
          }),
        ];
      }),
  );
};

export const createModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
) => {
  const operationPrefix = "createOne";
  return Object.fromEntries(
    generator
      .getModels()
      .filter(({ name }) =>
        generator.getModelOperations(name).includes(operationPrefix),
      )
      .map(({ name }) => {
        const modelName = name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            nullable: false,
            args: {
              input: t.arg({
                type: generator.getCreateInput(modelName),
                required: true,
              }),
            },
            resolve: async (
              query: any,
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const authority = await generator.getAuthority(ctx);
              generator.checkInputWritable(modelName, args.input, authority);
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
              generator.checkModelExecutable(generatorParams);
              const modelInput = await generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx,
              );
              const { input } = await generator.getParameters(
                {
                  input: { ...args.input, ...modelInput },
                },
                generatorParams,
              );

              return prisma[lowerFirst(modelName)].create({
                ...query,
                data: input,
              });
            },
          }),
        ];
      }),
  );
};

export const createManyModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
): Record<string, FieldRef<any, any, "Mutation">> => {
  const operationPrefix = "createMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter(({ name }) =>
        generator.getModelOperations(name).includes(operationPrefix),
      )
      .map(({ name: modelName }) => {
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            nullable: false,
            args: {
              input: t.arg({
                type: [generator.getCreateManyInput(modelName)],
                required: true,
              }),
            },
            resolve: async (
              root: any,
              args: { input: any[] },
              ctx: object,
              info: any,
            ) => {
              const authority = await generator.getAuthority(ctx);
              args.input?.forEach((v) =>
                generator.checkInputWritable(modelName, v, authority),
              );
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
              generator.checkModelExecutable(generatorParams);
              const modelInput = await generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx,
              );
              const { input } = await generator.getParameters(
                {
                  input: args.input.map((v) => ({ ...v, ...modelInput })),
                },
                generatorParams,
              );
              return prisma[lowerFirst(modelName)]
                .createMany({
                  data: input,
                })
                .then(({ count }: { count: number }) => count);
            },
          }),
        ];
      }),
  );
};

export const updateModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
) => {
  const operationPrefix = "updateOne";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map(({ name: modelName }) => {
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            nullable: false,
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
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const authority = await generator.getAuthority(ctx);
              generator.checkInputWritable(modelName, args.data, authority);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: { query, root, args, ctx, info },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              generator.checkModelExecutable(generatorParams);
              const modelWhere = await generator.getModelWhere(generatorParams);
              const modelInput = await generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx,
              );
              const { where, input } = await generator.getParameters(
                {
                  where: { ...args.where, ...modelWhere },
                  input: { ...args.data, ...modelInput },
                },
                generatorParams,
              );

              return prisma[lowerFirst(modelName)].update({
                ...query,
                ...getWhere(where),
                data: input,
              });
            },
          }),
        ];
      }),
  );
};

export const updateManyModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
): Record<string, FieldRef<any, any, "Mutation">> => {
  const operationPrefix = "updateMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map(({ name: modelName }) => {
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            nullable: false,
            args: {
              where: t.arg({
                type: generator.getWhere(modelName),
                required: true,
              }),
              data: t.arg({
                type: generator.getUpdateInput(
                  modelName,
                  generator.getModelInputFields(modelName)[operationPrefix],
                ),
                required: true,
              }),
            },
            resolve: async (
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const authority = await generator.getAuthority(ctx);
              generator.checkInputWritable(modelName, args.data, authority);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: { root, args, ctx, info },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              generator.checkModelExecutable(generatorParams);
              const modelWhere = await generator.getModelWhere(generatorParams);
              const modelInput = await generator.getModelInputData(
                modelName,
                operationPrefix,
                authority,
                ctx,
              );
              const { where, input } = await generator.getParameters(
                {
                  where: { ...args.where, ...modelWhere },
                  input: { ...args.data, ...modelInput },
                },
                generatorParams,
              );
              return prisma[lowerFirst(modelName)]
                .updateMany({
                  ...getWhere(where),
                  data: input,
                })
                .then(({ count }: { count: number }) => count);
            },
          }),
        ];
      }),
  );
};

export const deleteModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
) => {
  const operationPrefix = "deleteOne";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map((model) => {
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            nullable: false,
            type: modelName,
            args: {
              where: t.arg({
                type: generator.getWhereUnique(modelName),
                required: true,
              }),
            },
            resolve: async (
              query: any,
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const authority = await generator.getAuthority(ctx);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: { query, root, args, ctx, info },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              generator.checkModelExecutable(generatorParams);
              const modelWhere = await generator.getModelWhere(generatorParams);

              const { where } = await generator.getParameters(
                {
                  where: { ...args.where, ...modelWhere },
                },
                generatorParams,
              );

              return prisma[lowerFirst(modelName)].delete({
                ...query,
                where,
              });
            },
          }),
        ];
      }),
  );
};

export const deleteManyModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
): Record<string, FieldRef<any, any, "Mutation">> => {
  const operationPrefix = "deleteMany";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map((model) => {
        const modelName = model.name;
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.int({
            ...options,
            nullable: false,
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
              info: any,
            ) => {
              const authority = await generator.getAuthority(ctx);
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
              generator.checkModelExecutable(generatorParams);
              const modelWhere = await generator.getModelWhere(generatorParams);

              const { where } = await generator.getParameters(
                {
                  where: { ...args.where, ...modelWhere },
                },
                generatorParams,
              );

              return prisma[lowerFirst(modelName)]
                .deleteMany({
                  ...getWhere(where),
                })
                .then(({ count }: { count: number }) => count);
            },
          }),
        ];
      }),
  );
};

export const upsertOneModelMutation = (
  t: PothosSchemaTypes.MutationFieldBuilder<any, any>,
  generator: PrismaSchemaGenerator<any>,
) => {
  const operationPrefix = "upsertOne";
  return Object.fromEntries(
    generator
      .getModels()
      .filter((model) =>
        generator.getModelOperations(model.name).includes(operationPrefix),
      )
      .map(({ name: modelName }) => {
        const options = generator.getModelOptions(modelName)[operationPrefix];
        return [
          `${operationPrefix}${modelName}`,
          t.prismaField({
            ...options,
            type: modelName,
            nullable: false,
            args: {
              where: t.arg({
                type: generator.getWhereUnique(modelName),
                required: true,
              }),
              create: t.arg({
                type: generator.getCreateInput(modelName),
                required: true,
              }),
              update: t.arg({
                type: generator.getUpdateInput(modelName),
                required: true,
              }),
            },
            resolve: async (
              query: any,
              root: SchemaTypes["Root"],
              args: any,
              ctx: SchemaTypes["Context"],
              info: unknown,
            ) => {
              const authority = await generator.getAuthority(ctx);
              generator.checkInputWritable(modelName, args.create, authority);
              generator.checkInputWritable(modelName, args.update, authority);
              const prisma = getPrisma(t);
              const generatorParams = {
                params: { query, root, args, ctx, info },
                prisma,
                modelName,
                operationPrefix,
                authority,
              } as const;
              generator.checkModelExecutable(generatorParams);
              const modelWhere = await generator.getModelWhere(generatorParams);
              const modelCreateInput = await generator.getModelInputData(
                modelName,
                "createOne",
                authority,
                ctx,
              );
              const modelUpdateInput = await generator.getModelInputData(
                modelName,
                "updateOne",
                authority,
                ctx,
              );
              const { where, input: createInput } =
                await generator.getParameters(
                  {
                    where: { ...args.where, ...modelWhere },
                    input: { ...args.create, ...modelCreateInput },
                  },
                  generatorParams,
                );
              const { input: updateInput } = await generator.getParameters(
                {
                  input: { ...args.update, ...modelUpdateInput },
                },
                generatorParams,
              );

              return prisma[lowerFirst(modelName)].upsert({
                ...query,
                where,
                create: createInput,
                update: updateInput,
              });
            },
          }),
        ];
      }),
  );
};
