/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type BooleanFilter = {
  equals?: boolean | null | undefined;
  in?: Array<boolean> | null | undefined;
  is?: boolean | null | undefined;
  isNot?: boolean | null | undefined;
  not?: BooleanFilter | null | undefined;
  notIn?: Array<boolean> | null | undefined;
};

export type CategoryCreateInput = {
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  name: string;
  posts?: CategoryCreatePostsRelationInput | null | undefined;
  updatedAt?: string | null | undefined;
};

export type CategoryCreateManyInput = {
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  name: string;
  updatedAt?: string | null | undefined;
};

export type CategoryCreatePostsRelationInput = {
  connect?: Array<PostUniqueFilter> | null | undefined;
  create?: Array<PostCreateWithoutCategoriesInput> | null | undefined;
};

export type CategoryCreateWithoutPostsInput = {
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  name: string;
  updatedAt?: string | null | undefined;
};

export type CategoryFilter = {
  AND?: Array<CategoryFilter> | null | undefined;
  NOT?: CategoryFilter | null | undefined;
  OR?: Array<CategoryFilter> | null | undefined;
  createdAt?: DateTimeFilter | null | undefined;
  id?: StringFilter | null | undefined;
  name?: StringFilter | null | undefined;
  posts?: PostListFilter | null | undefined;
  updatedAt?: DateTimeFilter | null | undefined;
};

export type CategoryListFilter = {
  every?: CategoryFilter | null | undefined;
  none?: CategoryFilter | null | undefined;
  some?: CategoryFilter | null | undefined;
};

export type CategoryOrderBy = {
  createdAt?: OrderBy | null | undefined;
  id?: OrderBy | null | undefined;
  name?: OrderBy | null | undefined;
  updatedAt?: OrderBy | null | undefined;
};

export type CategoryUniqueFilter = {
  id?: string | null | undefined;
};

export type CategoryUpdateInput = {
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  name?: string | null | undefined;
  posts?: CategoryUpdatePostsRelationInput | null | undefined;
  updatedAt?: string | null | undefined;
};

export type CategoryUpdatePostsRelationInput = {
  connect?: Array<PostUniqueFilter> | null | undefined;
  create?: Array<PostCreateWithoutCategoriesInput> | null | undefined;
  delete?: Array<PostUniqueFilter> | null | undefined;
  deleteMany?: Array<PostWithoutCategoriesFilter> | null | undefined;
  disconnect?: Array<PostUniqueFilter> | null | undefined;
  set?: Array<PostUniqueFilter> | null | undefined;
  update?: Array<CategoryUpdatePostsRelationInputUpdate> | null | undefined;
  updateMany?: Array<CategoryUpdatePostsRelationInputUpdateMany> | null | undefined;
};

export type CategoryUpdatePostsRelationInputUpdate = {
  data?: PostUpdateWithoutCategoriesInput | null | undefined;
  where?: PostUniqueFilter | null | undefined;
};

export type CategoryUpdatePostsRelationInputUpdateMany = {
  data?: PostUpdateWithoutCategoriesInput | null | undefined;
  where?: PostWithoutCategoriesFilter | null | undefined;
};

