import fastifyApollo from "@as-integrations/fastify";
import Fastify from "fastify";
import { getApolloServer } from "../libs/test-tools";

const fastify = Fastify();
getApolloServer().then((apollo) => {
  fastify.register(fastifyApollo(apollo));
});
fastify.listen({ port: 3000 }).then((address) => {
  console.log(`🚀 Server ready at ${address}/graphql`);
});
