#!/usr/bin/env node
import fs from "fs";
import helper from "@prisma/generator-helper";
helper.generatorHandler({
  onManifest: () => ({
    defaultOutput: "/path/to/default/output",
    prettyName: "prisma-dmmf-generator",
    version: "1.0.0",
  }),
  async onGenerate(options) {
    const path = options.generator.output?.value;
    if (path) {
      fs.promises.writeFile(
        path,
        `export const prismaDmmf = ${JSON.stringify(
          { datamodel: options.dmmf.datamodel },
          null,
          2
        )};`,
        "utf8"
      );
    }
  },
});
