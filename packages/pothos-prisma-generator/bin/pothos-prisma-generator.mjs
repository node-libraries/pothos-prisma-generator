#!/usr/bin/env node
import helper from "@prisma/generator-helper";
import fs from "fs";
import path from "path";

helper.generatorHandler({
  onManifest: () => ({
    defaultOutput: "/path/to/default/output",
    prettyName: "prisma-dmmf-generator",
    version: "1.0.0",
  }),
  async onGenerate(options) {
    const outputPath = options.generator.output?.value;
    if (outputPath) {
      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(
        outputPath,
        `export const prismaDmmf = ${JSON.stringify(
          { datamodel: options.dmmf.datamodel },
          null,
          2,
        )};`,
        "utf8",
      );
    }
  },
});
