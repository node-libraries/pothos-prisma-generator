import { prisma } from "./context";
import { prismaDmmf } from "./prisma-dmmf";
import { DocumentNode } from "graphql";
import { RemoveReadonly, RuntimeDataModel } from "pothos-prisma-generator";
import { createBuilder } from "./builder";
import { getSdk } from "../generated/graphql";
import type { Context } from "./context";
import { execute } from "graphql";

type Builder = ReturnType<typeof createBuilder>;

export const getSchema = () => {
  const builder = createBuilder();
  return builder.toSchema({ sortSchema: false });
};
export const getClient = async (
  onCreate?: (builder: Builder) => void,
  defaultIncludes?: { operations?: boolean; fields?: boolean }
) => {
  const builder = createBuilder(defaultIncludes);
  onCreate?.(builder);
  const schema = builder.toSchema({ sortSchema: false });
  const requester = async <R, V>(
    document: DocumentNode,
    vars: V,
    context?: Context
  ): Promise<R> => {
    const result = await execute({
      document,
      variableValues: vars as never,
      contextValue: context ?? {},
      schema,
    });
    const { data, errors } = result;
    if (errors) {
      throw errors;
    }
    if (data && Object.keys(data).length === 0)
      throw new Error("No data returned");
    return data as R;
  };
  return [getSdk(requester), requester] as const;
};

const removeReadOnly = <T>(object: T) => object as RemoveReadonly<T>;

export const setModelDirective = (model: string, directive: string[]) => {
  const dmmfModels = prismaDmmf.datamodel.models;
  const dmmfModel = (dmmfModels as any[]).find((m) => m.name === model);
  const dmmfDoc = dmmfModel?.documentation;
  if (dmmfModel) {
    dmmfModel.documentation = directive.join("\n");
  }

  const { models } = (
    prisma as unknown as {
      _runtimeDataModel: RuntimeDataModel;
    }
  )._runtimeDataModel;
  const document = models[model]?.documentation;
  const m = removeReadOnly(models);
  if (m[model]) {
    m[model].documentation = directive.join("\n");
  }

  return () => {
    if (dmmfModel) dmmfModel.documentation = dmmfDoc;
    if (m[model]) m[model].documentation = document;
  };
};

export const setFieldDirective = (
  model: string,
  field: string | string[],
  directive: string[]
) => {
  const dmmfModels = prismaDmmf.datamodel.models;
  const dmmfModel = (dmmfModels as any[]).find((m) => m.name === model);
  const dmmfField = dmmfModel?.fields?.find((v: any) => v.name === field);
  const dmmfDoc = dmmfField?.documentation;
  if (dmmfField) {
    dmmfField.documentation = directive.join("\n");
  }

  const { models } = (
    prisma as unknown as {
      _runtimeDataModel: RuntimeDataModel;
    }
  )._runtimeDataModel;
  const modelField = removeReadOnly(
    models[model]?.fields?.find((v) => v.name === field)
  );
  const document = modelField?.documentation;
  if (modelField) {
    modelField.documentation = directive.join("\n");
  }

  return () => {
    if (dmmfField) dmmfField.documentation = dmmfDoc;
    if (modelField) modelField.documentation = document;
  };
};
