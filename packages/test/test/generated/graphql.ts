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
  Bytes: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
  /** A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal. */
  Decimal: { input: any; output: any; }
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
  filter?: InputMaybe<PostFilter>;
};

export type CategoryCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
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

export type CategoryUpdateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  posts?: InputMaybe<CategoryUpdatePostsRelationInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CategoryUpdatePostsRelationInput = {
  connect?: InputMaybe<Array<PostUniqueFilter>>;
  create?: InputMaybe<Array<PostCreateInput>>;
  delete?: InputMaybe<Array<PostUniqueFilter>>;
  deleteMany?: InputMaybe<Array<PostWithoutCategoriesFilter>>;
  disconnect?: InputMaybe<Array<PostUniqueFilter>>;
  set?: InputMaybe<Array<PostUniqueFilter>>;
  update?: InputMaybe<Array<CategoryUpdatePostsRelationInputUpdate>>;
  updateMany?: InputMaybe<Array<CategoryUpdatePostsRelationInputUpdateMany>>;
};

export type CategoryUpdatePostsRelationInputUpdate = {
  data?: InputMaybe<PostUpdateWithoutCategoriesInput>;
  where?: InputMaybe<PostUniqueFilter>;
};

export type CategoryUpdatePostsRelationInputUpdateMany = {
  data?: InputMaybe<PostUpdateWithoutCategoriesInput>;
  where?: InputMaybe<PostWithoutCategoriesFilter>;
};

export type CategoryUpdateWithoutPostsInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
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
  createManyTypeTest: Scalars['Int']['output'];
  createManyUser: Scalars['Int']['output'];
  createOneCategory: Category;
  createOnePost: Post;
  createOneTypeTest: TypeTest;
  createOneUser: User;
  deleteManyCategory: Scalars['Int']['output'];
  deleteManyPost: Scalars['Int']['output'];
  deleteManyTypeTest: Scalars['Int']['output'];
  deleteManyUser: Scalars['Int']['output'];
  deleteOneCategory: Category;
  deleteOnePost: Post;
  deleteOneTypeTest: TypeTest;
  deleteOneUser: User;
  updateManyCategory: Scalars['Int']['output'];
  updateManyPost: Scalars['Int']['output'];
  updateManyTypeTest: Scalars['Int']['output'];
  updateManyUser: Scalars['Int']['output'];
  updateOneCategory: Category;
  updateOnePost: Post;
  updateOneTypeTest: TypeTest;
  updateOneUser: User;
};


export type MutationCreateManyCategoryArgs = {
  input: Array<CategoryCreateInput>;
};


export type MutationCreateManyPostArgs = {
  input: Array<PostCreateInput>;
};


export type MutationCreateManyTypeTestArgs = {
  input: Array<TypeTestCreateInput>;
};


export type MutationCreateManyUserArgs = {
  input: Array<UserCreateInput>;
};


export type MutationCreateOneCategoryArgs = {
  input: CategoryCreateInput;
};


export type MutationCreateOnePostArgs = {
  input: PostCreateInput;
};


export type MutationCreateOneTypeTestArgs = {
  input: TypeTestCreateInput;
};


export type MutationCreateOneUserArgs = {
  input: UserCreateInput;
};


export type MutationDeleteManyCategoryArgs = {
  where: CategoryFilter;
};


export type MutationDeleteManyPostArgs = {
  where: PostFilter;
};


export type MutationDeleteManyTypeTestArgs = {
  where: TypeTestFilter;
};


export type MutationDeleteManyUserArgs = {
  where: UserFilter;
};


export type MutationDeleteOneCategoryArgs = {
  where: CategoryUniqueFilter;
};


export type MutationDeleteOnePostArgs = {
  where: PostUniqueFilter;
};


export type MutationDeleteOneTypeTestArgs = {
  where: TypeTestUniqueFilter;
};


export type MutationDeleteOneUserArgs = {
  where: UserUniqueFilter;
};


export type MutationUpdateManyCategoryArgs = {
  data: CategoryUpdateInput;
  where: CategoryFilter;
};


export type MutationUpdateManyPostArgs = {
  data: PostUpdateInput;
  where: PostFilter;
};


export type MutationUpdateManyTypeTestArgs = {
  data: TypeTestUpdateInput;
  where: TypeTestFilter;
};


export type MutationUpdateManyUserArgs = {
  data: UserUpdateInput;
  where: UserFilter;
};


export type MutationUpdateOneCategoryArgs = {
  data: CategoryUpdateInput;
  where: CategoryUniqueFilter;
};


export type MutationUpdateOnePostArgs = {
  data: PostUpdateInput;
  where: PostUniqueFilter;
};


export type MutationUpdateOneTypeTestArgs = {
  data: TypeTestUpdateInput;
  where: TypeTestUniqueFilter;
};


export type MutationUpdateOneUserArgs = {
  data: UserUpdateInput;
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
  createdAt: Scalars['DateTime']['output'];
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
  filter?: InputMaybe<CategoryFilter>;
};

export type PostCreateCategoriesRelationInput = {
  connect?: InputMaybe<Array<CategoryUniqueFilter>>;
  create?: InputMaybe<Array<CategoryCreateInput>>;
};

