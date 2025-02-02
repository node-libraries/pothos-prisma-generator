import { ApolloServer, GraphQLResponse } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { DocumentNode } from "graphql";
import { RemoveReadonly, RuntimeDataModel } from "pothos-prisma-generator";
import { createBuilder } from "./builder";
import { getSdk } from "../generated/graphql";
import type { Context } from "./context";

type Builder = ReturnType<typeof createBuilder>;

/**
 * apolloServer
 */
export const createApolloServer = async (
  onCreate?: (builder: Builder) => void
) => {
  const builder = createBuilder();
  onCreate?.(builder);
  const apolloServer = new ApolloServer<Context>({
    schema: builder.toSchema({ sortSchema: false }),
  });
  await apolloServer.start();
  return apolloServer;
};

export type Server = ApolloServer<Context>;

export const getBodyData = <T>(result: GraphQLResponse<T>) => {
  const { body } = result;
  const data = body.kind !== "single" ? undefined : body.singleResult.data;
  const errors = body.kind !== "single" ? undefined : body.singleResult.errors;
  return { data, errors };
};

export const getClient = async (onCreate?: (builder: Builder) => void) => {
  const server = await createApolloServer(onCreate);
  return getSdk(
    async <R, V>(doc: DocumentNode, vars: V, context?: Context): Promise<R> => {
      const result = await server.executeOperation(
        {
          query: doc,
          variables: vars as never,
        },
        { contextValue: context }
      );
      const { data, errors } = getBodyData(result);
      if (errors) {
        throw errors;
      }
      return data as R;
    }
  );
};

const removeReadOnly = <T>(object: T) => object as RemoveReadonly<T>;

export const setModelDirective = (model: string, directive: string[]) => {
  const prisma = new PrismaClient();
  const { models } = (
    prisma as PrismaClient & {
      _runtimeDataModel: RuntimeDataModel;
    }
  )._runtimeDataModel;
  const document = models[model].documentation;
  const m = removeReadOnly(models);
  m[model].documentation = directive.join("\\n");
  return () => {
    m[model].documentation = document;
  };
};

export const setFieldDirective = (
  model: string,
  field: string,
  directive: string[]
) => {
  const prisma = new PrismaClient();
  const { models } = (
    prisma as PrismaClient & {
      _runtimeDataModel: RuntimeDataModel;
    }
  )._runtimeDataModel;
  const modelField = removeReadOnly(
    models[model].fields.find((v) => v.name === field)!
  );
  const document = modelField.documentation;
  modelField.documentation = directive.join("\\n");
  return () => {
    modelField.documentation = document;
  };
};
