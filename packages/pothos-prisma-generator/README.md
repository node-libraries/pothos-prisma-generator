# pothos-prisma-generator

[![](https://img.shields.io/npm/l/pothos-prisma-generator)](https://www.npmjs.com/package/pothos-prisma-generator)
[![](https://img.shields.io/npm/v/pothos-prisma-generator)](https://www.npmjs.com/package/pothos-prisma-generator)
[![](https://img.shields.io/npm/dw/pothos-prisma-generator)](https://www.npmjs.com/package/pothos-prisma-generator)
[![](https://deepwiki.com/badge.svg)](https://deepwiki.com/node-libraries/pothos-prisma-generator)

## Overview

Automatic generation of GraphQL schema from prisma schema.

Generate a GraphQL schema from `prisma.schema` that can be queried as follows.

[prisma.schema](https://github.com/node-libraries/pothos-prisma-generator/blob/master/packages/test/prisma/schema.prisma) -> [queries.graphql](https://github.com/node-libraries/pothos-prisma-generator/blob/master/packages/test/graphql/operations.graphql)

![](https://raw.githubusercontent.com/node-libraries/pothos-prisma-generator/master/documents/screenshot01.png)

- `count`
- `findUnique`
- `findFirst`
- `findMany`
- `createOne`
- `createMany`
- `updateOne`
- `updateMany`
- `deleteOne`
- `deleteMany`

The schema is generated internally at runtime, so no text output of the code is performed.

## Notes on running from `tsx`.

Using `async-function@1.0.0` will cause errors for Pothos, so the version must be specified as follows.

- package.json

```json
{
  "resolutions": {
    "async-function": "0.1.0"
  }
}
```

## Sample code

- Next.js
  - <https://github.com/SoraKumo001/next-pothos>
  - Deployed on Vercel  
    <https://next-pothos.vercel.app/>
- NestJS
  - <https://github.com/SoraKumo001/nest-pothos>
  - Deployed on Render.com  
    <https://nest-pothos.onrender.com>

## Builder Settings

Add PrismaPlugin,PrismaUtil,PothosPrismaGeneratorPlugin  
ScopeAuthPlugin must also be added when using the authorization function.

By setting `replace` and `authority` in pothosPrismaGenerator, you can refer to user information to separate the data to be inserted and the conditions to be applied.

The following settings are made by default. To disable, use `autoScalers: false`.

```ts
builder.addScalarType("BigInt" as never, BigIntResolver, {});
builder.addScalarType("Bytes" as never, ByteResolver, {});
builder.addScalarType("DateTime" as never, DateTimeResolver, {});
builder.addScalarType("Json" as never, JSONResolver, {});
builder.addScalarType("Decimal" as never, HexadecimalResolver, {});
```

- Here is an example of Builder settings

```ts
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "./generated/pothos-types";
import { Context, prisma } from "./context";
import { Prisma } from "@prisma/client";
import { DateTimeResolver } from "graphql-scalars";
import PrismaUtils from "@pothos/plugin-prisma-utils";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import PothosPrismaGeneratorPlugin from "pothos-prisma-generator";

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
  ],
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
  // if necessary
  scopeAuth: {
    authScopes: async (context) => ({
      authenticated: !!context.user,
    }),
  },
  pothosPrismaGenerator: {
    // Disable `autoScalers
    //autoScalers: false,

    // Replace the following directives
    // /// @pothos-generator input {data:{author:{connect:{id:"%%USER%%"}}}}
    replace: { "%%USER%%": ({ context }) => context.user?.id },

    // Set the following permissions
    /// @pothos-generator any {authority:["ROLE"]}
    authority: ({ context }) => context.user?.roles ?? [],
    // Whether `include:[‘all’]` is applied by default
    defaultIncludes: {
      operations: true, // default
      fields: true, // default
    },
  },
});
```

- Edge run-times

https://pothos-graphql.dev/docs/plugins/prisma/setup#edge-run-times

```prisma
generator pothos {
  provider          = "prisma-pothos-types"
  clientOutput      = "@prisma/client"
  output            = "./pothos-types.ts"
  generateDatamodel = true
  documentation     = true # Must be set to true
}
```

### How to Write Directives

```prisma
/// @pothos-generator [Directive name] [Json5 format parameters]
model ModelName {
  …
}
```

### Operation name

If no operation is specified on the directive, it is applied to all.

- query  
  `findUnique`, `findFirst`, `findMany`, `count`
- find  
  `findUnique`, `findFirst`,`findMany`
- create  
  `createOne`, `createMany`
- update  
  `updateOne`, `updateMany`
- delete  
  `deleteOne`, `deleteMany`
- mutation  
  `createOne`, `createMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`
- all
  `findUnique`, `findFirst`, `findMany`, `count`, `createOne`, `createMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`

### Select the operation to output

`operation {include:[...OperationNames],exclude[...OperationNames]}`

The default is all output.

- Example1  
  Include `createOne` and `updateOne

```prisma
/// @pothos-generator operation {include:["createOne","updateOne"]}
```

- Example2  
  Exclude `deleteOne` and `deleteMany

```prisma
/// @pothos-generator operation {exclude:["delete"]}
```

### Model directive

#### Sets options to be set for Pothos fields.

- Operator **option**

```js
{
  include:[...OperationNames],
  exclude:[...OperationNames],
  option:{OptionName:Params,…}
}
```

- Example  
  Set auth-plugin's `authScopes` for `createOne`,`createMany`,`updateOne`,`updateMany`,`deleteOne`,`deleteMany`.

```prisma
/// @pothos-generator option {include:["mutation"],option:{authScopes:{authenticated:true}}}
```

---

#### Set the fields that are allowed to be entered

- Operator **input-field**

```js
{
  include:[...OperationNames],
  exclude:[...OperationNames],
  fields:{include:[...FieldNames],exclude:[...FieldNames]}
}
```

- Example  
  `create` allows `email` and `name` to be entered.

```prisma
/// @pothos-generator input-field {include:["create"],fields:{include:["email","name"]}}
```

---

#### Set the data to be interrupted in prisma data

- Operator **input-data**

```js
{
  include:[...OperationNames],
  exclude:[...OperationNames],
  data:InputData,
  authority:[...Authorities]
}
```

When authority is set, the first matching `input-data` directive is used.  
The `replace` option of builder will replace the content.

- Example  
  Replace `authorId` with `%%USER%%` when inserting data

```prisma
/// @pothos-generator input-data {data:{authorId:"%%USER%%"}}
```

---

#### Interrupts where to pass to prisma; if authority is set, the first match is used

- Operator **where**

```js
{
  include:[...OperationNames],
  exclude:[...OperationNames],
  where:Where,
  authority:[...Authorities]}
```

The `replace` option of builder will replace the content.

- Example  
  No condition if you have USER permission, otherwise `published:true` will be added to the condition.

```prisma
/// @pothos-generator where {include:["query"],where:{},authority:["USER"]}
/// @pothos-generator where {include:["query"],where:{published:true}}
```

---

#### Interrupts orderBy to pass to prisma; if authority is set, the first match is used

- Operator **order**

```js
{
  include:[...OperationNames],
  exclude:[...OperationNames],
  orderBy:order,
  authority:[...Authorities]
}
```

- Example  
  Defaults to `order` in ascending order of `title`.

```prisma
/// @pothos-generator order {orderBy:{title:"asc"}}
```

---

#### Authority to execute operations

- Operator **executable**

```js
{
  include:[...OperationNames],
  exclude:[...OperationNames],
  authority:[...Authorities]
}
```

- Example  
  You can perform `mutation` only if you retain USER privileges.

```prisma
/// @pothos-generator executable {include:["mutation"],authority:["USER"]}
```

---

#### limit on the number of events

- Operator **limit**

```js
{
  include:[...OperationNames],
  exclude:[...OperationNames],
  limit:LIMIT,
  authority:[...Authorities]
}
```

- Example  
  Set the maximum number of acquisitions to 10

```prisma
/// @pothos-generator limit {limit:10}
```

---

### Field directive

#### Field read permission

- Operator **readable**

```js
[...Authorities];
```

If Authorities is empty, it will be removed from the GraphQL Object and will not appear in the Query.

- Example1  
  It can only be retrieved if you have ADMIN permission. Otherwise, adding it to the query will raise an exception.

```prisma
 /// @pothos-generator readable ["ADMIN"]
```

- Example2  
  No one has read permission, so the field is invisible.

```prisma
/// @pothos-generator readable []
```

---

## Prisma schema settings

The output content is controlled by `@pothos-generator`.  
Details are omitted since the specification is still under development and is likely to change.

The `authScopes` are written for the option sample, but need not be introduced if executable/readable is used.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

/// @pothos-generator operation {include:["createOne","updateOne","findMany"]}
/// @pothos-generator option {include:["mutation"],option:{authScopes:{ADMIN:true}}}
/// @pothos-generator input-field {include:["create"],fields:{include:["email","name"]}}
/// @pothos-generator input-field {include:["update"],fields:{include:["name"]}}
model User {
  id        String   @id @default(uuid())
  /// @pothos-generator readable ["ADMIN"]
  email     String   @unique
  name      String   @default("User")
  posts     Post[]
  /// @pothos-generator readable ["ADMIN"]
  roles     Role[]   @default([USER])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

/// @pothos-generator operation {exclude:["deleteMany"]}
/// @pothos-generator executable {include:["mutation"],authority:["USER"]}
/// @pothos-generator input-field {fields:{exclude:["id","createdAt","updatedAt","author"]}}
/// @pothos-generator input-data {data:{authorId:"%%USER%%"}}
/// @pothos-generator where {include:["query"],where:{},authority:["USER"]}
/// @pothos-generator where {include:["query"],where:{published:true}}
/// @pothos-generator where {include:["update","delete"],where:{authorId:"%%USER%%"}}
/// @pothos-generator order {orderBy:{title:"asc"}}
model Post {
  id          String     @id @default(uuid())
  published   Boolean    @default(false)
  title       String     @default("New Post")
  content     String     @default("")
  author      User?      @relation(fields: [authorId], references: [id])
  authorId    String?
  categories  Category[]
  /// @pothos-generator readable []
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  publishedAt DateTime   @default(now())
}

/// @pothos-generator order {orderBy:{name:"asc"}}
/// @pothos-generator input-field {fields:{exclude:["id","createdAt","updatedAt","posts"]}}
model Category {
  id        String   @id @default(uuid())
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  USER
}
```

## Substitution of Input Data

If a replacement string is set for builder, it will replace the strings in the input-data and where directives when the query is executed.  
This can be used, for example, to write logged-in user information.

```ts
// Replace the following directives
// /// @pothos-generator input {data:{author:{connect:{id:"%%USER%%"}}}}
replace: { "%%USER%%": async ({ context }) => context.user?.id },
```

## Switching query conditions by permissions

You can switch where by setting permissions.  
In the following case, the condition `where:{}` is added if you are logged in, and `,where:{published:true}` if you are not logged in.

```ts
// Set the following permissions
// /// @pothos-generator any {authority:["ROLE"]}

// Sample assumes ["ADMIN", "USER"] is set during authentication
authority: ({ context }) => context.user?.roles ?? [],
```

## How to add directives on the code

- Request generator callback from builder

  - addSchemaGeneratorCallback: <Types extends SchemaTypes>(builder: PothosSchemaTypes.SchemaBuilder<Types>, callback: GeneratorCallback<Types>) => void;

- Add model options
  - addModelOptions(modelName: string, filterOperations: FilterOperations, options: object): void;
- Add model operations
  - addModelOperations(modelName: string, filterOperations: FilterOperations): void;
- Add model directives
  - addModelDirectives<K extends keyof ModelDirective>(modelName: string, directive: K, values: Required<ModelDirective>[K]): void;
- Add field directives
  - addFieldDirectives(modelName: string, fieldName: string, directive: keyof FieldDirective, value: string[]): void;

```ts
builder.addSchemaGenerator(({ generator }) => {});
```

## Adding custom fields to a model

Addition of a Test field to the `User` model.  
Note that custom fields are N+1.

```ts
builder.addModelFields("User", {
  Test: (t) => {
    return t.string({
      resolve: (parent) => {
        return `${parent.name}-test`;
      },
    });
  },
});

builder.addModelOptions(
  "User",
  { include: ["mutation"] },
  { authScopes: { ADMIN: true } }
);

builder.addModelOperations("User", {
  include: ["createOne", "updateOne", "findMany"],
});

builder.addFieldDirectives("User", "roles", "readable", ["ADMIN"]);
```
