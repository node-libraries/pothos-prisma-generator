import { SchemaTypes, type FieldRef } from "@pothos/core";
import { PrismaSchemaGenerator } from "./libs/generator/PrismaSchemaGenerator.js";
import { PothosPrismaGeneratorPlugin } from "./libs/PothosPrismaGeneratorPlugin.js";
import type { PrismaClient } from "@prisma/client";
import type {
  PrismaObjectFieldBuilder as _PrismaObjectFieldBuilder,
  PrismaModelTypes,
} from "@pothos/plugin-prisma";

declare global {
  export namespace PothosSchemaTypes {
    export interface SchemaBuilder<Types extends SchemaTypes> {
      addSchemaGenerator(callback: GeneratorCallback<Types>): void;
      addModelFields<
        Name extends keyof Types["PrismaTypes"],
        Model extends PrismaModelTypes & Types["PrismaTypes"][Name],
        Shape extends Model["Shape"]
      >(
        modelName: Name,
        fields: Record<
          string,
          (
            t: PothosSchemaTypes.PrismaObjectFieldBuilder<Types, Model, Shape>
          ) => FieldRef<Types>
        >
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
        callbacks?: GeneratorCallback<Types>[];
        modelFields?: {
          [key in keyof Types["PrismaTypes"]]?: {
            [key: string]: (
              t: PothosSchemaTypes.PrismaObjectFieldBuilder<
                Types,
                PrismaModelTypes
              >
            ) => FieldRef<Types>;
          };
        };
      };
    }
  }
}

export type GeneratorCallback<Types extends SchemaTypes> = (params: {
  builder: PothosSchemaTypes.SchemaBuilder<Types>;
  generator: PrismaSchemaGenerator<Types>;
}) => void;
