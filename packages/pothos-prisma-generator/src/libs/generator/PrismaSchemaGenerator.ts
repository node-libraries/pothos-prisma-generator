import type { FieldRef, InputObjectRef, SchemaTypes } from "@pothos/core";
import type { PrismaModelTypes } from "@pothos/plugin-prisma";
import { type Optional } from "@prisma/client/runtime/client";
import JSON5 from "json5";
import traverse from "traverse";
import {
  PrismaCrudGenerator,
  RuntimeDataModel,
} from "./PrismaCrudGenerator.js";

export type RemoveReadonly<O> = {
  -readonly [K in keyof O]: RemoveReadonly<O[K]>;
};

type RuntimeModel = RemoveReadonly<RuntimeDataModel["models"][number]> & {
  name: string;
};

const countOperations = ["count"] as const;
const findOperations = ["findUnique", "findFirst", "findMany"] as const;
const createOperations = ["createOne", "createMany"] as const;
const updateOperations = ["updateOne", "updateMany"] as const;
const deleteOperations = ["deleteOne", "deleteMany"] as const;
const upsertOperations = ["upsertOne"] as const;
const mutationOperations = [
  ...createOperations,
  ...updateOperations,
  ...deleteOperations,
  ...upsertOperations,
] as const;
const queryOperations = [...findOperations, ...countOperations] as const;
const allOperations = [...queryOperations, ...mutationOperations];

const operationMap = {
  all: allOperations,
  find: findOperations,
  query: queryOperations,
  create: createOperations,
  update: updateOperations,
  delete: deleteOperations,
  upsert: upsertOperations,
  mutation: mutationOperations,
};

export type Operation = (typeof allOperations)[number];
export type ExtendOperation =
  | Operation
  | "mutation"
  | "query"
  | "create"
  | "update"
  | "delete"
  | "upsert"
  | "all";

export type FilterOperations = {
  include?: ExtendOperation[];
  exclude?: ExtendOperation[];
};
export type DirectiveAuthority = { authority?: string[] };

