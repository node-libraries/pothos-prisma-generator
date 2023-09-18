import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { RuntimeDataModel } from "@prisma/client/runtime/library";
import { DocumentNode } from "graphql";
import { createBuilder } from "./builder";
import { getSdk } from "../generated/graphql";
import type { Context } from "./context";
import type { GraphQLResponse } from "@apollo/server/dist/esm/externalTypes/graphql";

/**
 * apolloServer
 */
export const createApolloServer = async () => {
  const apolloServer = new ApolloServer<Context>({
    schema: createBuilder().toSchema({ sortSchema: false }),
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

export const getClient = async () => {
  const server = await createApolloServer();
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

export const setModelDirective = (model: string, directive: string[]) => {
  const prisma = new PrismaClient();
  const { models } = (
    prisma as PrismaClient & {
      _runtimeDataModel: RuntimeDataModel;
    }
  )._runtimeDataModel;
  const document = models[model].documentation;
  models[model].documentation = directive.join("\\n");
  return () => {
    models[model].documentation = document;
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
  const modelField = models[model].fields.find((v) => v.name === field)!;
  const document = modelField.documentation;
  modelField.documentation = directive.join("\\n");
  return () => {
    modelField.documentation = document;
  };
};
