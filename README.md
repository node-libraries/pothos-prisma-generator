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
  // if necessary
  authScopes: async (context) => ({
    authenticated: !!context.user,
  }),
  pothosPrismaGenerator: {
    // Replace the following directives
    // /// @pothos-generator input {data:{author:{connect:{id:"%%USER%%"}}}}
    replace: { "%%USER%%": ({ context }) => context.user?.id },

    // Set the following permissions
    /// @pothos-generator any {authority:["ROLE"]}
    authority: ({ context }) => context.user?.roles ?? [],
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

- `query`  
  `findFirst`,`findMany`,`count`
- `find`  
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

### Model directive

#### Sets options to be set for Pothos fields.

`option {include:[...OperationNames],exclude[...OperationNames],option:{OptionName:Params,…}}`

Example

Set auth-plugin's `authScopes` for `createOne`,`createMany`,`updateOne`,`updateMany`,`deleteOne`,`deleteMany`.

```prisma
/// @pothos-generator option {include:["mutation"],option:{authScopes:{authenticated:true}}}
```

#### Set the fields that are allowed to be entered

`input-field {include:[...OperationNames],exclude[...OperationNames],fields:{include:[...FieldNames],exclude:[...FieldNames]}}`

#### Set the data to be interrupted in prisma data

`input-data {include:[...OperationNames],exclude[...OperationNames],data:InputData,authority:[...Authorities]}`

When authority is set, the first matching `input-data` directive is used.  
The `replace` option of builder will replace the content.

#### Interrupts where to pass to prisma; if authority is set, the first match is used

`where {include:[...OperationNames],exclude[...OperationNames],where:Where,authority:[...Authorities]}`

The `replace` option of builder will replace the content.

#### Interrupts orderBy to pass to prisma; if authority is set, the first match is used

`order {include:[...OperationNames],exclude[...OperationNames],orderBy:order,authority:[...Authorities]}`

#### Authority to execute operations

`executable {include:[...OperationNames],exclude[...OperationNames],authority:[...Authorities]}`

### Field directive

#### Field read permission

`readable [...Authorities]`

If Authorities is empty, it will be removed from the GraphQL Object and will not appear in the Query.

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
    /// @pothos-generator any {authority:["ROLE"]}
    authority: ({ context }) => context.user?.roles ?? [], // Sample assumes ["ADMIN", "USER"] is set during authentication
```
