# pothos-prisma-generator

## Overview

Automatic generation of GraphQL schema from prisma schema.
generate `findFirst`,`findMany`,`createOne`,`createMany`,`updateOne`,`updateMany`,`deleteOne`,`deleteMany` for each model.

The schema is generated internally at runtime, so no text output of the code is performed.

## Sample code

- Next.js  
  <https://github.com/SoraKumo001/next-pothos>

## Builder Settings

Add PrismaPlugin,PrismaUtil,PothosPrismaGeneratorPlugin  
ScopeAuthPlugin must also be added when using the authorization function.

By setting `replace` and `authority` in pothosPrismaGenerator, you can refer to user information to separate the data to be inserted and the conditions to be applied.

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
  authScopes: async (context) => ({
    authenticated: !!context.user,
  }),
  pothosPrismaGenerator: {
    // Replace the following directives
    // /// @pothos-generator input {data:{author:{connect:{id:"%%USER%%"}}}}
    replace: { "%%USER%%": ({ context }) => context.user?.id },

    // Set the following permissions
    /// @pothos-generator where {include:["query"],where:{},authority:["authenticated"]}
    authority: ({ context }) => (context.user?.id ? ["authenticated"] : []),
  },
});
```

### How to Write Directives

```prisma
/// @pothos-generator [Directive name] [Json5 format parameters]
model ModelName {
  …
}
```

### Operation name

- `find` or `query`  
  `findFirst`,`findMany`
- `create`  
  `createOne`,`createMany`
- `update`  
  `updateOne`,`updateMany`
- `delete`  
  `deleteOne`,`deleteMany`
- `mutation`  
  `createOne`,`createMany`,`updateOne`,`updateMany`,`deleteOne`,`deleteMany`

### Select the operation to output

`operation {include:[...OperationNames],exclude[...OperationNames]}`

The default is all output.

Example

- Include `createOne` and `updateOne

```prisma
/// @pothos-generator operation {include:["createOne","updateOne"]}
```

- Exclude `deleteOne` and `deleteMany

```prisma
/// @pothos-generator operation {exclude:["delete"]}
```

### Sets options to be set for Pothos fields.

`option {include:[...OperationNames],exclude[...OperationNames],option:{OptionName:Params,…}}`

Example

Set auth-plugin's `authScopes` for `createOne`,`createMany`,`updateOne`,`updateMany`,`deleteOne`,`deleteMany`.

```prisma
/// @pothos-generator option {include:["mutation"],option:{authScopes:{authenticated:true}}}
```

### Select the fields to be set for the model type

`select {fields:{include:[...FieldNames],exclude:[...FieldNames]}}`

### Set the fields that are allowed to be entered

`input-field {include:[...OperationNames],exclude[...OperationNames],fields:{include:[...FieldNames],exclude:[...FieldNames]}}`

### Set the data to be interrupted in prisma data

`input-data {include:[...OperationNames],exclude[...OperationNames],data:InputData,authority:[...Authorities]}`

When authority is set, the first matching `input-data` directive is used.  
The `replace` option of builder will replace the content.

### Interrupts where to pass to prisma; if authority is set, the first match is used

`where {include:[...OperationNames],exclude[...OperationNames],where:Where,authority:[...Authorities]}`

The `replace` option of builder will replace the content.

### Interrupts orderBy to pass to prisma; if authority is set, the first match is used

`order {include:[...OperationNames],exclude[...OperationNames],orderBy:order,authority:[...Authorities]}`

## Prisma schema settings

The output content is controlled by `@pothos-generator`.  
Details are omitted since the specification is still under development and is likely to change.

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

// Unnecessary because automatic generation does not refer to type information

// generator pothos {
//   provider     = "prisma-pothos-types"
//   clientOutput = "@prisma/client"
//   output       = "../src/server/generated/pothos-types.ts"
// }

/// @pothos-generator operation {include:["createOne","updateOne","findMany"]}
/// @pothos-generator select {fields:{exclude:["email"]}}
/// @pothos-generator input-field {include:["create"],fields:{include:["email","name"]}}
/// @pothos-generator input-field {include:["update"],fields:{include:["name"]}}
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String   @default("User")
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

/// @pothos-generator operation {exclude:["deleteMany"]}
/// @pothos-generator option {include:["mutation"],option:{authScopes:{authenticated:true}}}
/// @pothos-generator input-field {fields:{exclude:["id","createdAt","updatedAt","author"]}}
/// @pothos-generator input-data {data:{author:{connect:{id:"%%USER%%"}}}}
/// @pothos-generator where {include:["query"],where:{},authority:["authenticated"]}
/// @pothos-generator where {include:["query"],where:{published:true}}
/// @pothos-generator where {include:["update","delete"],where:{authorId:"%%USER%%"}}
/// @pothos-generator order {orderBy:{title:"desc"}}
model Post {
  id          String     @id @default(uuid())
  published   Boolean    @default(false)
  title       String     @default("New Post")
  content     String     @default("")
  author      User?      @relation(fields: [authorId], references: [id])
  authorId    String?
  categories  Category[]
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
/// @pothos-generator where {include:["query"],where:{},authority:["authenticated"]}
authority: async ({ context }) => (context.user?.id ? ["authenticated"] : []),
```
