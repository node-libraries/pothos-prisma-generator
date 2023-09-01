import { ApolloServer } from "@apollo/server";
import { builder } from "./builder";
import type { Context } from "./context";
import type { GraphQLResponse } from "@apollo/server/dist/esm/externalTypes/graphql";

/**
 * apolloServer
 */
const createApolloServer = async () => {
  const apolloServer = new ApolloServer<Context>({
    schema: builder.toSchema({}),
  });
  apolloServer.start();
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
