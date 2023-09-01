import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtils from "@pothos/plugin-prisma-utils";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import { Prisma } from "@prisma/client";
import PothosSchemaExporter from "pothos-schema-exporter";
import { Context, prisma } from "./context";
import PothosPrismaGeneratorPlugin from "../../src";

/**
 * Create a new schema builder instance
 */
export const builder = new SchemaBuilder<{
  Context: Context;
  // PrismaTypes: PrismaTypes; //Not used because it is generated automatically
}>({
  plugins: [
    PrismaPlugin,
    PrismaUtils,
    ScopeAuthPlugin,
    PothosPrismaGeneratorPlugin,
    PothosSchemaExporter,
  ],
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
  authScopes: async (context) => ({
    authenticated: !!context.user,
  }),
  pothosPrismaGenerator: {
    // Replace the following directives
    // /// @pothos-generator input {data:{author:{connect:{id:"%%USER%%"}}}}
    replace: { "%%USER%%": async ({ context }) => context.user?.id },

    // Set the following permissions
    /// @pothos-generator where {include:["query"],where:{},authority:["authenticated"]}
    authority: async ({ context }) =>
      context.user?.id ? ["authenticated"] : [],
  },
});