export type ModelDirective = {
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
    limit?: number;
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

export type FieldDirective = {
  readable?: string[];
  writable?:
    | boolean
    | string[]
    | {
        operations?: ExtendOperation[];
        authority?: string[];
      };
};

export type ModelAuthorityType<T> = {
  [key: string]: {
    [key in Operation]: [string[], T][];
  };
};
export type ModelBasicType<T> = {
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

type GeneratorParamsType<Types extends SchemaTypes> = {
  params: {
    query?: object;
    root: Types["Root"];
    args: unknown;
    ctx: Types["Context"];
    info: unknown;
  };
  prisma: Types["Prisma"];
  modelName: string;
  operationPrefix: Operation;
  authority: string[];
};

export type ParameterCallback<Types extends SchemaTypes> = (
  params: {
    where?: object;
    orderBy?: object;
    take?: number;
    skip?: number;
    input?: object;
    cursor?: object;
    distinct?: unknown[];
  },
  generatorParams: GeneratorParamsType<Types>,
) =>
  | {
      where?: object;
      orderBy?: object;
      take?: number;
      skip?: number;
      input?: object;
      cursor?: object;
      distinct?: unknown[];
    }
  | Promise<{
      where?: object;
      orderBy?: object;
      take?: number;
      skip?: number;
      input?: object;
      cursor?: object;
      distinct?: unknown[];
    }>;

export type PrismaSchemaGeneratorParams<
  T extends keyof PrismaSchemaGenerator<SchemaTypes>,
  P extends PrismaSchemaGenerator<SchemaTypes>[T] extends (
    ...args: never[]
  ) => unknown
    ? Parameters<PrismaSchemaGenerator<SchemaTypes>[T]>
    : never,
> = P;

export class PrismaSchemaGenerator<
  Types extends SchemaTypes,
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
  modelFields: {
    [key in keyof Types["PrismaTypes"]]?: {
      [key: string]: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        t: PothosSchemaTypes.PrismaObjectFieldBuilder<Types, any>,
      ) => FieldRef<Types>;
    };
  } = {};

  modelOptions: {
    [key: string]: { [key in Operation]?: object | undefined };
  } = {};
  modelSelections: ModelSelections = {};
  modelLimit: ModelLimit = {};
  modelWhere: ModelWhere = {};
  modelExecutable: ModelExecutable = {};
  modelOrder: ModelOrder = {};
  modelInputWithoutFields: ModelInputWithoutFields = {};
  modelInputData: ModelInputData = {};
  modelParameterCallbacks: ParameterCallback<Types>[] = [];

  replaceValues?: {
    [key: string]: (props: {
      context: Types["Context"];
    }) =>
      | object
      | string
      | number
      | undefined
      | Promise<object | string | number | undefined>;
  };
  authorityFunc?: (props: {
    context: SchemaTypes["Context"];
  }) => string[] | Promise<string[]>;

  customGenerator: {
    [K in keyof PrismaSchemaGenerator<Types>]?: PrismaSchemaGenerator<Types>[K][];
  } = {};

  constructor(builder: PothosSchemaTypes.SchemaBuilder<Types>) {
    super(builder);
    this._builder = builder;
  }
  createModels() {
    this.getModels().forEach(({ name: modelName, documentation, fields }) => {
      this.modelDirectives[modelName] = this.getSchemaDirectives(
        modelName,
        documentation,
      ).reduce((pre, value) => {
        Object.keys(value).forEach((key) => {
          const directives = pre[key] ?? [];
          pre[key] = [...directives, value[key]];
        });
        return pre;
      }, this.modelDirectives[modelName] ?? []);
      this.fieldDirectives[modelName] = this.fieldDirectives[modelName] ?? {};
      fields.forEach(({ name: fieldName, documentation }) => {
        this.fieldDirectives[modelName][fieldName] =
          this.getSchemaFieldDirectives(
            modelName,
            fieldName,
            documentation,
          ).reduce((pre, value) => {
            Object.keys(value).forEach((key) => {
              const directives = pre[key] ?? [];
              pre[key] = [...directives, value[key]];
            });
            return pre;
          }, this.fieldDirectives[modelName][fieldName] ?? []);
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
    }) =>
      | object
      | string
      | number
      | undefined
      | Promise<object | string | number | undefined>,
  ) {
    if (!this.replaceValues) this.replaceValues = {};
    this.replaceValues[search] = replaceFunction;
  }
  replaceValue(target: object, props: { context: Types["Context"] }) {
    if (!target || typeof target !== "object") return target;
    const replaceEntries = this.replaceValues;
    if (!replaceEntries || Object.keys(replaceEntries).length === 0) {
      return traverse(target).map(function () {});
    }
    const computedValues: Record<string, unknown> = {};
    let hasPromise = false;
    for (const key of Object.keys(replaceEntries)) {
      const val = replaceEntries[key](props);
      if (val instanceof Promise) {
        hasPromise = true;
      }
      computedValues[key] = val;
    }

    if (hasPromise) {
      return (async () => {
        for (const key of Object.keys(computedValues)) {
          if (computedValues[key] instanceof Promise) {
            computedValues[key] = await computedValues[key];
          }
        }
        return traverse(target).map(function (value) {
          if (
            typeof value === "string" &&
            Object.hasOwn(computedValues, value)
          ) {
            this.update(computedValues[value]);
          }
        });
      })();
    }

    return traverse(target).map(function (value) {
      if (typeof value === "string" && Object.hasOwn(computedValues, value)) {
        this.update(computedValues[value]);
      }
    });
  }

  setAuthority(
    func: (props: {
      context: Types["Context"];
    }) => string[] | Promise<string[]>,
  ) {
    this.authorityFunc = func;
  }
  getAuthority(context: Types["Context"]): string[] | Promise<string[]> {
    /* istanbul ignore next */
    return this.authorityFunc?.({ context }) ?? [];
  }
  getModels() {
    const builder = this.getBuilder();
    const { models } = this.getDMMF(builder);
    return Object.entries(models).map(
      ([name, value]) => ({ name, ...value }) as RuntimeModel,
    );
  }
  addModelParameterCallback(callback: ParameterCallback<Types>) {
    this.modelParameterCallbacks.push(callback);
  }
  addModelOptions(
    modelName: string,
    filterOperations: FilterOperations,
    options: object,
  ) {
    const operations = this.getFilterOperations(filterOperations);
    this.modelOptions[modelName] = this.modelOptions[modelName] ?? {};
    operations.forEach((operation) => {
      this.modelOptions[modelName][operation] =
        this.modelOptions[modelName][operation] ?? {};
      this.modelOptions[modelName][operation] = {
        ...this.modelOptions[modelName][operation],
        ...options,
      };
    });
  }
  addModelOperations(modelName: string, filterOperations: FilterOperations) {
    this.modelDirectives[modelName] = this.modelDirectives[modelName] ?? {};
    this.modelDirectives[modelName]["operation"] = [
      ...(this.modelDirectives[modelName]["operation"] ?? []),
      filterOperations,
    ];
  }
  addModelDirectives<
    K extends keyof ModelDirective,
    Name extends keyof Types["PrismaTypes"],
  >(modelName: Name, directive: K, values: Required<ModelDirective>[K]) {
    this.modelDirectives[modelName as string] =
      this.modelDirectives[modelName as string] ?? {};
    this.modelDirectives[modelName as string][directive] = [
      ...(this.modelDirectives[modelName as string][directive] ?? []),
      values,
    ] as (typeof this.modelDirectives)[string][K];
  }
  addFieldDirectives<K extends keyof FieldDirective>(
    modelName: string,
    fieldName: string | string[],
    directive: K,
    value: NonNullable<FieldDirective[K]>,
  ) {
    this.fieldDirectives[modelName] = this.fieldDirectives[modelName] ?? {};
    const fieldNames = Array.isArray(fieldName) ? fieldName : [fieldName];
    fieldNames.forEach((name) => {
      this.fieldDirectives[modelName][name] =
        this.fieldDirectives[modelName][name] ?? {};
      this.fieldDirectives[modelName][name][directive] = [
        ...((this.fieldDirectives[modelName][name][directive] as unknown[]) ??
          []),
        value,
      ] as never;
    });
  }
  protected createModelOptions() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "option");
      this.modelOptions[name] = {
        ...directives.reduce<Optional<ModelOption[string]>>(
          (pre, directive) => {
            const operations = this.getFilterOperations(directive);
            let result = { ...pre };
            operations.forEach((action) => {
              result = { ...result, [action]: directive?.option };
            });
            return result;
          },
          {},
        ),
        ...this.modelOptions[name],
      };
    });
  }
  protected createModelExecutable() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "executable");
      this.modelExecutable[name] = directives.reduce(
        (pre, directive) => {
          const operations = this.getFilterOperations(directive);
          const { authority = [] } = directive;
          return operations.reduce(
            (pre, operation) => ({
              ...pre,
              [operation]: [...(pre[operation] ?? []), [authority]],
            }),
            pre,
          );
        },
        {} as ModelExecutable[string],
      );
    });
  }
  protected createModelOrder() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "order");
      this.modelOrder[name] = directives.reduce(
        (pre, directive) => {
          const operations = this.getFilterOperations(directive);
          const { authority = [], orderBy } = directive;
          return operations.reduce(
            (pre, operation) => ({
              ...pre,
              [operation]: [...(pre[operation] ?? []), [authority, orderBy]],
            }),
            pre,
          );
        },
        {} as ModelOrder[string],
      );
    });
  }
  protected createModelWhere() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "where");
      this.modelWhere[name] = directives.reduce(
        (pre, directive) => {
          const operations = this.getFilterOperations(directive);
          const { authority = [], where } = directive;
          return operations.reduce(
            (pre, operation) => ({
              ...pre,
              [operation]: [...(pre[operation] ?? []), [authority, where]],
            }),
            pre,
          );
        },
        {} as ModelWhere[string],
      );
    });
  }
  protected createModelLimit() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "limit");
      this.modelLimit[name] = directives.reduce(
        (pre, directive) => {
          const operations = this.getFilterOperations(directive);
          const { authority = [], limit } = directive;
          return operations.reduce(
            (pre, operation) => ({
              ...pre,
              [operation]: [...(pre[operation] ?? []), [authority, limit]],
            }),
            pre,
          );
        },
        {} as ModelLimit[string],
      );
    });
  }
  protected createModelInputField() {
    this.getModels().forEach(({ name, fields }) => {
      const directives = this.getModelDirectives(name, "input-field");
      const withoutFields = directives.reduce(
        (pre, directive) => {
          const operations = this.getFilterOperations(directive);
          const { fields: targetFields } = directive;
          return operations.reduce(
            (pre, operation) => ({
              ...pre,
              [operation]: [
                ...(pre[operation] ?? []),
                ...this.getModelFields(name, targetFields),
              ],
            }),
            pre,
          );
        },
        {} as ModelInputWithoutFields[string],
      );

      fields.forEach(({ name: fieldName }) => {
        const writable = this.getFieldWritable(name, fieldName);
        if (writable === false) {
          mutationOperations.forEach((operation) => {
            withoutFields[operation] = [
              ...(withoutFields[operation] ?? []),
              fieldName,
            ];
          });
        } else if (
          writable &&
          typeof writable === "object" &&
          !Array.isArray(writable) &&
          !writable.authority &&
          writable.operations
        ) {
          const ops = this.getFilterOperations({
            include: writable.operations,
          });
          ops.forEach((operation) => {
            withoutFields[operation] = [
              ...(withoutFields[operation] ?? []),
              fieldName,
            ];
          });
        }
      });

      this.modelInputWithoutFields[name] = withoutFields;
    });
  }
  protected createModelInputData() {
    this.getModels().forEach(({ name }) => {
      const directives = this.getModelDirectives(name, "input-data");
      this.modelInputData[name] = directives.reduce(
        (pre, directive) => {
          const operations = this.getFilterOperations(directive);
          const { authority = [], data } = directive;
          return operations.reduce(
            (pre, operation) => ({
              ...pre,
              [operation]: [...(pre[operation] ?? []), [authority, data]],
            }),
            pre,
          );
        },
        {} as ModelInputData[string],
      );
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
              /^(operation|executable|where|limit|order|option|input-field|input-data)\s+(.*?)$/,
            ) ?? [];
          if (!key || !json)
            throw new Error(
              `Error parsing schema directive: ${modelName}\n ${text}`,
            );
          try {
            return { [key]: JSON5.parse(json) };
          } catch (e) {
            throw new Error(
              `Error parsing schema directive:  ${modelName}\n ${e}\n`,
            );
          }
        }) ?? []
    );
  };
  getSchemaFieldDirectives = (
    modelName: string,
    fieldName: string,
    doc?: string,
  ) => {
    const regex = /(?<=@pothos-generator\s).*$/gm;
    return (
      doc
        ?.replace(/\\n/g, "\n")
        .match(regex)
        ?.map((text) => {
          const [, key, json] =
            text.match(/^(readable|writable)\s+(.*?)$/) ?? [];
          if (!key || !json)
            throw new Error(
              `Error parsing schema directive: ${modelName}.${fieldName}\n ${text}`,
            );
          try {
            return { [key]: JSON5.parse(json) };
          } catch (e) {
            throw new Error(
              `Error parsing schema directive:  ${modelName}.${fieldName}\n ${e}\n`,
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
            operationMap[operation as keyof typeof operationMap] ?? operation,
        ),
      ),
    );

  getFilterOperations = ({ include, exclude }: FilterOperations) => {
    const defaultIncludes =
      this.getBuilder().options.pothosPrismaGenerator?.defaultIncludes
        ?.operations ?? true;
    const includeOperations = include
      ? this.expandOperations(include)
      : defaultIncludes
        ? allOperations
        : [];
    const excludeOperations = exclude ? this.expandOperations(exclude) : [];
    const result = includeOperations.filter(
      (action) => !excludeOperations.includes(action),
    );
    return result;
  };

  getFieldReadable(modelName: string, fieldName: string) {
    return this.fieldDirectives[modelName]?.[fieldName]?.readable?.reduce(
      (a, b) => {
        b.forEach((v) => a.add(v));
        return a;
      },
      new Set<string>(),
    );
  }

  getFieldWritable(modelName: string, fieldName: string) {
    const directives = this.fieldDirectives[modelName]?.[fieldName]?.writable;
    if (!directives || directives.length === 0) return undefined;
    return directives[directives.length - 1];
  }

  checkFieldWritable(
    modelName: string,
    fieldName: string,
    authority: string[],
  ): boolean {
    const writable = this.getFieldWritable(modelName, fieldName);
    if (writable === undefined) return true;
    if (writable === false) return false;
    let requiredAuth: string[] | undefined;
    if (Array.isArray(writable)) {
      requiredAuth = writable;
    } else if (typeof writable === "object" && writable.authority) {
      requiredAuth = writable.authority;
    }
    if (requiredAuth && requiredAuth.length > 0) {
      return authority.some((a) => requiredAuth!.includes(a));
    }
    return true;
  }

  checkInputWritable(modelName: string, input: unknown, authority: string[]) {
    if (!input || typeof input !== "object") return;
    for (const key of Object.keys(input)) {
      if (!this.checkFieldWritable(modelName, key, authority)) {
        throw new Error(`Field '${key}' is not writable for your authority`);
      }
    }
  }

  getModelFields(
    modelName: string,
    fields?: { include?: string[]; exclude?: string[] },
  ) {
    const defaultIncludes =
      this.getBuilder().options.pothosPrismaGenerator?.defaultIncludes
        ?.fields ?? true;
    const model = this.getModels().find(({ name }) => name === modelName);
    const modelFields = model!.fields.map(({ name }) => name);
    const include = fields?.include ?? (defaultIncludes ? modelFields : []);
    const exclude = fields?.exclude ?? [];
    const result = include.filter((field) => !exclude.includes(field));
    return modelFields.filter((field) => !result.includes(field));
  }

  getModelDirectives<T extends keyof ModelDirective>(
    modelName: string,
    kind: T,
  ): Exclude<ModelDirective[T], undefined>[] {
    return this.modelDirectives[modelName]?.[kind] ?? [];
  }
  getModelOperations(modelName: string): Operation[] {
    const directives = this.getModelDirectives(modelName, "operation");
    const operators = directives.reduce<Operation[]>((acc, action) => {
      const next = this.getFilterOperations(action);
      return acc.filter((op) => next.includes(op));
    }, this.getFilterOperations({}));
    return operators;
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
      },
    );
  }
  checkModelExecutable({
    modelName,
    operationPrefix,
    authority,
  }: {
    modelName: string;
    operationPrefix: Operation;
    authority: string[];
  }) {
    const values = this.modelExecutable[modelName]?.[operationPrefix];
    if (!values || values.length === 0) return true;
    const executable = values.reduce((pre, value) => {
      (value[0] ?? []).forEach((v) => pre.add(v));
      return pre;
    }, new Set<string>());
    if (!authority.some((v) => executable.has(v)))
      throw new Error("No permission");
    return true;
  }
  async getModelWhere({
    params,
    modelName,
    operationPrefix,
    authority,
  }: {
    params: {
      root: Types["Root"];
      args: unknown;
      ctx: Types["Context"];
      info: unknown;
    };
    prisma: Types["Prisma"];
    modelName: string;
    operationPrefix: Operation;
    authority: string[];
  }): Promise<{ [key: string]: unknown } | undefined> {
    const values = this.modelWhere[modelName]?.[operationPrefix];
    const whereModel = values?.find(
      (value) =>
        value[0].length === 0 || value[0].some((v) => authority.includes(v)),
    );
    return (await this.replaceValue(whereModel?.[1] ?? [], {
      context: params.ctx,
    })) as { [key: string]: unknown } | undefined;
  }
  getModelLimit(
    modelName: string,
    operationPrefix: Operation,
    authority: string[],
  ) {
    const values = this.modelLimit[modelName]?.[operationPrefix];
    const limitModel = values?.find(
      (value) =>
        value[0].length === 0 || value[0].some((v) => authority.includes(v)),
    );

    return limitModel?.[1];
  }
  getModelOrder(
    modelName: string,
    operationPrefix: Operation,
    authority: string[],
  ) {
    const values = this.modelOrder[modelName]?.[operationPrefix];
    const action = values?.find(
      (value) =>
        value[0].length === 0 || value[0].some((v) => authority.includes(v)),
    );
    return action?.[1] ?? [];
  }
  async getParameters<
    WHERE extends object,
    ORDERBY extends object,
    TAKE extends number,
    SKIP extends number,
    INPUT extends object,
    CURSOR extends object,
    DISTINCT extends unknown[],
  >(
    params: {
      where?: WHERE;
      orderBy?: ORDERBY;
      take?: TAKE;
      skip?: SKIP;
      input?: INPUT;
      cursor?: CURSOR;
      distinct?: DISTINCT;
    },
    generatorParams: {
      params: {
        query?: object;
        root: Types["Root"];
        args: unknown;
        ctx: Types["Context"];
        info: unknown;
      };
      prisma: Types["Prisma"];
      modelName: string;
      operationPrefix: Operation;
      authority: string[];
    },
  ): Promise<typeof params> {
    let current = params;
    for (const callback of this.modelParameterCallbacks) {
      current = (await callback(current, generatorParams)) as typeof params;
    }
    return current;
  }
  getModelInputFields(modelName: string) {
    return (
      this.modelInputWithoutFields[modelName] ??
      ({} as Record<Operation, string[]>)
    );
  }
  async getModelInputData(
    modelName: string,
    operationPrefix: Operation,
    authority: string[],
    ctx: SchemaTypes["Context"],
  ): Promise<object> {
    const values = this.modelInputData[modelName]?.[operationPrefix];
    const action =
      values?.find(
        (value) =>
          value[0].length === 0 || value[0].some((v) => authority.includes(v)),
      )?.[1] ?? [];
    return (await this.replaceValue(action, {
      context: ctx,
    })) as object;
  }
  getCreateInput<Name extends keyof Types["PrismaTypes"] & string>(
    modelName: Name,
    without?: string[],
  ): InputObjectRef<
    Types,
    (PrismaModelTypes & Types["PrismaTypes"][Name])["Create"]
  > {
    const fields = this.getModelInputFields(modelName)["createOne"] ?? [];
    return super.getCreateInput(
      modelName,
      [...fields, ...(without ?? [])],
      without && without.length > 0 ? undefined : false,
    );
  }
  getCreateManyInput<Name extends keyof Types["PrismaTypes"] & string>(
    modelName: Name,
    without?: string[],
  ): InputObjectRef<
    Types,
    (PrismaModelTypes & Types["PrismaTypes"][Name])["Create"]
  > {
    const fields = this.getModelInputFields(modelName)["createMany"] ?? [];
    return super.getCreateManyInput(
      modelName,
      [...fields, ...(without ?? [])],
      without && without.length > 0 ? undefined : false,
    );
  }
  getUpdateInput<Name extends keyof Types["PrismaTypes"] & string>(
    modelName: Name,
    without?: string[],
  ): InputObjectRef<
    Types,
    (PrismaModelTypes & Types["PrismaTypes"][Name])["Update"]
  > {
    const fields = this.getModelInputFields(modelName)["updateOne"] ?? [];
    return super.getUpdateInput(
      modelName,
      [...fields, ...(without ?? [])],
      without && without.length > 0 ? undefined : false,
    );
  }
}
