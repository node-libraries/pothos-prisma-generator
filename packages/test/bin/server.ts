import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { graphqlServer } from "@hono/graphql-server";
import { getSchema } from "../libs/test-tools";

const app = new Hono();

app.use(
  "/graphql",
  graphqlServer({
    schema: getSchema(),
    graphiql: true,
  })
);
serve(app);

console.log("http://localhost:3000/graphql");
