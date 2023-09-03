/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryFromInfo } from "@pothos/plugin-prisma";
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
          .map((field) => {
            return [
              field.name,
              field.isId
                ? t.exposeID(field.name)
                : field.kind === "scalar"
                ? t.expose(field.name, {
                    type: field.isList ? t.listRef(field.type) : field.type,
                    nullable: !field.isRequired,
                  })
                : field.kind === "enum"
                ? t.expose(field.name, {
                    type: generator.getEnum(field.type)!,
                    nullable: !field.isRequired,
                  })
                : (() => {
                    const operationPrefix = field.isList
                      ? "findMany"
                      : "findFirst";
                    const options = generator.getModelOptions(field.type)[
                      operationPrefix
                    ];
                    return t.relation(field.name, {
                      ...options,
                      args: field.isList
                        ? generator.findManyArgs(field.type)
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
                        const where = { ...args.filter, ...modelWhere };
                        if (!field.isList) return { where };
                        return {
                          where: Object.keys(where).length ? where : undefined,
                          orderBy:
                            args.orderBy && Object.keys(args.orderBy).length
                              ? args.orderBy
                              : modelOrder,
                        };
                      },
                    });
                  })(),
            ];
          });
        return Object.fromEntries(fields);
      },
    });
  });
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
              filter: t.arg({
                type: generator.getWhereUnique(model.name),
                required: true,
              }),
            },
            resolve: async (query, _root, args, ctx, _info) => {
              const prisma = getPrisma(t, ctx);
              const authority = generator.getAuthority(ctx);
              const modelWhere = generator.getModelWhere(
                model.name,
                operationPrefix,
                authority,
                ctx
              );
              const where = { ...args.filter, ...modelWhere };
              return prisma[lowerFirst(model.name)].findUnique({
                ...query,
                where: Object.keys(where).length ? where : undefined,
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
            args: generator.findManyArgs(model.name),
            resolve: async (
              query,
              _root,
              args: InputShapeFromFields<{
                filter: InputFieldRef<any, "Arg">;
                orderBy: InputFieldRef<any, "Arg">;
              }>,
              ctx,
              _info
            ) => {
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
              return prisma[lowerFirst(model.name)].findMany({
                ...query,
                where: Object.keys(where).length ? where : undefined,
                orderBy:
                  args.orderBy && Object.keys(args.orderBy).length
                    ? args.orderBy
                    : modelOrder,
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
