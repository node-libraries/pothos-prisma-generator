# pothos-prisma-generator

[![](https://img.shields.io/npm/l/pothos-prisma-generator)](https://www.npmjs.com/package/pothos-prisma-generator)
[![](https://img.shields.io/npm/v/pothos-prisma-generator)](https://www.npmjs.com/package/pothos-prisma-generator)
[![](https://img.shields.io/npm/dw/pothos-prisma-generator)](https://www.npmjs.com/package/pothos-prisma-generator)
[![](https://deepwiki.com/badge.svg)](https://deepwiki.com/node-libraries/pothos-prisma-generator)

Automatic generation of GraphQL schema from Prisma schema for [Pothos GraphQL](https://pothos-graphql.dev/).

## Overview

`pothos-prisma-generator` automatically generates full-featured GraphQL queries, mutations, relation fields, and filters directly from your `schema.prisma`.

The schema is built dynamically in-memory at runtime—no need to generate and manage boilerplate resolver/type files.

### Supported Operations & Features

- **Queries**: `count<Model>`, `findUnique<Model>`, `findFirst<Model>`, `findMany<Model>`
- **Mutations**: `createOne<Model>`, `createMany<Model>`, `updateOne<Model>`, `updateMany<Model>`, `deleteOne<Model>`, `deleteMany<Model>`
- **Relations**: Automatic 1-to-1, 1-to-many relation fields, plus relation count fields (e.g., `user.posts`, `user.postsCount`)
- **Paging & Sorting**: `limit`, `offset`, and multi-field `orderBy`
- **Filtering**: Deep filtering powered by Prisma (`equals`, `contains`, `in`, `lt`, `lte`, etc.)
- **Directives**: Configure permissions, filters, defaults, and field visibility via schema comments (`/// @pothos-generator ...`)
- **Built-in Scalars**: Auto-registers `BigInt`, `DateTime`, `Json`, `Decimal`, and `Bytes` via `graphql-scalars`

---

## Installation

```bash
npm install pothos-prisma-generator
# or
pnpm add pothos-prisma-generator
# or
yarn add pothos-prisma-generator
```

### Peer Dependencies

Ensure the following packages are installed in your project:

```bash
npm install @pothos/core @pothos/plugin-prisma @pothos/plugin-prisma-utils @prisma/client graphql
```

*(Optional: `@pothos/plugin-scope-auth` if using `authScopes`)*

---

## Setup

### 1. Configure `prisma/schema.prisma`

Add the `pothosPrismaGenerator` generator to generate the runtime DMMF:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

generator pothos {
  provider          = "prisma-pothos-types"
  generateDatamodel = true
}

generator pothosPrismaGenerator {
  provider = "pothos-prisma-generator"
  output   = "./generated/prisma-dmmf.ts"
}
```

Run `prisma generate`:

```bash
npx prisma generate
```

### 2. Configure Pothos SchemaBuilder

Add `PothosPrismaGeneratorPlugin` to your `SchemaBuilder`:

```typescript
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtils from "@pothos/plugin-prisma-utils";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import PothosPrismaGeneratorPlugin from "pothos-prisma-generator";
import { PrismaClient } from "@prisma/client";
import { prismaDmmf } from "./generated/prisma-dmmf";

const prisma = new PrismaClient();

export interface Context {
  user?: {
    id: string;
    roles: string[];
  };
}

export const builder = new SchemaBuilder<{
  Context: Context;
}>({
  plugins: [
    PrismaPlugin,
    PrismaUtils,
    ScopeAuthPlugin,
    PothosPrismaGeneratorPlugin,
  ],
  prisma: {
    client: prisma,
    dmmf: prismaDmmf,
  },
  pothosPrismaGenerator: {
    // Dynamic replacement in directives (e.g. "%%USER%%" -> current user ID)
    replace: {
      "%%USER%%": ({ context }) => context.user?.id,
    },
    // User authority/roles function
    authority: ({ context }) => context.user?.roles ?? [],
    // Default includes
    defaultIncludes: {
      operations: true, // Default: true (all operations exposed unless excluded)
      fields: true,     // Default: true
    },
  },
});

export const schema = builder.toSchema();
```

---

## Directives (`@pothos-generator`)

You can control operation availability, permissions, default filters, and field accessibility directly inside `schema.prisma` using `/// @pothos-generator` documentation comments.

Directives follow the JSON5 format:
```prisma
/// @pothos-generator <directiveName> <json5Params>
```

### Supported Operation Categories

- `query`: `findUnique`, `findFirst`, `findMany`, `count`
- `find`: `findUnique`, `findFirst`, `findMany`
- `create`: `createOne`, `createMany`
- `update`: `updateOne`, `updateMany`
- `delete`: `deleteOne`, `deleteMany`
- `mutation`: All create, update, delete operations
- `all`: All queries and mutations

---

### Directive Reference

#### 1. `operation` - Filter exposed operations

Include or exclude specific GraphQL operations.

```prisma
/// Include only createOne and updateOne
/// @pothos-generator operation {include:["createOne","updateOne"]}

/// Exclude deleteMany
/// @pothos-generator operation {exclude:["deleteMany"]}
```

#### 2. `executable` - Restrict execution permissions

Enforces permissions on operations. Raises an error if the user does not possess the required authority.

```prisma
/// Mutations require USER role
/// @pothos-generator executable {include:["mutation"],authority:["USER"]}
```

#### 3. `where` - Enforce server-side filters

Automatically injects conditions into Prisma queries. If multiple directives match, the first matching directive is applied.

```prisma
/// Admins can see all, standard users see only published records
/// @pothos-generator where {include:["query"],where:{},authority:["ADMIN"]}
/// @pothos-generator where {include:["query"],where:{published:true}}

/// Users can only update or delete their own records
/// @pothos-generator where {include:["update","delete"],where:{authorId:"%%USER%%"}}
```

#### 4. `order` - Default sort order

Specifies default sorting for queries.

```prisma
/// @pothos-generator order {orderBy:{title:"asc"}}
```

#### 5. `limit` - Limit query result count

Caps the maximum number of items returned, preventing denial-of-service from unbounded queries.

```prisma
/// Cap to 50 items maximum
/// @pothos-generator limit {limit:50}
```

#### 6. `input-field` - Control allowed input fields

Controls which fields can be specified in mutation input arguments.

```prisma
/// Exclude internal fields from creation input
/// @pothos-generator input-field {fields:{exclude:["id","createdAt","updatedAt"]}}
```

#### 7. `input-data` - Auto-fill mutation data

Injects values into the data being saved. Values can use placeholders replaced by the `replace` builder option.

```prisma
/// Automatically set authorId from logged-in user
/// @pothos-generator input-data {data:{authorId:"%%USER%%"}}
```

#### 8. `option` - Pass Pothos field options

Passes custom options directly to Pothos field definitions (e.g., ScopeAuth options).

```prisma
/// @pothos-generator option {include:["mutation"],option:{authScopes:{authenticated:true}}}
```

#### 9. `readable` (Field directive) - Field visibility & access

Placed on individual model fields to restrict read access.

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique

  /// Only ADMIN can read roles
  /// @pothos-generator readable ["ADMIN"]
  roles String[]

  /// Invisible in GraphQL schema (removed completely)
  /// @pothos-generator readable []
  secretToken String
}
```

---

## Code API: Dynamic Model Extensions

You can also customize directives and add custom fields programmatically in TypeScript:

### Adding Custom Fields to a Model

```typescript
builder.addModelFields("User", {
  fullName: (t) =>
    t.string({
      resolve: (parent) => `${parent.firstName} ${parent.lastName}`,
    }),
});
```

### Adding Directives via Code

```typescript
// Restrict operations
builder.addModelOperations("User", {
  include: ["createOne", "updateOne", "findMany"],
});

// Add field directives
builder.addFieldDirectives("User", "roles", "readable", ["ADMIN"]);

// Add model options
builder.addModelOptions(
  "User",
  { include: ["mutation"] },
  { authScopes: { ADMIN: true } }
);

// Parameter interceptor callback
builder.addModelParameterCallback((params, generatorParams) => {
  if (generatorParams.modelName === "Post" && generatorParams.operationPrefix === "createOne") {
    return {
      ...params,
      input: {
        ...params.input,
        authorId: generatorParams.params.ctx.user?.id,
      },
    };
  }
  return params;
});
```

---

## Sample Projects

- [next-pothos (Next.js)](https://github.com/SoraKumo001/next-pothos) - Deployed on [Vercel](https://next-pothos.vercel.app/)
- [nest-pothos (NestJS)](https://github.com/SoraKumo001/nest-pothos) - Deployed on [Render](https://nest-pothos.onrender.com)

## License

MIT
