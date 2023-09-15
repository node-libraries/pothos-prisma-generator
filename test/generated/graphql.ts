import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** The `Byte` scalar type represents byte value as a Buffer */
  Byte: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: { input: any; output: any; }
};

export type BooleanFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilter>;
  notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<Post>;
  postsCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type CategoryPostsArgs = {
  filter?: InputMaybe<PostFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};


export type CategoryPostsCountArgs = {
  filter?: InputMaybe<CategoryFilter>;
};

export type CategoryCreateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtInput = {
  name: Scalars['String']['input'];
};

export type CategoryCreateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutPostsInput = {
  name: Scalars['String']['input'];
};

export type CategoryFilter = {
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  posts?: InputMaybe<PostListFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type CategoryListFilter = {
  every?: InputMaybe<CategoryFilter>;
  none?: InputMaybe<CategoryFilter>;
  some?: InputMaybe<CategoryFilter>;
};

export type CategoryOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  posts?: InputMaybe<PostOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type CategoryUniqueFilter = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryUpdateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryUpdateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryUpdateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutPostsInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryWithoutPostsFilter = {
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  is?: InputMaybe<Scalars['DateTime']['input']>;
  isNot?: InputMaybe<Scalars['DateTime']['input']>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createManyCategory: Scalars['Int']['output'];
  createManyPost: Scalars['Int']['output'];
  createOneCategory: Category;
  createOnePost: Post;
  createOneUser: User;
  deleteManyCategory: Scalars['Int']['output'];
  deleteOneCategory: Category;
  deleteOnePost: Post;
  updateManyCategory: Scalars['Int']['output'];
  updateManyPost: Scalars['Int']['output'];
  updateOneCategory: Category;
  updateOnePost: Post;
  updateOneUser: User;
};


export type MutationCreateManyCategoryArgs = {
  input: Array<CategoryCreateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtInput>;
};


export type MutationCreateManyPostArgs = {
  input: Array<PostCreateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput>;
};


export type MutationCreateOneCategoryArgs = {
  input: CategoryCreateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtInput;
};


export type MutationCreateOnePostArgs = {
  input: PostCreateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput;
};


export type MutationCreateOneUserArgs = {
  input: UserCreateWithoutIdWithoutPostsWithoutRolesWithoutCreatedAtWithoutUpdatedAtInput;
};


export type MutationDeleteManyCategoryArgs = {
  where: CategoryFilter;
};


export type MutationDeleteOneCategoryArgs = {
  where: CategoryUniqueFilter;
};


export type MutationDeleteOnePostArgs = {
  where: PostUniqueFilter;
};


export type MutationUpdateManyCategoryArgs = {
  data: CategoryUpdateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtInput;
  where: CategoryFilter;
};


export type MutationUpdateManyPostArgs = {
  data: PostUpdateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput;
  where: PostFilter;
};


export type MutationUpdateOneCategoryArgs = {
  data: CategoryUpdateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtInput;
  where: CategoryUniqueFilter;
};


export type MutationUpdateOnePostArgs = {
  data: PostUpdateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput;
  where: PostUniqueFilter;
};


export type MutationUpdateOneUserArgs = {
  data: UserUpdateWithoutIdWithoutEmailWithoutPostsWithoutRolesWithoutCreatedAtWithoutUpdatedAtInput;
  where: UserUniqueFilter;
};

export enum OrderBy {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['String']['output']>;
  categories: Array<Category>;
  categoriesCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  published: Scalars['Boolean']['output'];
  publishedAt: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type PostCategoriesArgs = {
  filter?: InputMaybe<CategoryFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CategoryOrderBy>>;
};


export type PostCategoriesCountArgs = {
  filter?: InputMaybe<PostFilter>;
};

export type PostCreateCategoriesRelationInput = {
  connect?: InputMaybe<Array<CategoryUniqueFilter>>;
  create?: InputMaybe<Array<CategoryCreateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutPostsInput>>;
};

export type PostCreateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput = {
  categories?: InputMaybe<PostCreateCategoriesRelationInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PostFilter = {
  author?: InputMaybe<UserFilter>;
  authorId?: InputMaybe<StringFilter>;
  categories?: InputMaybe<CategoryListFilter>;
  content?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  published?: InputMaybe<BooleanFilter>;
  publishedAt?: InputMaybe<DateTimeFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type PostListFilter = {
  every?: InputMaybe<PostFilter>;
  none?: InputMaybe<PostFilter>;
  some?: InputMaybe<PostFilter>;
};

export type PostOrderBy = {
  author?: InputMaybe<UserOrderBy>;
  authorId?: InputMaybe<OrderBy>;
  categories?: InputMaybe<CategoryOrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  published?: InputMaybe<OrderBy>;
  publishedAt?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type PostUniqueFilter = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type PostUpdateCategoriesRelationInput = {
  connect?: InputMaybe<Array<CategoryUniqueFilter>>;
  create?: InputMaybe<Array<CategoryCreateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutPostsInput>>;
  delete?: InputMaybe<Array<CategoryUniqueFilter>>;
  deleteMany?: InputMaybe<Array<CategoryWithoutPostsFilter>>;
  disconnect?: InputMaybe<Array<CategoryUniqueFilter>>;
  set?: InputMaybe<Array<CategoryUniqueFilter>>;
  update?: InputMaybe<Array<PostUpdateCategoriesRelationInputUpdate>>;
  updateMany?: InputMaybe<Array<PostUpdateCategoriesRelationInputUpdateMany>>;
};

export type PostUpdateCategoriesRelationInputUpdate = {
  data?: InputMaybe<CategoryUpdateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutPostsInput>;
  where?: InputMaybe<CategoryUniqueFilter>;
};

export type PostUpdateCategoriesRelationInputUpdateMany = {
  data?: InputMaybe<CategoryUpdateWithoutIdWithoutPostsWithoutCreatedAtWithoutUpdatedAtWithoutPostsInput>;
  where?: InputMaybe<CategoryWithoutPostsFilter>;
};

export type PostUpdateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput = {
  categories?: InputMaybe<PostUpdateCategoriesRelationInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PostUpdateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput = {
  categories?: InputMaybe<PostUpdateCategoriesRelationInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  countCategory: Scalars['Int']['output'];
  countPost: Scalars['Int']['output'];
  findFirstCategory?: Maybe<Category>;
  findFirstPost?: Maybe<Post>;
  findManyCategory: Array<Category>;
  findManyPost: Array<Post>;
  findManyUser: Array<User>;
  findUniqueCategory: Category;
  findUniquePost: Post;
};


export type QueryCountCategoryArgs = {
  filter?: InputMaybe<CategoryFilter>;
};


export type QueryCountPostArgs = {
  filter?: InputMaybe<PostFilter>;
};


export type QueryFindFirstCategoryArgs = {
  filter?: InputMaybe<CategoryFilter>;
  orderBy?: InputMaybe<Array<CategoryOrderBy>>;
};


export type QueryFindFirstPostArgs = {
  filter?: InputMaybe<PostFilter>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};


export type QueryFindManyCategoryArgs = {
  filter?: InputMaybe<CategoryFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CategoryOrderBy>>;
};


export type QueryFindManyPostArgs = {
  filter?: InputMaybe<PostFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};


export type QueryFindManyUserArgs = {
  filter?: InputMaybe<UserFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserOrderBy>>;
};


export type QueryFindUniqueCategoryArgs = {
  filter: CategoryUniqueFilter;
};


export type QueryFindUniquePostArgs = {
  filter: PostUniqueFilter;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type RoleListFilter = {
  equals?: InputMaybe<Array<Role>>;
  has?: InputMaybe<Role>;
  hasEvery?: InputMaybe<Array<Role>>;
  hasSome?: InputMaybe<Array<Role>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  is?: InputMaybe<Scalars['String']['input']>;
  isNot?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<StringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<Post>;
  postsCount: Scalars['Int']['output'];
  roles: Array<Role>;
  updatedAt: Scalars['DateTime']['output'];
};


export type UserPostsArgs = {
  filter?: InputMaybe<PostFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};


export type UserPostsCountArgs = {
  filter?: InputMaybe<UserFilter>;
};

export type UserCreateWithoutIdWithoutPostsWithoutRolesWithoutCreatedAtWithoutUpdatedAtInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UserFilter = {
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  posts?: InputMaybe<PostListFilter>;
  roles?: InputMaybe<RoleListFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UserOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  posts?: InputMaybe<PostOrderBy>;
  roles?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export type UserUniqueFilter = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type UserUpdateWithoutIdWithoutEmailWithoutPostsWithoutRolesWithoutCreatedAtWithoutUpdatedAtInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FindManyCategoryQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
  orderBy?: InputMaybe<Array<CategoryOrderBy> | CategoryOrderBy>;
  postsFilter?: InputMaybe<PostFilter>;
  postsOrderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
}>;


export type FindManyCategoryQuery = { __typename?: 'Query', findManyCategory: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string, posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, updatedAt: string, publishedAt: string, author?: { __typename?: 'User', id: string, name: string, createdAt: string, updatedAt: string } | null }> }> };

export type FindManyPostQueryVariables = Exact<{ [key: string]: never; }>;


export type FindManyPostQuery = { __typename?: 'Query', findManyPost: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string, author?: { __typename?: 'User', id: string, name: string, createdAt: string, updatedAt: string } | null, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> }> };

export type CreateOnePostMutationVariables = Exact<{
  input: PostCreateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput;
}>;


export type CreateOnePostMutation = { __typename?: 'Mutation', createOnePost: { __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string, author?: { __typename?: 'User', id: string, name: string, createdAt: string, updatedAt: string } | null, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> } };


export const FindManyCategoryDocument = gql`
    query FindManyCategory($filter: CategoryFilter, $orderBy: [CategoryOrderBy!], $postsFilter: PostFilter, $postsOrderBy: [PostOrderBy!]) {
  findManyCategory(filter: $filter, orderBy: $orderBy) {
    id
    name
    posts(filter: $postsFilter, orderBy: $postsOrderBy) {
      id
      published
      title
      content
      author {
        id
        name
        createdAt
        updatedAt
      }
      updatedAt
      publishedAt
    }
    createdAt
    updatedAt
  }
}
    `;
export const FindManyPostDocument = gql`
    query FindManyPost {
  findManyPost {
    id
    published
    title
    content
    author {
      id
      name
      createdAt
      updatedAt
    }
    authorId
    categories {
      id
      name
      createdAt
      updatedAt
    }
    updatedAt
    publishedAt
  }
}
    `;
export const CreateOnePostDocument = gql`
    mutation CreateOnePost($input: PostCreateWithoutIdWithoutAuthorWithoutCreatedAtWithoutUpdatedAtInput!) {
  createOnePost(input: $input) {
    id
    published
    title
    content
    author {
      id
      name
      createdAt
      updatedAt
    }
    authorId
    categories {
      id
      name
      createdAt
      updatedAt
    }
    updatedAt
    publishedAt
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    FindManyCategory(variables?: FindManyCategoryQueryVariables, options?: C): Promise<FindManyCategoryQuery> {
      return requester<FindManyCategoryQuery, FindManyCategoryQueryVariables>(FindManyCategoryDocument, variables, options) as Promise<FindManyCategoryQuery>;
    },
    FindManyPost(variables?: FindManyPostQueryVariables, options?: C): Promise<FindManyPostQuery> {
      return requester<FindManyPostQuery, FindManyPostQueryVariables>(FindManyPostDocument, variables, options) as Promise<FindManyPostQuery>;
    },
    CreateOnePost(variables: CreateOnePostMutationVariables, options?: C): Promise<CreateOnePostMutation> {
      return requester<CreateOnePostMutation, CreateOnePostMutationVariables>(CreateOnePostDocument, variables, options) as Promise<CreateOnePostMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;