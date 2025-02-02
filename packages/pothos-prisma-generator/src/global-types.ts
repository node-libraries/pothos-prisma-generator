import { SchemaTypes } from "@pothos/core";
import { PrismaSchemaGenerator } from "./libs/generator/PrismaSchemaGenerator.js";
import { PothosPrismaGeneratorPlugin } from "./libs/PothosPrismaGeneratorPlugin.js";
import { PrismaClient } from "@prisma/client";

declare global {
  export namespace PothosSchemaTypes {
    export interface SchemaBuilder<
      Types extends SchemaTypes,
      T extends object = object
    > {
      addCustomGenerator<K extends keyof PrismaSchemaGenerator<Types, T>>(
        name: K,
        callback: PrismaSchemaGenerator<SchemaTypes>[K]
      ): void;
    }
    export interface Plugins<
      Types extends SchemaTypes,
      T extends object = object
    > {
      pothosPrismaGenerator: PothosPrismaGeneratorPlugin<Types, T>;
    }
    export interface UserSchemaTypes {
      Prisma: PrismaClient;
    }

    export interface SchemaBuilderOptions<
      Types extends SchemaTypes,
      T extends object = object
    > {
      pothosPrismaGenerator?: {
        autoScalers?: boolean;
        replace?: {
          [key: string]: ({
            context,
          }: {
            context: Types["Context"];
          }) => object | string | number | undefined;
        };
        authority: ({ context }: { context: Types["Context"] }) => string[];
        callbacks?: GeneratorCallback<Types, T>[];
      };
    }
  }
}

export type GeneratorCallback<
  Types extends SchemaTypes,
  T extends object = object
> = (params: {
  builder: PothosSchemaTypes.SchemaBuilder<Types, T>;
  generator: PrismaSchemaGenerator<Types, T>;
}) => void;