export type CategoryUpdateWithoutPostsInput = {
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  name?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type CategoryWithoutPostsFilter = {
  AND?: Array<CategoryWithoutPostsFilter> | null | undefined;
  NOT?: CategoryWithoutPostsFilter | null | undefined;
  OR?: Array<CategoryWithoutPostsFilter> | null | undefined;
  createdAt?: DateTimeFilter | null | undefined;
  id?: StringFilter | null | undefined;
  name?: StringFilter | null | undefined;
  updatedAt?: DateTimeFilter | null | undefined;
};

export type DateTimeFilter = {
  equals?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: Array<string> | null | undefined;
  is?: string | null | undefined;
  isNot?: string | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  not?: DateTimeFilter | null | undefined;
  notIn?: Array<string> | null | undefined;
};

export type OrderBy =
  | 'Asc'
  | 'Desc';

export type PostCreateAuthorRelationInput = {
  connect?: UserUniqueFilter | null | undefined;
  create?: UserCreateWithoutPostsInput | null | undefined;
};

export type PostCreateCategoriesRelationInput = {
  connect?: Array<CategoryUniqueFilter> | null | undefined;
  create?: Array<CategoryCreateWithoutPostsInput> | null | undefined;
};

export type PostCreateInput = {
  author?: PostCreateAuthorRelationInput | null | undefined;
  categories?: PostCreateCategoriesRelationInput | null | undefined;
  content?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: string | null | undefined;
  title?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type PostCreateManyInput = {
  authorId?: string | null | undefined;
  content?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: string | null | undefined;
  title?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type PostCreateWithoutAuthorInput = {
  categories?: PostCreateCategoriesRelationInput | null | undefined;
  content?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: string | null | undefined;
  title?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type PostCreateWithoutCategoriesInput = {
  author?: PostCreateAuthorRelationInput | null | undefined;
  content?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: string | null | undefined;
  title?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type PostDistinctEnum =
  | 'authorId'
  | 'content'
  | 'createdAt'
  | 'id'
  | 'published'
  | 'publishedAt'
  | 'title'
  | 'updatedAt';

export type PostFilter = {
  AND?: Array<PostFilter> | null | undefined;
  NOT?: PostFilter | null | undefined;
  OR?: Array<PostFilter> | null | undefined;
  author?: UserFilter | null | undefined;
  authorId?: StringFilter | null | undefined;
  categories?: CategoryListFilter | null | undefined;
  content?: StringFilter | null | undefined;
  createdAt?: DateTimeFilter | null | undefined;
  id?: StringFilter | null | undefined;
  published?: BooleanFilter | null | undefined;
  publishedAt?: DateTimeFilter | null | undefined;
  title?: StringFilter | null | undefined;
  updatedAt?: DateTimeFilter | null | undefined;
};

export type PostListFilter = {
  every?: PostFilter | null | undefined;
  none?: PostFilter | null | undefined;
  some?: PostFilter | null | undefined;
};

export type PostOrderBy = {
  author?: UserOrderBy | null | undefined;
  authorId?: OrderBy | null | undefined;
  content?: OrderBy | null | undefined;
  createdAt?: OrderBy | null | undefined;
  id?: OrderBy | null | undefined;
  published?: OrderBy | null | undefined;
  publishedAt?: OrderBy | null | undefined;
  title?: OrderBy | null | undefined;
  updatedAt?: OrderBy | null | undefined;
};

export type PostUniqueFilter = {
  id?: string | null | undefined;
};

export type PostUpdateAuthorRelationInput = {
  connect?: UserUniqueFilter | null | undefined;
  create?: UserCreateWithoutPostsInput | null | undefined;
  delete?: boolean | null | undefined;
  disconnect?: boolean | null | undefined;
  update?: UserUpdateWithoutPostsInput | null | undefined;
};

export type PostUpdateCategoriesRelationInput = {
  connect?: Array<CategoryUniqueFilter> | null | undefined;
  create?: Array<CategoryCreateWithoutPostsInput> | null | undefined;
  delete?: Array<CategoryUniqueFilter> | null | undefined;
  deleteMany?: Array<CategoryWithoutPostsFilter> | null | undefined;
  disconnect?: Array<CategoryUniqueFilter> | null | undefined;
  set?: Array<CategoryUniqueFilter> | null | undefined;
  update?: Array<PostUpdateCategoriesRelationInputUpdate> | null | undefined;
  updateMany?: Array<PostUpdateCategoriesRelationInputUpdateMany> | null | undefined;
};

export type PostUpdateCategoriesRelationInputUpdate = {
  data?: CategoryUpdateWithoutPostsInput | null | undefined;
  where?: CategoryUniqueFilter | null | undefined;
};

export type PostUpdateCategoriesRelationInputUpdateMany = {
  data?: CategoryUpdateWithoutPostsInput | null | undefined;
  where?: CategoryWithoutPostsFilter | null | undefined;
};

export type PostUpdateInput = {
  author?: PostUpdateAuthorRelationInput | null | undefined;
  categories?: PostUpdateCategoriesRelationInput | null | undefined;
  content?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: string | null | undefined;
  title?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type PostUpdateWithoutAuthorInput = {
  categories?: PostUpdateCategoriesRelationInput | null | undefined;
  content?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: string | null | undefined;
  title?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type PostUpdateWithoutCategoriesInput = {
  author?: PostUpdateAuthorRelationInput | null | undefined;
  content?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: string | null | undefined;
  title?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

export type PostWithoutAuthorFilter = {
  AND?: Array<PostWithoutAuthorFilter> | null | undefined;
  NOT?: PostWithoutAuthorFilter | null | undefined;
  OR?: Array<PostWithoutAuthorFilter> | null | undefined;
  categories?: CategoryListFilter | null | undefined;
  content?: StringFilter | null | undefined;
  createdAt?: DateTimeFilter | null | undefined;
  id?: StringFilter | null | undefined;
  published?: BooleanFilter | null | undefined;
  publishedAt?: DateTimeFilter | null | undefined;
  title?: StringFilter | null | undefined;
  updatedAt?: DateTimeFilter | null | undefined;
};

export type PostWithoutCategoriesFilter = {
  AND?: Array<PostWithoutCategoriesFilter> | null | undefined;
  NOT?: PostWithoutCategoriesFilter | null | undefined;
  OR?: Array<PostWithoutCategoriesFilter> | null | undefined;
  author?: UserFilter | null | undefined;
  authorId?: StringFilter | null | undefined;
  content?: StringFilter | null | undefined;
  createdAt?: DateTimeFilter | null | undefined;
  id?: StringFilter | null | undefined;
  published?: BooleanFilter | null | undefined;
  publishedAt?: DateTimeFilter | null | undefined;
  title?: StringFilter | null | undefined;
  updatedAt?: DateTimeFilter | null | undefined;
};

export type Role =
  | 'ADMIN'
  | 'USER';

export type RoleListFilter = {
  equals?: Array<Role> | null | undefined;
  has?: Role | null | undefined;
  hasEvery?: Array<Role> | null | undefined;
  hasSome?: Array<Role> | null | undefined;
  isEmpty?: boolean | null | undefined;
};

export type StringFilter = {
  contains?: string | null | undefined;
  endsWith?: string | null | undefined;
  equals?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: Array<string> | null | undefined;
  is?: string | null | undefined;
  isNot?: string | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  mode?: StringFilterMode | null | undefined;
  not?: StringFilter | null | undefined;
  notIn?: Array<string> | null | undefined;
  startsWith?: string | null | undefined;
};

export type StringFilterMode =
  | 'Default'
  | 'Insensitive';

export type UserCreateInput = {
  createdAt?: string | null | undefined;
  email: string;
  id?: string | null | undefined;
  name?: string | null | undefined;
  posts?: UserCreatePostsRelationInput | null | undefined;
  roles?: Array<Role> | null | undefined;
  updatedAt?: string | null | undefined;
};

export type UserCreateManyInput = {
  createdAt?: string | null | undefined;
  email: string;
  id?: string | null | undefined;
  name?: string | null | undefined;
  roles?: Array<Role> | null | undefined;
  updatedAt?: string | null | undefined;
};

export type UserCreatePostsRelationInput = {
  connect?: Array<PostUniqueFilter> | null | undefined;
  create?: Array<PostCreateWithoutAuthorInput> | null | undefined;
};

export type UserCreateWithoutPostsInput = {
  createdAt?: string | null | undefined;
  email: string;
  id?: string | null | undefined;
  name?: string | null | undefined;
  roles?: Array<Role> | null | undefined;
  updatedAt?: string | null | undefined;
};

export type UserDistinctEnum =
  | 'createdAt'
  | 'email'
  | 'id'
  | 'name'
  | 'roles'
  | 'updatedAt';

export type UserFilter = {
  AND?: Array<UserFilter> | null | undefined;
  NOT?: UserFilter | null | undefined;
  OR?: Array<UserFilter> | null | undefined;
  createdAt?: DateTimeFilter | null | undefined;
  email?: StringFilter | null | undefined;
  id?: StringFilter | null | undefined;
  name?: StringFilter | null | undefined;
  posts?: PostListFilter | null | undefined;
  roles?: RoleListFilter | null | undefined;
  updatedAt?: DateTimeFilter | null | undefined;
};

export type UserOrderBy = {
  createdAt?: OrderBy | null | undefined;
  email?: OrderBy | null | undefined;
  id?: OrderBy | null | undefined;
  name?: OrderBy | null | undefined;
  updatedAt?: OrderBy | null | undefined;
};

export type UserUniqueFilter = {
  email?: string | null | undefined;
  id?: string | null | undefined;
};

export type UserUpdateInput = {
  createdAt?: string | null | undefined;
  email?: string | null | undefined;
  id?: string | null | undefined;
  name?: string | null | undefined;
  posts?: UserUpdatePostsRelationInput | null | undefined;
  roles?: Array<Role> | null | undefined;
  updatedAt?: string | null | undefined;
};

export type UserUpdatePostsRelationInput = {
  connect?: Array<PostUniqueFilter> | null | undefined;
  create?: Array<PostCreateWithoutAuthorInput> | null | undefined;
  delete?: Array<PostUniqueFilter> | null | undefined;
  deleteMany?: Array<PostWithoutAuthorFilter> | null | undefined;
  disconnect?: Array<PostUniqueFilter> | null | undefined;
  set?: Array<PostUniqueFilter> | null | undefined;
  update?: Array<UserUpdatePostsRelationInputUpdate> | null | undefined;
  updateMany?: Array<UserUpdatePostsRelationInputUpdateMany> | null | undefined;
};

export type UserUpdatePostsRelationInputUpdate = {
  data?: PostUpdateWithoutAuthorInput | null | undefined;
  where?: PostUniqueFilter | null | undefined;
};

export type UserUpdatePostsRelationInputUpdateMany = {
  data?: PostUpdateWithoutAuthorInput | null | undefined;
  where?: PostWithoutAuthorFilter | null | undefined;
};

export type UserUpdateWithoutPostsInput = {
  createdAt?: string | null | undefined;
  email?: string | null | undefined;
  id?: string | null | undefined;
  name?: string | null | undefined;
  roles?: Array<Role> | null | undefined;
  updatedAt?: string | null | undefined;
};

export type UserFragment = { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string };

export type CategoryFragment = { id: string, name: string, createdAt: string, updatedAt: string };

export type PostFragment = { id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string };

export type CountUserQueryVariables = Exact<{
  filter?: UserFilter | null | undefined;
}>;


export type CountUserQuery = { countUser: number };

export type CountPostQueryVariables = Exact<{
  filter?: PostFilter | null | undefined;
}>;


export type CountPostQuery = { countPost: number };

export type CountCategoryQueryVariables = Exact<{
  filter?: CategoryFilter | null | undefined;
}>;


export type CountCategoryQuery = { countCategory: number };

export type FindUniqueUserQueryVariables = Exact<{
  filter: UserUniqueFilter;
  postFilter?: PostFilter | null | undefined;
  postOrderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  postLimit?: number | null | undefined;
  postOffset?: number | null | undefined;
}>;


export type FindUniqueUserQuery = { findUniqueUser: { postsCount: number, id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string, posts: Array<{ id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string }> } };

export type FindUniquePostQueryVariables = Exact<{
  filter: PostUniqueFilter;
  categoryFilter?: CategoryFilter | null | undefined;
  categoryOrderBy?: Array<CategoryOrderBy> | CategoryOrderBy | null | undefined;
  categoryLimit?: number | null | undefined;
  categoryOffset?: number | null | undefined;
}>;


export type FindUniquePostQuery = { findUniquePost: { categoriesCount: number, id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string, author: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null, categories: Array<{ id: string, name: string, createdAt: string, updatedAt: string }> } };

export type FindUniqueCategoryQueryVariables = Exact<{
  filter: CategoryUniqueFilter;
  postFilter?: PostFilter | null | undefined;
  postOrderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  postLimit?: number | null | undefined;
  postOffset?: number | null | undefined;
}>;


export type FindUniqueCategoryQuery = { findUniqueCategory: { postsCount: number, id: string, name: string, createdAt: string, updatedAt: string, posts: Array<{ id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string }> } };

export type FindFirstUserQueryVariables = Exact<{
  filter?: UserFilter | null | undefined;
  orderBy?: Array<UserOrderBy> | UserOrderBy | null | undefined;
  postFilter?: PostFilter | null | undefined;
  postOrderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  postLimit?: number | null | undefined;
  postOffset?: number | null | undefined;
}>;


export type FindFirstUserQuery = { findFirstUser: { postsCount: number, id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string, posts: Array<{ id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string }> } | null };

export type FindFirstPostQueryVariables = Exact<{
  filter?: PostFilter | null | undefined;
  orderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  categoryFilter?: CategoryFilter | null | undefined;
  categoryOrderBy?: Array<CategoryOrderBy> | CategoryOrderBy | null | undefined;
  categoryLimit?: number | null | undefined;
  categoryOffset?: number | null | undefined;
}>;


export type FindFirstPostQuery = { findFirstPost: { categoriesCount: number, id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string, author: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null, categories: Array<{ id: string, name: string, createdAt: string, updatedAt: string }> } | null };

export type FindFirstCategoryQueryVariables = Exact<{
  filter?: CategoryFilter | null | undefined;
  orderBy?: Array<CategoryOrderBy> | CategoryOrderBy | null | undefined;
  postFilter?: PostFilter | null | undefined;
  postOrderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  postLimit?: number | null | undefined;
  postOffset?: number | null | undefined;
}>;


export type FindFirstCategoryQuery = { findFirstCategory: { postsCount: number, id: string, name: string, createdAt: string, updatedAt: string, posts: Array<{ id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string }> } | null };

export type FindManyUserQueryVariables = Exact<{
  filter?: UserFilter | null | undefined;
  orderBy?: Array<UserOrderBy> | UserOrderBy | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  cursor?: UserUniqueFilter | null | undefined;
  distinct?: Array<UserDistinctEnum> | UserDistinctEnum | null | undefined;
  postFilter?: PostFilter | null | undefined;
  postOrderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  postLimit?: number | null | undefined;
  postOffset?: number | null | undefined;
}>;


export type FindManyUserQuery = { findManyUser: Array<{ postsCount: number, id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string, posts: Array<{ id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string, author: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null }> }> };

export type FindManyPostQueryVariables = Exact<{
  filter?: PostFilter | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  orderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  cursor?: PostUniqueFilter | null | undefined;
  distinct?: Array<PostDistinctEnum> | PostDistinctEnum | null | undefined;
  categoryFilter?: CategoryFilter | null | undefined;
  categoryOrderBy?: Array<CategoryOrderBy> | CategoryOrderBy | null | undefined;
  categoryLimit?: number | null | undefined;
  categoryOffset?: number | null | undefined;
}>;


export type FindManyPostQuery = { findManyPost: Array<{ categoriesCount: number, id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string, author: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } | null, categories: Array<{ id: string, name: string, createdAt: string, updatedAt: string }> }> };

export type FindManyCategoryQueryVariables = Exact<{
  filter?: CategoryFilter | null | undefined;
  orderBy?: Array<CategoryOrderBy> | CategoryOrderBy | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  postFilter?: PostFilter | null | undefined;
  postOrderBy?: Array<PostOrderBy> | PostOrderBy | null | undefined;
  postLimit?: number | null | undefined;
  postOffset?: number | null | undefined;
}>;


export type FindManyCategoryQuery = { findManyCategory: Array<{ postsCount: number, id: string, name: string, createdAt: string, updatedAt: string, posts: Array<{ id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string }> }> };

export type CreateOneUserMutationVariables = Exact<{
  input: UserCreateInput;
}>;


export type CreateOneUserMutation = { createOneUser: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } };

export type CreateOnePostMutationVariables = Exact<{
  input: PostCreateInput;
}>;


export type CreateOnePostMutation = { createOnePost: { id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string } };

export type CreateOneCategoryMutationVariables = Exact<{
  input: CategoryCreateInput;
}>;


export type CreateOneCategoryMutation = { createOneCategory: { id: string, name: string, createdAt: string, updatedAt: string } };

export type CreateManyUserMutationVariables = Exact<{
  input: Array<UserCreateManyInput> | UserCreateManyInput;
}>;


export type CreateManyUserMutation = { createManyUser: number };

export type CreateManyPostMutationVariables = Exact<{
  input: Array<PostCreateManyInput> | PostCreateManyInput;
}>;


export type CreateManyPostMutation = { createManyPost: number };

export type CreateManyCategoryMutationVariables = Exact<{
  input: Array<CategoryCreateManyInput> | CategoryCreateManyInput;
}>;


export type CreateManyCategoryMutation = { createManyCategory: number };

export type UpdateOneUserMutationVariables = Exact<{
  where: UserUniqueFilter;
  data: UserUpdateInput;
}>;


export type UpdateOneUserMutation = { updateOneUser: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } };

export type UpdateOnePostMutationVariables = Exact<{
  where: PostUniqueFilter;
  data: PostUpdateInput;
}>;


export type UpdateOnePostMutation = { updateOnePost: { id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string } };

export type UpdateOneCategoryMutationVariables = Exact<{
  where: CategoryUniqueFilter;
  data: CategoryUpdateInput;
}>;


export type UpdateOneCategoryMutation = { updateOneCategory: { id: string, name: string, createdAt: string, updatedAt: string } };

export type UpdateManyUserMutationVariables = Exact<{
  where: UserFilter;
  data: UserUpdateInput;
}>;


export type UpdateManyUserMutation = { updateManyUser: number };

export type UpdateManyPostMutationVariables = Exact<{
  where: PostFilter;
  data: PostUpdateInput;
}>;


export type UpdateManyPostMutation = { updateManyPost: number };

export type UpdateManyCategoryMutationVariables = Exact<{
  where: CategoryFilter;
  data: CategoryUpdateInput;
}>;


export type UpdateManyCategoryMutation = { updateManyCategory: number };

export type DeleteOneUserMutationVariables = Exact<{
  where: UserUniqueFilter;
}>;


export type DeleteOneUserMutation = { deleteOneUser: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } };

export type DeleteOnePostMutationVariables = Exact<{
  where: PostUniqueFilter;
}>;


export type DeleteOnePostMutation = { deleteOnePost: { id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string } };

export type DeleteOneCategoryMutationVariables = Exact<{
  where: CategoryUniqueFilter;
}>;


export type DeleteOneCategoryMutation = { deleteOneCategory: { id: string, name: string, createdAt: string, updatedAt: string } };

export type DeleteManyUserMutationVariables = Exact<{
  where: UserFilter;
}>;


export type DeleteManyUserMutation = { deleteManyUser: number };

export type DeleteManyPostMutationVariables = Exact<{
  where: PostFilter;
}>;


export type DeleteManyPostMutation = { deleteManyPost: number };

export type DeleteManyCategoryMutationVariables = Exact<{
  where: CategoryFilter;
}>;


export type DeleteManyCategoryMutation = { deleteManyCategory: number };

export type UpsertOneUserMutationVariables = Exact<{
  where: UserUniqueFilter;
  create: UserCreateInput;
  update: UserUpdateInput;
}>;


export type UpsertOneUserMutation = { upsertOneUser: { id: string, email: string, name: string, roles: Array<Role>, createdAt: string, updatedAt: string } };

export type UpsertOnePostMutationVariables = Exact<{
  where: PostUniqueFilter;
  create: PostCreateInput;
  update: PostUpdateInput;
}>;


export type UpsertOnePostMutation = { upsertOnePost: { id: string, published: boolean, title: string, content: string, authorId: string | null, updatedAt: string, publishedAt: string } };

export type UpsertOneCategoryMutationVariables = Exact<{
  where: CategoryUniqueFilter;
  create: CategoryCreateInput;
  update: CategoryUpdateInput;
}>;


export type UpsertOneCategoryMutation = { upsertOneCategory: { id: string, name: string, createdAt: string, updatedAt: string } };

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
    query FindManyUser($filter: UserFilter, $orderBy: [UserOrderBy!], $limit: Int, $offset: Int, $cursor: UserUniqueFilter, $distinct: [UserDistinctEnum!], $postFilter: PostFilter, $postOrderBy: [PostOrderBy!], $postLimit: Int, $postOffset: Int) {
  findManyUser(
    filter: $filter
    orderBy: $orderBy
    limit: $limit
    offset: $offset
    cursor: $cursor
    distinct: $distinct
  ) {
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
    query FindManyPost($filter: PostFilter, $limit: Int, $offset: Int, $orderBy: [PostOrderBy!], $cursor: PostUniqueFilter, $distinct: [PostDistinctEnum!], $categoryFilter: CategoryFilter, $categoryOrderBy: [CategoryOrderBy!], $categoryLimit: Int, $categoryOffset: Int) {
  findManyPost(
    filter: $filter
    orderBy: $orderBy
    limit: $limit
    offset: $offset
    cursor: $cursor
    distinct: $distinct
  ) {
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
    mutation CreateManyUser($input: [UserCreateManyInput!]!) {
  createManyUser(input: $input)
}
    `;
export const CreateManyPostDocument = gql`
    mutation CreateManyPost($input: [PostCreateManyInput!]!) {
  createManyPost(input: $input)
}
    `;
export const CreateManyCategoryDocument = gql`
    mutation CreateManyCategory($input: [CategoryCreateManyInput!]!) {
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
export const UpsertOneUserDocument = gql`
    mutation UpsertOneUser($where: UserUniqueFilter!, $create: UserCreateInput!, $update: UserUpdateInput!) {
  upsertOneUser(where: $where, create: $create, update: $update) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export const UpsertOnePostDocument = gql`
    mutation UpsertOnePost($where: PostUniqueFilter!, $create: PostCreateInput!, $update: PostUpdateInput!) {
  upsertOnePost(where: $where, create: $create, update: $update) {
    ...post
  }
}
    ${PostFragmentDoc}`;
export const UpsertOneCategoryDocument = gql`
    mutation UpsertOneCategory($where: CategoryUniqueFilter!, $create: CategoryCreateInput!, $update: CategoryUpdateInput!) {
  upsertOneCategory(where: $where, create: $create, update: $update) {
    ...category
  }
}
    ${CategoryFragmentDoc}`;
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
    },
    UpsertOneUser(variables: UpsertOneUserMutationVariables, options?: C): Promise<UpsertOneUserMutation> {
      return requester<UpsertOneUserMutation, UpsertOneUserMutationVariables>(UpsertOneUserDocument, variables, options) as Promise<UpsertOneUserMutation>;
    },
    UpsertOnePost(variables: UpsertOnePostMutationVariables, options?: C): Promise<UpsertOnePostMutation> {
      return requester<UpsertOnePostMutation, UpsertOnePostMutationVariables>(UpsertOnePostDocument, variables, options) as Promise<UpsertOnePostMutation>;
    },
    UpsertOneCategory(variables: UpsertOneCategoryMutationVariables, options?: C): Promise<UpsertOneCategoryMutation> {
      return requester<UpsertOneCategoryMutation, UpsertOneCategoryMutationVariables>(UpsertOneCategoryDocument, variables, options) as Promise<UpsertOneCategoryMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;