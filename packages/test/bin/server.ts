import fastifyApollo from "@as-integrations/fastify";
import Fastify from "fastify";
import { createApolloServer } from "../libs/test-tools";

const fastify = Fastify();
createApolloServer().then((apollo) => {
  fastify.register(fastifyApollo(apollo));
});
fastify.listen({ port: 3000 }).then((address) => {
  console.log(`🚀 Server ready at ${address}/graphql`);
});
