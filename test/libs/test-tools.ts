import { ApolloServer } from "@apollo/server";
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
    schema: builder.toSchema({}),
  });
  await apolloServer.start();
  return apolloServer;
};

const apolloServer = createApolloServer();

export const getApolloServer = async () => apolloServer;

export type Server = ApolloServer<Context>;

export const getBodyData = <T>(result: GraphQLResponse<T>) => {
  const { body } = result;
  const data = body.kind !== "single" ? undefined : body.singleResult.data;
  const errors = body.kind !== "single" ? undefined : body.singleResult.errors;
  return { data, errors };
};

export const getClient = async () => {
  const server = await apolloServer;
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
