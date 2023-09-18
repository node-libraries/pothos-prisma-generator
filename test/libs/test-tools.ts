import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { RuntimeDataModel } from "@prisma/client/runtime/library";
import { DocumentNode } from "graphql";
import { builder } from "./builder";
import { getSdk } from "../generated/graphql";
import type { Context } from "./context";
import type { GraphQLResponse } from "@apollo/server/dist/esm/externalTypes/graphql";

/**
 * apolloServer
 */
const createApolloServer = async () => {
  const apolloServer = new ApolloServer<Context>({
    schema: builder.toSchema({ sortSchema: false }),
  });
  await apolloServer.start();
  return apolloServer;
};

let apolloServer: ApolloServer<Context>;

export const getApolloServer = async () => {
  if (!apolloServer) apolloServer = await createApolloServer();
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
  const server = await getApolloServer();
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
  const { models } = (
    builder.options.prisma.client as PrismaClient & {
      _runtimeDataModel: RuntimeDataModel;
    }
  )._runtimeDataModel;
  models[model].documentation = directive.join("\\n");
};

export const setFieldDirective = (
  model: string,
  field: string,
  directive: string[]
) => {
  const { models } = (
    builder.options.prisma.client as PrismaClient & {
      _runtimeDataModel: RuntimeDataModel;
    }
  )._runtimeDataModel;
  models["User"].fields.find((v) => v.name === "email")!.documentation =
    directive.join("\\n");
};
