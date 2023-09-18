import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtils from "@pothos/plugin-prisma-utils";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import PothosSchemaExporter from "pothos-schema-exporter";
import { Context, prisma } from "./context";
import PothosPrismaGeneratorPlugin from "../../src";

/**
 * Create a new schema builder instance
 */
export const createBuilder = () => {
  return new SchemaBuilder<{
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
    },
    authScopes: async (context) =>
      context.user?.roles.reduce<{ [key: string]: boolean }>((acc, role) => {
        acc[role] = true;
        return acc;
      }, {}) ?? {},
    pothosPrismaGenerator: {
      // Replace the following directives
      // /// @pothos-generator input {data:{author:{connect:{id:"%%USER%%"}}}}
      replace: { "%%USER%%": ({ context }) => context.user?.id },

      // Set the following permissions
      /// @pothos-generator any {authority:["ROLE"]}
      authority: ({ context }) => context.user?.roles ?? [],
    },
  });
};
