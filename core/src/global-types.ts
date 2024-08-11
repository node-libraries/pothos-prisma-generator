import { SchemaTypes } from "@pothos/core";
import { PrismaSchemaGenerator } from "./libs/generator/PrismaSchemaGenerator.js";
import { PothosPrismaGeneratorPlugin } from "./libs/PothosPrismaGeneratorPlugin.js";
import { PrismaClient } from "@prisma/client";
import { CustomGeneratorNames } from "./index.js";

declare global {
  export namespace PothosSchemaTypes {
    //builderにメソッドの定義を追加
    export interface SchemaBuilder<Types extends SchemaTypes> {
      addCustomGenerator<
        K extends keyof PrismaSchemaGenerator<Types> & CustomGeneratorNames
      >(
        name: K,
        callback: PrismaSchemaGenerator<Types>[K]
      ): void;
    }
    export interface Plugins<Types extends SchemaTypes> {
      pothosPrismaGenerator: PothosPrismaGeneratorPlugin;
    }
    export interface UserSchemaTypes {
      Prisma: PrismaClient;
    }

    export interface SchemaBuilderOptions<Types extends SchemaTypes> {
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
        custom?: {
          [K in keyof PrismaSchemaGenerator<Types> &
            "checkModelExecutable"]?: PrismaSchemaGenerator<Types>[K][];
        };
      };
    }
  }
}
