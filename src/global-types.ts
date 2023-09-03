import { SchemaTypes } from "@pothos/core";
import { PothosPrismaGeneratorPlugin } from ".";

declare global {
  export namespace PothosSchemaTypes {
    export interface Plugins<Types extends SchemaTypes> {
      pothosPrismaGenerator: PothosPrismaGeneratorPlugin<Types>;
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
      };
    }
  }
}
