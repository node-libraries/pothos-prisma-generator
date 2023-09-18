import JSON5 from "json5";
import traverse from "traverse";
// @transform-path ./PrismaCrudGenerator.js
import { PrismaCrudGenerator } from "./PrismaCrudGenerator";
import type { SchemaTypes } from "@pothos/core";

const countOperations = ["count"] as const;
const findOperations = ["findUnique", "findFirst", "findMany"] as const;
const createOperations = ["createOne", "createMany"] as const;
const updateOperations = ["updateOne", "updateMany"] as const;
const deleteOperations = ["deleteOne", "deleteMany"] as const;
const mutationOperations = [
  ...createOperations,
  ...updateOperations,
  ...deleteOperations,
] as const;

const queryOperations = [...findOperations, ...countOperations] as const;

const operationMap = {
  find: findOperations,
  query: queryOperations,
  create: createOperations,
  update: updateOperations,
  delete: deleteOperations,
  mutation: mutationOperations,
};

const allOperations = [...queryOperations, ...mutationOperations];

type Operation = (typeof allOperations)[number];
type ExtendOperation = Operation | "mutation" | "query";

type FilterOperations = {
  include?: Operation[];
  exclude?: Operation[];
};
type DirectiveAuthority = { authority?: string[] };

type ModelDirective = {
  operation?: FilterOperations;
  executable?: FilterOperations & DirectiveAuthority;
  order?: {
    orderBy?: object;
  } & FilterOperations &
    DirectiveAuthority;
  where?: {
    where?: object;
  } & FilterOperations &
    DirectiveAuthority;
  limit?: {
    limit?: object;
  } & FilterOperations &
    DirectiveAuthority;
  option?: {
    option?: object;
  } & FilterOperations &
    DirectiveAuthority;
  "input-field"?: {
    fields: { include?: string[]; exclude?: string[] };
  } & FilterOperations;
  "input-data"?: {
    data?: object;
  } & FilterOperations &
    DirectiveAuthority;
};

type FieldDirective = {
  readable?: string[];
};

type ModelAuthorityType<T> = {
  [key: string]: {
    [key in Operation]: [string[], T][];
  };
};
type ModelBasicType<T> = {
  [key: string]: {
    [key in Operation]: T;
  };
};
type ModelExecutable = ModelAuthorityType<void>;
type ModelOption = ModelBasicType<object>;
type ModelWhere = ModelAuthorityType<object>;
type ModelLimit = ModelAuthorityType<number>;
type ModelOrder = ModelAuthorityType<object>;
type ModelInputWithoutFields = ModelBasicType<string[]>;
type ModelSelections = ModelBasicType<string[]>;
type ModelInputData = ModelAuthorityType<object>;

export class PrismaSchemaGenerator<
  Types extends SchemaTypes