export type PostCreateInput = {
  categories?: InputMaybe<PostCreateCategoriesRelationInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
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

export type PostUpdateAuthorRelationInput = {
  connect?: InputMaybe<UserUniqueFilter>;
  create?: InputMaybe<UserCreateInput>;
  delete?: InputMaybe<Scalars['Boolean']['input']>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
  update?: InputMaybe<UserUpdateWithoutPostsInput>;
};

export type PostUpdateCategoriesRelationInput = {
  connect?: InputMaybe<Array<CategoryUniqueFilter>>;
  create?: InputMaybe<Array<CategoryCreateInput>>;
  delete?: InputMaybe<Array<CategoryUniqueFilter>>;
  deleteMany?: InputMaybe<Array<CategoryWithoutPostsFilter>>;
  disconnect?: InputMaybe<Array<CategoryUniqueFilter>>;
  set?: InputMaybe<Array<CategoryUniqueFilter>>;
  update?: InputMaybe<Array<PostUpdateCategoriesRelationInputUpdate>>;
  updateMany?: InputMaybe<Array<PostUpdateCategoriesRelationInputUpdateMany>>;
};

export type PostUpdateCategoriesRelationInputUpdate = {
  data?: InputMaybe<CategoryUpdateWithoutPostsInput>;
  where?: InputMaybe<CategoryUniqueFilter>;
};

export type PostUpdateCategoriesRelationInputUpdateMany = {
  data?: InputMaybe<CategoryUpdateWithoutPostsInput>;
  where?: InputMaybe<CategoryWithoutPostsFilter>;
};

export type PostUpdateInput = {
  author?: InputMaybe<PostUpdateAuthorRelationInput>;
  categories?: InputMaybe<PostUpdateCategoriesRelationInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PostUpdateWithoutAuthorInput = {
  categories?: InputMaybe<PostUpdateCategoriesRelationInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PostUpdateWithoutCategoriesInput = {
  author?: InputMaybe<PostUpdateAuthorRelationInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PostWithoutAuthorFilter = {
  categories?: InputMaybe<CategoryListFilter>;
  content?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  published?: InputMaybe<BooleanFilter>;
  publishedAt?: InputMaybe<DateTimeFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type PostWithoutCategoriesFilter = {
  author?: InputMaybe<UserFilter>;
  authorId?: InputMaybe<StringFilter>;
  content?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  published?: InputMaybe<BooleanFilter>;
  publishedAt?: InputMaybe<DateTimeFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type Query = {
  __typename?: 'Query';
  countCategory: Scalars['Int']['output'];
  countPost: Scalars['Int']['output'];
  countTypeTest: Scalars['Int']['output'];
  countUser: Scalars['Int']['output'];
  findFirstCategory?: Maybe<Category>;
  findFirstPost?: Maybe<Post>;
  findFirstTypeTest?: Maybe<TypeTest>;
  findFirstUser?: Maybe<User>;
  findManyCategory: Array<Category>;
  findManyPost: Array<Post>;
  findManyTypeTest: Array<TypeTest>;
  findManyUser: Array<User>;
  findUniqueCategory: Category;
  findUniquePost: Post;
  findUniqueTypeTest: TypeTest;
  findUniqueUser: User;
};


export type QueryCountCategoryArgs = {
  filter?: InputMaybe<CategoryFilter>;
};


export type QueryCountPostArgs = {
  filter?: InputMaybe<PostFilter>;
};


export type QueryCountTypeTestArgs = {
  filter?: InputMaybe<TypeTestFilter>;
};


export type QueryCountUserArgs = {
  filter?: InputMaybe<UserFilter>;
};


export type QueryFindFirstCategoryArgs = {
  filter?: InputMaybe<CategoryFilter>;
  orderBy?: InputMaybe<Array<CategoryOrderBy>>;
};


export type QueryFindFirstPostArgs = {
  filter?: InputMaybe<PostFilter>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};


export type QueryFindFirstTypeTestArgs = {
  filter?: InputMaybe<TypeTestFilter>;
  orderBy?: InputMaybe<Array<TypeTestOrderBy>>;
};


export type QueryFindFirstUserArgs = {
  filter?: InputMaybe<UserFilter>;
  orderBy?: InputMaybe<Array<UserOrderBy>>;
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


export type QueryFindManyTypeTestArgs = {
  filter?: InputMaybe<TypeTestFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TypeTestOrderBy>>;
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


export type QueryFindUniqueTypeTestArgs = {
  filter: TypeTestUniqueFilter;
};


export type QueryFindUniqueUserArgs = {
  filter: UserUniqueFilter;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type RoleFilter = {
  equals?: InputMaybe<Role>;
  in?: InputMaybe<Array<Role>>;
  is?: InputMaybe<Role>;
  isNot?: InputMaybe<Role>;
  not?: InputMaybe<RoleFilter>;
  notIn?: InputMaybe<Array<Role>>;
};

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

export type StringListFilter = {
  equals?: InputMaybe<Array<Scalars['String']['input']>>;
  has?: InputMaybe<Scalars['String']['input']>;
  hasEvery?: InputMaybe<Array<Scalars['String']['input']>>;
  hasSome?: InputMaybe<Array<Scalars['String']['input']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TypeTest = {
  __typename?: 'TypeTest';
  id: Scalars['ID']['output'];
  role: Role;
  scalarList: Scalars['String']['output'];
};

export type TypeTestCreateInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  role: Role;
  scalarList?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type TypeTestFilter = {
  id?: InputMaybe<StringFilter>;
  role?: InputMaybe<RoleFilter>;
  scalarList?: InputMaybe<StringListFilter>;
};

export type TypeTestOrderBy = {
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  scalarList?: InputMaybe<OrderBy>;
};

export type TypeTestUniqueFilter = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type TypeTestUpdateInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  scalarList?: InputMaybe<Array<Scalars['String']['input']>>;
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
  filter?: InputMaybe<PostFilter>;
};

export type UserCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  posts?: InputMaybe<UserCreatePostsRelationInput>;
  roles?: InputMaybe<Array<Role>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreatePostsRelationInput = {
  connect?: InputMaybe<Array<PostUniqueFilter>>;
  create?: InputMaybe<Array<PostCreateInput>>;
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

export type UserUpdateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  posts?: InputMaybe<UserUpdatePostsRelationInput>;
  roles?: InputMaybe<Array<Role>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserUpdatePostsRelationInput = {
  connect?: InputMaybe<Array<PostUniqueFilter>>;
  create?: InputMaybe<Array<PostCreateInput>>;
  delete?: InputMaybe<Array<PostUniqueFilter>>;
  deleteMany?: InputMaybe<Array<PostWithoutAuthorFilter>>;
  disconnect?: InputMaybe<Array<PostUniqueFilter>>;
  set?: InputMaybe<Array<PostUniqueFilter>>;
  update?: InputMaybe<Array<UserUpdatePostsRelationInputUpdate>>;
  updateMany?: InputMaybe<Array<UserUpdatePostsRelationInputUpdateMany>>;
};

export type UserUpdatePostsRelationInputUpdate = {
  data?: InputMaybe<PostUpdateWithoutAuthorInput>;
  where?: InputMaybe<PostUniqueFilter>;
};

export type UserUpdatePostsRelationInputUpdateMany = {
  data?: InputMaybe<PostUpdateWithoutAuthorInput>;
  where?: InputMaybe<PostWithoutAuthorFilter>;
};

export type UserUpdateWithoutPostsInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Role>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserFragment = { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string };

export type CategoryFragment = { __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string };

export type PostFragment = { __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string };

export type CountUserQueryVariables = Exact<{
  filter?: InputMaybe<UserFilter>;
}>;


export type CountUserQuery = { __typename?: 'Query', countUser: number };

export type CountPostQueryVariables = Exact<{
  filter?: InputMaybe<PostFilter>;
}>;


export type CountPostQuery = { __typename?: 'Query', countPost: number };

export type CountCategoryQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
}>;


export type CountCategoryQuery = { __typename?: 'Query', countCategory: number };

export type FindUniqueUserQueryVariables = Exact<{
  filter: UserUniqueFilter;
  postFilter?: InputMaybe<PostFilter>;
  postOrderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  postLimit?: InputMaybe<Scalars['Int']['input']>;
  postOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindUniqueUserQuery = { __typename?: 'Query', findUniqueUser: { __typename?: 'User', postsCount: number, id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string, posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string }> } };

export type FindUniquePostQueryVariables = Exact<{
  filter: PostUniqueFilter;
  categoryFilter?: InputMaybe<CategoryFilter>;
  categoryOrderBy?: InputMaybe<Array<CategoryOrderBy> | CategoryOrderBy>;
  categoryLimit?: InputMaybe<Scalars['Int']['input']>;
  categoryOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindUniquePostQuery = { __typename?: 'Query', findUniquePost: { __typename?: 'Post', categoriesCount: number, id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string, author?: { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> } };

export type FindUniqueCategoryQueryVariables = Exact<{
  filter: CategoryUniqueFilter;
  postFilter?: InputMaybe<PostFilter>;
  postOrderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  postLimit?: InputMaybe<Scalars['Int']['input']>;
  postOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindUniqueCategoryQuery = { __typename?: 'Query', findUniqueCategory: { __typename?: 'Category', postsCount: number, id: string, name: string, createdAt: string, updatedAt: string, posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string }> } };

export type FindFirstUserQueryVariables = Exact<{
  filter?: InputMaybe<UserFilter>;
  orderBy?: InputMaybe<Array<UserOrderBy> | UserOrderBy>;
  postFilter?: InputMaybe<PostFilter>;
  postOrderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  postLimit?: InputMaybe<Scalars['Int']['input']>;
  postOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindFirstUserQuery = { __typename?: 'Query', findFirstUser?: { __typename?: 'User', postsCount: number, id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string, posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string }> } | null };

export type FindFirstPostQueryVariables = Exact<{
  filter?: InputMaybe<PostFilter>;
  orderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  categoryFilter?: InputMaybe<CategoryFilter>;
  categoryOrderBy?: InputMaybe<Array<CategoryOrderBy> | CategoryOrderBy>;
  categoryLimit?: InputMaybe<Scalars['Int']['input']>;
  categoryOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindFirstPostQuery = { __typename?: 'Query', findFirstPost?: { __typename?: 'Post', categoriesCount: number, id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string, author?: { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> } | null };

export type FindFirstCategoryQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
  orderBy?: InputMaybe<Array<CategoryOrderBy> | CategoryOrderBy>;
  postFilter?: InputMaybe<PostFilter>;
  postOrderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  postLimit?: InputMaybe<Scalars['Int']['input']>;
  postOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindFirstCategoryQuery = { __typename?: 'Query', findFirstCategory?: { __typename?: 'Category', postsCount: number, id: string, name: string, createdAt: string, updatedAt: string, posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string }> } | null };

export type FindManyUserQueryVariables = Exact<{
  filter?: InputMaybe<UserFilter>;
  orderBy?: InputMaybe<Array<UserOrderBy> | UserOrderBy>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  postFilter?: InputMaybe<PostFilter>;
  postOrderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  postLimit?: InputMaybe<Scalars['Int']['input']>;
  postOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindManyUserQuery = { __typename?: 'Query', findManyUser: Array<{ __typename?: 'User', postsCount: number, id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string, posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string, author?: { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null }> }> };

export type FindManyPostQueryVariables = Exact<{
  filter?: InputMaybe<PostFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  categoryFilter?: InputMaybe<CategoryFilter>;
  categoryOrderBy?: InputMaybe<Array<CategoryOrderBy> | CategoryOrderBy>;
  categoryLimit?: InputMaybe<Scalars['Int']['input']>;
  categoryOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindManyPostQuery = { __typename?: 'Query', findManyPost: Array<{ __typename?: 'Post', categoriesCount: number, id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string, author?: { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null, categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string }> }> };

export type FindManyCategoryQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
  orderBy?: InputMaybe<Array<CategoryOrderBy> | CategoryOrderBy>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  postFilter?: InputMaybe<PostFilter>;
  postOrderBy?: InputMaybe<Array<PostOrderBy> | PostOrderBy>;
  postLimit?: InputMaybe<Scalars['Int']['input']>;
  postOffset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindManyCategoryQuery = { __typename?: 'Query', findManyCategory: Array<{ __typename?: 'Category', postsCount: number, id: string, name: string, createdAt: string, updatedAt: string, posts: Array<{ __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string }> }> };

export type CreateOneUserMutationVariables = Exact<{
  input: UserCreateInput;
}>;


export type CreateOneUserMutation = { __typename?: 'Mutation', createOneUser: { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } };

export type CreateOnePostMutationVariables = Exact<{
  input: PostCreateInput;
}>;


export type CreateOnePostMutation = { __typename?: 'Mutation', createOnePost: { __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string } };

export type CreateOneCategoryMutationVariables = Exact<{
  input: CategoryCreateInput;
}>;


export type CreateOneCategoryMutation = { __typename?: 'Mutation', createOneCategory: { __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string } };

export type CreateManyUserMutationVariables = Exact<{
  input: Array<UserCreateInput> | UserCreateInput;
}>;


export type CreateManyUserMutation = { __typename?: 'Mutation', createManyUser: number };

export type CreateManyPostMutationVariables = Exact<{
  input: Array<PostCreateInput> | PostCreateInput;
}>;


export type CreateManyPostMutation = { __typename?: 'Mutation', createManyPost: number };

export type CreateManyCategoryMutationVariables = Exact<{
  input: Array<CategoryCreateInput> | CategoryCreateInput;
}>;


export type CreateManyCategoryMutation = { __typename?: 'Mutation', createManyCategory: number };

export type UpdateOneUserMutationVariables = Exact<{
  where: UserUniqueFilter;
  data: UserUpdateInput;
}>;


export type UpdateOneUserMutation = { __typename?: 'Mutation', updateOneUser: { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } };

export type UpdateOnePostMutationVariables = Exact<{
  where: PostUniqueFilter;
  data: PostUpdateInput;
}>;


export type UpdateOnePostMutation = { __typename?: 'Mutation', updateOnePost: { __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string } };

export type UpdateOneCategoryMutationVariables = Exact<{
  where: CategoryUniqueFilter;
  data: CategoryUpdateInput;
}>;


export type UpdateOneCategoryMutation = { __typename?: 'Mutation', updateOneCategory: { __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string } };

export type UpdateManyUserMutationVariables = Exact<{
  where: UserFilter;
  data: UserUpdateInput;
}>;


export type UpdateManyUserMutation = { __typename?: 'Mutation', updateManyUser: number };

export type UpdateManyPostMutationVariables = Exact<{
  where: PostFilter;
  data: PostUpdateInput;
}>;


export type UpdateManyPostMutation = { __typename?: 'Mutation', updateManyPost: number };

export type UpdateManyCategoryMutationVariables = Exact<{
  where: CategoryFilter;
  data: CategoryUpdateInput;
}>;


export type UpdateManyCategoryMutation = { __typename?: 'Mutation', updateManyCategory: number };

export type DeleteOneUserMutationVariables = Exact<{
  where: UserUniqueFilter;
}>;


export type DeleteOneUserMutation = { __typename?: 'Mutation', deleteOneUser: { __typename?: 'User', id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } };

export type DeleteOnePostMutationVariables = Exact<{
  where: PostUniqueFilter;
}>;


export type DeleteOnePostMutation = { __typename?: 'Mutation', deleteOnePost: { __typename?: 'Post', id: string, published: boolean, title: string, content: string, authorId?: string | null, updatedAt: string, publishedAt: string } };

export type DeleteOneCategoryMutationVariables = Exact<{
  where: CategoryUniqueFilter;
}>;


export type DeleteOneCategoryMutation = { __typename?: 'Mutation', deleteOneCategory: { __typename?: 'Category', id: string, name: string, createdAt: string, updatedAt: string } };

export type DeleteManyUserMutationVariables = Exact<{
  where: UserFilter;
}>;


export type DeleteManyUserMutation = { __typename?: 'Mutation', deleteManyUser: number };

export type DeleteManyPostMutationVariables = Exact<{
  where: PostFilter;
}>;


export type DeleteManyPostMutation = { __typename?: 'Mutation', deleteManyPost: number };

export type DeleteManyCategoryMutationVariables = Exact<{
  where: CategoryFilter;
}>;


export type DeleteManyCategoryMutation = { __typename?: 'Mutation', deleteManyCategory: number };

export const UserFragmentDoc = gql`
    fragment user on User {
  id
  email
  name
  roles
  createdAt
  updatedAt
}
    `;
export const CategoryFragmentDoc = gql`
    fragment category on Category {
  id
  name
  createdAt
  updatedAt
}
    `;
export const PostFragmentDoc = gql`
    fragment post on Post {
  id
  published
  title
  content
  authorId
  updatedAt
  publishedAt
}
    `;
export const CountUserDocument = gql`
    query CountUser($filter: UserFilter) {
  countUser(filter: $filter)
}
    `;
export const CountPostDocument = gql`
    query CountPost($filter: PostFilter) {
  countPost(filter: $filter)
}
    `;
export const CountCategoryDocument = gql`
    query CountCategory($filter: CategoryFilter) {
  countCategory(filter: $filter)
}
    `;
export const FindUniqueUserDocument = gql`
    query FindUniqueUser($filter: UserUniqueFilter!, $postFilter: PostFilter, $postOrderBy: [PostOrderBy!], $postLimit: Int, $postOffset: Int) {
  findUniqueUser(filter: $filter) {
    ...user
    posts(
      filter: $postFilter
      orderBy: $postOrderBy
      limit: $postLimit
      offset: $postOffset
    ) {
      ...post
    }
    postsCount(filter: $postFilter)
  }
}
    ${UserFragmentDoc}
${PostFragmentDoc}`;
export const FindUniquePostDocument = gql`
    query FindUniquePost($filter: PostUniqueFilter!, $categoryFilter: CategoryFilter, $categoryOrderBy: [CategoryOrderBy!], $categoryLimit: Int, $categoryOffset: Int) {
  findUniquePost(filter: $filter) {
    ...post
    author {
      ...user
    }
    categories(
      filter: $categoryFilter
      orderBy: $categoryOrderBy
      limit: $categoryLimit
      offset: $categoryOffset
    ) {
      ...category
    }
    categoriesCount(filter: $categoryFilter)
  }
}
    ${PostFragmentDoc}
${UserFragmentDoc}
${CategoryFragmentDoc}`;
export const FindUniqueCategoryDocument = gql`
    query FindUniqueCategory($filter: CategoryUniqueFilter!, $postFilter: PostFilter, $postOrderBy: [PostOrderBy!], $postLimit: Int, $postOffset: Int) {
  findUniqueCategory(filter: $filter) {
    ...category
    posts(
      filter: $postFilter
      orderBy: $postOrderBy
      limit: $postLimit
      offset: $postOffset
    ) {
      ...post
    }
    postsCount(filter: $postFilter)
  }
}
    ${CategoryFragmentDoc}
${PostFragmentDoc}`;
export const FindFirstUserDocument = gql`
    query FindFirstUser($filter: UserFilter, $orderBy: [UserOrderBy!], $postFilter: PostFilter, $postOrderBy: [PostOrderBy!], $postLimit: Int, $postOffset: Int) {
  findFirstUser(filter: $filter, orderBy: $orderBy) {
    ...user
    posts(
      filter: $postFilter
      orderBy: $postOrderBy
      limit: $postLimit
      offset: $postOffset
    ) {
      ...post
    }
    postsCount(filter: $postFilter)
  }
}
    ${UserFragmentDoc}
${PostFragmentDoc}`;
export const FindFirstPostDocument = gql`
    query FindFirstPost($filter: PostFilter, $orderBy: [PostOrderBy!], $categoryFilter: CategoryFilter, $categoryOrderBy: [CategoryOrderBy!], $categoryLimit: Int, $categoryOffset: Int) {
  findFirstPost(filter: $filter, orderBy: $orderBy) {
    ...post
    author {
      ...user
    }
    categories(
      filter: $categoryFilter
      orderBy: $categoryOrderBy
      limit: $categoryLimit
      offset: $categoryOffset
    ) {
      ...category
    }
    categoriesCount(filter: $categoryFilter)
  }
}
    ${PostFragmentDoc}
${UserFragmentDoc}
${CategoryFragmentDoc}`;
export const FindFirstCategoryDocument = gql`
    query FindFirstCategory($filter: CategoryFilter, $orderBy: [CategoryOrderBy!], $postFilter: PostFilter, $postOrderBy: [PostOrderBy!], $postLimit: Int, $postOffset: Int) {
  findFirstCategory(filter: $filter, orderBy: $orderBy) {
    ...category
    posts(
      filter: $postFilter
      orderBy: $postOrderBy
      limit: $postLimit
      offset: $postOffset
    ) {
      ...post
    }
    postsCount(filter: $postFilter)
  }
}
    ${CategoryFragmentDoc}
${PostFragmentDoc}`;
export const FindManyUserDocument = gql`
    query FindManyUser($filter: UserFilter, $orderBy: [UserOrderBy!], $limit: Int, $offset: Int, $postFilter: PostFilter, $postOrderBy: [PostOrderBy!], $postLimit: Int, $postOffset: Int) {
  findManyUser(filter: $filter, orderBy: $orderBy, limit: $limit, offset: $offset) {
    ...user
    posts(
      filter: $postFilter
      orderBy: $postOrderBy
      limit: $postLimit
      offset: $postOffset
    ) {
      ...post
      author {
        ...user
      }
    }
    postsCount(filter: $postFilter)
  }
}
    ${UserFragmentDoc}
${PostFragmentDoc}`;
export const FindManyPostDocument = gql`
    query FindManyPost($filter: PostFilter, $limit: Int, $offset: Int, $orderBy: [PostOrderBy!], $categoryFilter: CategoryFilter, $categoryOrderBy: [CategoryOrderBy!], $categoryLimit: Int, $categoryOffset: Int) {
  findManyPost(filter: $filter, orderBy: $orderBy, limit: $limit, offset: $offset) {
    ...post
    author {
      ...user
    }
    categories(
      filter: $categoryFilter
      orderBy: $categoryOrderBy
      limit: $categoryLimit
      offset: $categoryOffset
    ) {
      ...category
    }
    categoriesCount(filter: $categoryFilter)
  }
}
    ${PostFragmentDoc}
${UserFragmentDoc}
${CategoryFragmentDoc}`;
export const FindManyCategoryDocument = gql`
    query FindManyCategory($filter: CategoryFilter, $orderBy: [CategoryOrderBy!], $limit: Int, $offset: Int, $postFilter: PostFilter, $postOrderBy: [PostOrderBy!], $postLimit: Int, $postOffset: Int) {
  findManyCategory(
    filter: $filter
    orderBy: $orderBy
    limit: $limit
    offset: $offset
  ) {
    ...category
    posts(
      filter: $postFilter
      orderBy: $postOrderBy
      limit: $postLimit
      offset: $postOffset
    ) {
      ...post
    }
    postsCount(filter: $postFilter)
  }
}
    ${CategoryFragmentDoc}
${PostFragmentDoc}`;
export const CreateOneUserDocument = gql`
    mutation CreateOneUser($input: UserCreateInput!) {
  createOneUser(input: $input) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export const CreateOnePostDocument = gql`
    mutation CreateOnePost($input: PostCreateInput!) {
  createOnePost(input: $input) {
    ...post
  }
}
    ${PostFragmentDoc}`;
export const CreateOneCategoryDocument = gql`
    mutation CreateOneCategory($input: CategoryCreateInput!) {
  createOneCategory(input: $input) {
    ...category
  }
}
    ${CategoryFragmentDoc}`;
export const CreateManyUserDocument = gql`
    mutation CreateManyUser($input: [UserCreateInput!]!) {
  createManyUser(input: $input)
}
    `;
export const CreateManyPostDocument = gql`
    mutation CreateManyPost($input: [PostCreateInput!]!) {
  createManyPost(input: $input)
}
    `;
export const CreateManyCategoryDocument = gql`
    mutation CreateManyCategory($input: [CategoryCreateInput!]!) {
  createManyCategory(input: $input)
}
    `;
export const UpdateOneUserDocument = gql`
    mutation UpdateOneUser($where: UserUniqueFilter!, $data: UserUpdateInput!) {
  updateOneUser(where: $where, data: $data) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export const UpdateOnePostDocument = gql`
    mutation UpdateOnePost($where: PostUniqueFilter!, $data: PostUpdateInput!) {
  updateOnePost(where: $where, data: $data) {
    ...post
  }
}
    ${PostFragmentDoc}`;
export const UpdateOneCategoryDocument = gql`
    mutation UpdateOneCategory($where: CategoryUniqueFilter!, $data: CategoryUpdateInput!) {
  updateOneCategory(where: $where, data: $data) {
    ...category
  }
}
    ${CategoryFragmentDoc}`;
export const UpdateManyUserDocument = gql`
    mutation UpdateManyUser($where: UserFilter!, $data: UserUpdateInput!) {
  updateManyUser(where: $where, data: $data)
}
    `;
export const UpdateManyPostDocument = gql`
    mutation UpdateManyPost($where: PostFilter!, $data: PostUpdateInput!) {
  updateManyPost(where: $where, data: $data)
}
    `;
export const UpdateManyCategoryDocument = gql`
    mutation UpdateManyCategory($where: CategoryFilter!, $data: CategoryUpdateInput!) {
  updateManyCategory(where: $where, data: $data)
}
    `;
export const DeleteOneUserDocument = gql`
    mutation DeleteOneUser($where: UserUniqueFilter!) {
  deleteOneUser(where: $where) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export const DeleteOnePostDocument = gql`
    mutation DeleteOnePost($where: PostUniqueFilter!) {
  deleteOnePost(where: $where) {
    ...post
  }
}
    ${PostFragmentDoc}`;
export const DeleteOneCategoryDocument = gql`
    mutation DeleteOneCategory($where: CategoryUniqueFilter!) {
  deleteOneCategory(where: $where) {
    ...category
  }
}
    ${CategoryFragmentDoc}`;
export const DeleteManyUserDocument = gql`
    mutation DeleteManyUser($where: UserFilter!) {
  deleteManyUser(where: $where)
}
    `;
export const DeleteManyPostDocument = gql`
    mutation DeleteManyPost($where: PostFilter!) {
  deleteManyPost(where: $where)
}
    `;
export const DeleteManyCategoryDocument = gql`
    mutation DeleteManyCategory($where: CategoryFilter!) {
  deleteManyCategory(where: $where)
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    CountUser(variables?: CountUserQueryVariables, options?: C): Promise<CountUserQuery> {
      return requester<CountUserQuery, CountUserQueryVariables>(CountUserDocument, variables, options) as Promise<CountUserQuery>;
    },
    CountPost(variables?: CountPostQueryVariables, options?: C): Promise<CountPostQuery> {
      return requester<CountPostQuery, CountPostQueryVariables>(CountPostDocument, variables, options) as Promise<CountPostQuery>;
    },
    CountCategory(variables?: CountCategoryQueryVariables, options?: C): Promise<CountCategoryQuery> {
      return requester<CountCategoryQuery, CountCategoryQueryVariables>(CountCategoryDocument, variables, options) as Promise<CountCategoryQuery>;
    },
    FindUniqueUser(variables: FindUniqueUserQueryVariables, options?: C): Promise<FindUniqueUserQuery> {
      return requester<FindUniqueUserQuery, FindUniqueUserQueryVariables>(FindUniqueUserDocument, variables, options) as Promise<FindUniqueUserQuery>;
    },
    FindUniquePost(variables: FindUniquePostQueryVariables, options?: C): Promise<FindUniquePostQuery> {
      return requester<FindUniquePostQuery, FindUniquePostQueryVariables>(FindUniquePostDocument, variables, options) as Promise<FindUniquePostQuery>;
    },
    FindUniqueCategory(variables: FindUniqueCategoryQueryVariables, options?: C): Promise<FindUniqueCategoryQuery> {
      return requester<FindUniqueCategoryQuery, FindUniqueCategoryQueryVariables>(FindUniqueCategoryDocument, variables, options) as Promise<FindUniqueCategoryQuery>;
    },
    FindFirstUser(variables?: FindFirstUserQueryVariables, options?: C): Promise<FindFirstUserQuery> {
      return requester<FindFirstUserQuery, FindFirstUserQueryVariables>(FindFirstUserDocument, variables, options) as Promise<FindFirstUserQuery>;
    },
    FindFirstPost(variables?: FindFirstPostQueryVariables, options?: C): Promise<FindFirstPostQuery> {
      return requester<FindFirstPostQuery, FindFirstPostQueryVariables>(FindFirstPostDocument, variables, options) as Promise<FindFirstPostQuery>;
    },
    FindFirstCategory(variables?: FindFirstCategoryQueryVariables, options?: C): Promise<FindFirstCategoryQuery> {
      return requester<FindFirstCategoryQuery, FindFirstCategoryQueryVariables>(FindFirstCategoryDocument, variables, options) as Promise<FindFirstCategoryQuery>;
    },
    FindManyUser(variables?: FindManyUserQueryVariables, options?: C): Promise<FindManyUserQuery> {
      return requester<FindManyUserQuery, FindManyUserQueryVariables>(FindManyUserDocument, variables, options) as Promise<FindManyUserQuery>;
    },
    FindManyPost(variables?: FindManyPostQueryVariables, options?: C): Promise<FindManyPostQuery> {
      return requester<FindManyPostQuery, FindManyPostQueryVariables>(FindManyPostDocument, variables, options) as Promise<FindManyPostQuery>;
    },
    FindManyCategory(variables?: FindManyCategoryQueryVariables, options?: C): Promise<FindManyCategoryQuery> {
      return requester<FindManyCategoryQuery, FindManyCategoryQueryVariables>(FindManyCategoryDocument, variables, options) as Promise<FindManyCategoryQuery>;
    },
    CreateOneUser(variables: CreateOneUserMutationVariables, options?: C): Promise<CreateOneUserMutation> {
      return requester<CreateOneUserMutation, CreateOneUserMutationVariables>(CreateOneUserDocument, variables, options) as Promise<CreateOneUserMutation>;
    },
    CreateOnePost(variables: CreateOnePostMutationVariables, options?: C): Promise<CreateOnePostMutation> {
      return requester<CreateOnePostMutation, CreateOnePostMutationVariables>(CreateOnePostDocument, variables, options) as Promise<CreateOnePostMutation>;
    },
    CreateOneCategory(variables: CreateOneCategoryMutationVariables, options?: C): Promise<CreateOneCategoryMutation> {
      return requester<CreateOneCategoryMutation, CreateOneCategoryMutationVariables>(CreateOneCategoryDocument, variables, options) as Promise<CreateOneCategoryMutation>;
    },
    CreateManyUser(variables: CreateManyUserMutationVariables, options?: C): Promise<CreateManyUserMutation> {
      return requester<CreateManyUserMutation, CreateManyUserMutationVariables>(CreateManyUserDocument, variables, options) as Promise<CreateManyUserMutation>;
    },
    CreateManyPost(variables: CreateManyPostMutationVariables, options?: C): Promise<CreateManyPostMutation> {
      return requester<CreateManyPostMutation, CreateManyPostMutationVariables>(CreateManyPostDocument, variables, options) as Promise<CreateManyPostMutation>;
    },
    CreateManyCategory(variables: CreateManyCategoryMutationVariables, options?: C): Promise<CreateManyCategoryMutation> {
      return requester<CreateManyCategoryMutation, CreateManyCategoryMutationVariables>(CreateManyCategoryDocument, variables, options) as Promise<CreateManyCategoryMutation>;
    },
    UpdateOneUser(variables: UpdateOneUserMutationVariables, options?: C): Promise<UpdateOneUserMutation> {
      return requester<UpdateOneUserMutation, UpdateOneUserMutationVariables>(UpdateOneUserDocument, variables, options) as Promise<UpdateOneUserMutation>;
    },
    UpdateOnePost(variables: UpdateOnePostMutationVariables, options?: C): Promise<UpdateOnePostMutation> {
      return requester<UpdateOnePostMutation, UpdateOnePostMutationVariables>(UpdateOnePostDocument, variables, options) as Promise<UpdateOnePostMutation>;
    },
    UpdateOneCategory(variables: UpdateOneCategoryMutationVariables, options?: C): Promise<UpdateOneCategoryMutation> {
      return requester<UpdateOneCategoryMutation, UpdateOneCategoryMutationVariables>(UpdateOneCategoryDocument, variables, options) as Promise<UpdateOneCategoryMutation>;
    },
    UpdateManyUser(variables: UpdateManyUserMutationVariables, options?: C): Promise<UpdateManyUserMutation> {
      return requester<UpdateManyUserMutation, UpdateManyUserMutationVariables>(UpdateManyUserDocument, variables, options) as Promise<UpdateManyUserMutation>;
    },
    UpdateManyPost(variables: UpdateManyPostMutationVariables, options?: C): Promise<UpdateManyPostMutation> {
      return requester<UpdateManyPostMutation, UpdateManyPostMutationVariables>(UpdateManyPostDocument, variables, options) as Promise<UpdateManyPostMutation>;
    },
    UpdateManyCategory(variables: UpdateManyCategoryMutationVariables, options?: C): Promise<UpdateManyCategoryMutation> {
      return requester<UpdateManyCategoryMutation, UpdateManyCategoryMutationVariables>(UpdateManyCategoryDocument, variables, options) as Promise<UpdateManyCategoryMutation>;
    },
    DeleteOneUser(variables: DeleteOneUserMutationVariables, options?: C): Promise<DeleteOneUserMutation> {
      return requester<DeleteOneUserMutation, DeleteOneUserMutationVariables>(DeleteOneUserDocument, variables, options) as Promise<DeleteOneUserMutation>;
    },
    DeleteOnePost(variables: DeleteOnePostMutationVariables, options?: C): Promise<DeleteOnePostMutation> {
      return requester<DeleteOnePostMutation, DeleteOnePostMutationVariables>(DeleteOnePostDocument, variables, options) as Promise<DeleteOnePostMutation>;
    },
    DeleteOneCategory(variables: DeleteOneCategoryMutationVariables, options?: C): Promise<DeleteOneCategoryMutation> {
      return requester<DeleteOneCategoryMutation, DeleteOneCategoryMutationVariables>(DeleteOneCategoryDocument, variables, options) as Promise<DeleteOneCategoryMutation>;
    },
    DeleteManyUser(variables: DeleteManyUserMutationVariables, options?: C): Promise<DeleteManyUserMutation> {
      return requester<DeleteManyUserMutation, DeleteManyUserMutationVariables>(DeleteManyUserDocument, variables, options) as Promise<DeleteManyUserMutation>;
    },
    DeleteManyPost(variables: DeleteManyPostMutationVariables, options?: C): Promise<DeleteManyPostMutation> {
      return requester<DeleteManyPostMutation, DeleteManyPostMutationVariables>(DeleteManyPostDocument, variables, options) as Promise<DeleteManyPostMutation>;
    },
    DeleteManyCategory(variables: DeleteManyCategoryMutationVariables, options?: C): Promise<DeleteManyCategoryMutation> {
      return requester<DeleteManyCategoryMutation, DeleteManyCategoryMutationVariables>(DeleteManyCategoryDocument, variables, options) as Promise<DeleteManyCategoryMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;