> extends PrismaCrudGenerator<Types> {
  private _builder;
  modelDirectives: {
    [key: string]: {
      [key in keyof ModelDirective]: Exclude<ModelDirective[key], undefined>[];
    };
  } = {};
  fieldDirectives: {
    [key: string]: {
      [key: string]: {
        [key in keyof FieldDirective]: Exclude<
          FieldDirective[key],
          undefined
        >[];
      };
    };
  } = {};

  modelOptions: {
    [key: string]: { [key in Operation]: object | undefined };
  } = {};
  modelSelections: ModelSelections = {};
  modelLimit: ModelLimit = {};
  modelWhere: ModelWhere = {};
  modelExecutable: ModelExecutable = {};
  modelOrder: ModelOrder = {};
  modelInputWithoutFields: ModelInputWithoutFields = {};
  modelInputData: ModelInputData = {};

  replaceValues?: {
    [key: string]: (props: {
      context: Types["Context"];
    }) => object | string | number | undefined;
  };
  authorityFunc?: (props: { context: SchemaTypes["Context"] }) => string[];

  constructor(builder: PothosSchemaTypes.SchemaBuilder<Types>) {
    super(builder);
    this._builder = builder;

    this.getModels().forEach(({ name: modelName, documentation, fields }) => {
      this.modelDirectives[modelName] = this.getSchemaDirectives(
        modelName,
        documentation
      ).reduce((pre, value) => {
        Object.keys(value).forEach((key) => {
          const directives = pre[key] ?? [];
          pre[key] = [...directives, value[key]];
        });
        return pre;
      }, []);
      this.fieldDirectives[modelName] = {};
      fields.forEach(({ name: fieldName, documentation }) => {
        this.fieldDirectives[modelName][fieldName] =
          this.getSchemaFieldDirectives(
            modelName,
            fieldName,
            documentation
          ).reduce((pre, value) => {
            Object.keys(value).forEach((key) => {
              const directives = pre[key] ?? [];
              pre[key] = [...directives, value[key]];
            });
            return pre;
          }, []);
      });
    });

    this.createModelOptions();
    this.createModelLimit();
    this.createModelWhere();
    this.createModelOrder();
    this.createModelInputField();
    this.createModelInputData();
    this.createModelExecutable();
  }
  getBuilder() {
    return this._builder;
  }

  addReplaceValue(
    search: string,
    replaceFunction: (props: {
      context: Types["Context"];
    }) => object | string | number | undefined
  ) {
    if (!this.replaceValues) this.replaceValues = {};
    this.replaceValues[search] = replaceFunction;
  }
  replaceValue(target: object, props: { context: Types["Context"] }) {
    const replaces: {
      [key: string]: (props: {
        context: Types["Context"];
      }) => object | string | number | undefined;
    } = {};
    const src = { ...target };
    traverse(src).forEach((value) => {
      const func = this.replaceValues?.[value];
      if (func) {
        replaces[value] = func;
      }
    });
    const replaceValues = Object.fromEntries(
      Object.entries(replaces).map(([key, func]) => [key, func(props)])
    );
    return traverse(src).forEach(function (value) {
      const v = replaceValues[value];
      if (v) {
        this.update(v);
      }
    });
  }

  setAuthority(func: (props: { context: SchemaTypes["Context"] }) => string[]) {
    this.authorityFunc = func;
  }
  getAuthority(context: SchemaTypes["Context"]) {
    return this.authorityFunc ? this.authorityFunc({ context }) : [];
  }
  getModels() {
    const builder = this.getBuilder();
    const { models } = this.getDMMF(builder);
    return Object.entries(models).map(([name, value]) => ({ name, ...value }));
  }

  protected createModelOptions() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "option");
      this.modelOptions[name] = directives.reduce((pre, directive) => {
        const operations = this.getFilterOperations(directive);
        let result = { ...pre };
        operations.forEach((action) => {
          result = { ...result, [action]: directive?.option };
        });
        return result;
      }, {} as ModelOption[string]);
    });
  }
  protected createModelExecutable() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "executable");
      this.modelExecutable[name] = directives.reduce((pre, directive) => {
        const operations = this.getFilterOperations(directive);
        const { authority } = directive;
        return operations.reduce(
          (pre, operation) => ({
            ...pre,
            [operation]: [...(pre[operation] ?? []), [authority]],
          }),
          pre
        );
      }, {} as ModelExecutable[string]);
    });
  }
  protected createModelOrder() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "order");
      this.modelOrder[name] = directives.reduce((pre, directive) => {
        const operations = this.getFilterOperations(directive);
        const { authority = [], orderBy } = directive;
        return operations.reduce(
          (pre, operation) => ({
            ...pre,
            [operation]: [...(pre[operation] ?? []), [authority, orderBy]],
          }),
          pre
        );
      }, {} as ModelOrder[string]);
    });
  }
  protected createModelWhere() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "where");
      this.modelWhere[name] = directives.reduce((pre, directive) => {
        const operations = this.getFilterOperations(directive);
        const { authority = [], where } = directive;
        return operations.reduce(
          (pre, operation) => ({
            ...pre,
            [operation]: [...(pre[operation] ?? []), [authority, where]],
          }),
          pre
        );
      }, {} as ModelWhere[string]);
    });
  }
  protected createModelLimit() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "limit");
      this.modelLimit[name] = directives.reduce((pre, directive) => {
        const operations = this.getFilterOperations(directive);
        const { authority = [], limit } = directive;
        return operations.reduce(
          (pre, operation) => ({
            ...pre,
            [operation]: [...(pre[operation] ?? []), [authority, limit]],
          }),
          pre
        );
      }, {} as ModelLimit[string]);
    });
  }
  protected createModelInputField() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "input-field");
      this.modelInputWithoutFields[name] = directives.reduce(
        (pre, directive) => {
          const operations = this.getFilterOperations(directive);
          const { fields } = directive;
          return operations.reduce(
            (pre, operation) => ({
              ...pre,
              [operation]: [
                ...(pre[operation] ?? []),
                ...this.getModelFields(name, fields),
              ],
            }),
            pre
          );
        },
        {} as ModelInputWithoutFields[string]
      );
    });
  }
  protected createModelInputData() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "input-data");
      this.modelInputData[name] = directives.reduce((pre, directive) => {
        const operations = this.getFilterOperations(directive);
        const { authority = [], data } = directive;
        return operations.reduce(
          (pre, operation) => ({
            ...pre,
            [operation]: [...(pre[operation] ?? []), [authority, data]],
          }),
          pre
        );
      }, {} as ModelInputData[string]);
    });
  }
  getSchemaDirectives = (modelName: string, doc?: string) => {
    const regex = /(?<=@pothos-generator\s).*$/gm;
    return (
      doc
        ?.replace(/\\n/g, "\n")
        .match(regex)
        ?.map((text) => {
          const [, key, json] =
            text.match(
              /^(operation|executable|where|limit|order|option|input-field|input-data)\s+(.*?)$/
            ) ?? [];
          if (!key || !json)
            throw new Error(
              `Error parsing schema directive: ${modelName}\n ${text}`
            );
          try {
            return { [key]: JSON5.parse(json) };
          } catch (e) {
            throw new Error(
              `Error parsing schema directive:  ${modelName}\n ${e}\n`
            );
          }
        }) ?? []
    );
  };
  getSchemaFieldDirectives = (
    modelName: string,
    fieldName: string,
    doc?: string
  ) => {
    const regex = /(?<=@pothos-generator\s).*$/gm;
    return (
      doc
        ?.replace(/\\n/g, "\n")
        .match(regex)
        ?.map((text) => {
          const [, key, json] = text.match(/^(readable)\s+(.*?)$/) ?? [];
          if (!key || !json)
            throw new Error(
              `Error parsing schema directive: ${modelName}.${fieldName}\n ${text}`
            );
          try {
            return { [key]: JSON5.parse(json) };
          } catch (e) {
            throw new Error(
              `Error parsing schema directive:  ${modelName}.${fieldName}\n ${e}\n`
            );
          }
        }) ?? []
    );
  };
  expandOperations = (operations: ExtendOperation[]) =>
    Array.from(
      new Set(
        operations.flatMap(
          (operation) =>
            operationMap[operation as keyof typeof operationMap] ?? operation
        )
      )
    );

  getFilterOperations = ({ include, exclude }: FilterOperations) => {
    if (include) {
      return this.expandOperations(include);
    }
    if (exclude) {
      const expandExclude = this.expandOperations(exclude);
      return allOperations.filter((action) => !expandExclude.includes(action));
    }
    return allOperations;
  };
  getFieldReadable(modelName: string, fieldName: string) {
    return this.fieldDirectives[modelName][fieldName]?.readable?.reduce(
      (a, b) => {
        b.forEach((v) => a.add(v));
        return a;
      },
      new Set<string>()
    );
  }

  getModelFields(
    modelName: string,
    fields?: { include?: string[]; exclude?: string[] }
  ) {
    const model = this.getModels().find(({ name }) => name === modelName);
    const modelFields = model!.fields.map(({ name }) => name);
    const include = fields?.include ?? modelFields;
    const exclude = fields?.exclude ?? [];
    const result = include.filter((field) => !exclude.includes(field));
    return modelFields.filter((field) => !result.includes(field));
  }

  getModelDirectives<T extends keyof ModelDirective>(
    modelName: string,
    kind: T
  ): Exclude<ModelDirective[T], undefined>[] {
    return this.modelDirectives[modelName]?.[kind] ?? [];
  }
  getModelOperations(modelName: string) {
    const directives = this.getModelDirectives(modelName, "operation");
    return directives.reduce<string[]>((_, action) => {
      return this.getFilterOperations(action);
    }, allOperations);
  }

  getModelOptions(modelName: string) {
    return this.modelOptions[modelName];
  }
  getModelExcludeField(modelName: string) {
    return Object.entries(this.fieldDirectives[modelName]).flatMap(
      ([fieldName, directives]) => {
        const readable = directives.readable?.reduce((a, b) => {
          b.forEach((v) => a.add(v));
          return a;
        }, new Set<string>());
        if (readable && !readable.size) {
          return [fieldName];
        }
        return [];
      }
    );
  }
  checkModelExecutable(
    modelName: string,
    operationPrefix: Operation,
    authority: string[]
  ) {
    const values = this.modelExecutable[modelName][operationPrefix];
    if (!values) return true;
    const executable = values.reduce((pre, value) => {
      value[0].forEach((v) => pre.add(v));
      return pre;
    }, new Set<string>());
    if (!authority.some((v) => executable.has(v)))
      throw new Error("No permission");
    return true;
  }
  getModelWhere(
    modelName: string,
    operationPrefix: Operation,
    authority: string[],
    ctx: SchemaTypes["Context"]
  ) {
    const values = this.modelWhere[modelName][operationPrefix];
    const whereModel = values?.find(
      (value) =>
        value[0].length === 0 || value[0].some((v) => authority.includes(v))
    );

    const where = this.replaceValue(whereModel?.[1] ?? [], {
      context: ctx,
    });

    return where;
  }
  getModelLimit(
    modelName: string,
    operationPrefix: Operation,
    authority: string[]
  ) {
    const values = this.modelLimit[modelName][operationPrefix];
    const limitModel = values?.find(
      (value) =>
        value[0].length === 0 || value[0].some((v) => authority.includes(v))
    );

    return limitModel?.[1];
  }
  getModelOrder(
    modelName: string,
    operationPrefix: Operation,
    authority: string[]
  ) {
    const values = this.modelOrder[modelName][operationPrefix];
    const action = values?.find(
      (value) =>
        value[0].length === 0 || value[0].some((v) => authority.includes(v))
    );
    return action?.[1] ?? [];
  }
  getModelInputFields(modelName: string) {
    return this.modelInputWithoutFields[modelName] ?? [];
  }
  getModelInputData(
    modelName: string,
    operationPrefix: Operation,
    authority: string[],
    ctx: SchemaTypes["Context"]
  ) {
    const values = this.modelInputData[modelName][operationPrefix];
    const action =
      values?.find(
        (value) =>
          value[0].length === 0 || value[0].some((v) => authority.includes(v))
      )?.[1] ?? [];
    return this.replaceValue(action, {
      context: ctx,
    });
  }
  getCreateInput<Name extends keyof Types["PrismaTypes"] & string>(
    modelName: Name,
    without?: string[]
  ) {
    const fields = this.getModelInputFields(modelName)["createOne"] ?? [];
    return super.getCreateInput(
      modelName,
      [...fields, ...(without ?? [])],
      false
    );
  }
  getUpdateInput<Name extends keyof Types["PrismaTypes"] & string>(
    modelName: Name,
    without?: string[]
  ) {
    const fields = this.getModelInputFields(modelName)["updateOne"] ?? [];
    return super.getUpdateInput(modelName, [...fields, ...(without ?? [])]);
  }
}
