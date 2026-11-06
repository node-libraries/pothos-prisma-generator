export const prismaDmmf = {
  "datamodel": {
    "enums": [
      {
        "name": "Role",
        "values": [
          {
            "name": "ADMIN",
            "dbName": null
          },
          {
            "name": "USER",
            "dbName": null
          }
        ],
        "dbName": null
      }
    ],
    "models": [
      {
        "name": "User",
        "dbName": null,
        "schema": null,
        "fields": [
          {
            "name": "id",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": true,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "String",
            "nativeType": null,
            "default": {
              "name": "uuid",
              "args": [
                4
              ]
            },
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "email",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": true,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "String",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "name",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "String",
            "nativeType": null,
            "default": "User",
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "posts",
            "kind": "object",
            "isList": true,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "Post",
            "nativeType": null,
            "relationName": "PostToUser",
            "relationFromFields": [],
            "relationToFields": [],
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "roles",
            "kind": "enum",
            "isList": true,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "Role",
            "nativeType": null,
            "default": [
              "USER"
            ],
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "createdAt",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "DateTime",
            "nativeType": null,
            "default": {
              "name": "now",
              "args": []
            },
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "updatedAt",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "DateTime",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": true
          }
        ],
        "primaryKey": null,
        "uniqueFields": [],
        "uniqueIndexes": [],
        "isGenerated": false
      },
      {
        "name": "Post",
        "dbName": null,
        "schema": null,
        "fields": [
          {
            "name": "id",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": true,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "String",
            "nativeType": null,
            "default": {
              "name": "uuid",
              "args": [
                4
              ]
            },
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "published",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "Boolean",
            "nativeType": null,
            "default": false,
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "title",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "String",
            "nativeType": null,
            "default": "New Post",
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "content",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "String",
            "nativeType": null,
            "default": "",
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "author",
            "kind": "object",
            "isList": false,
            "isRequired": false,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "User",
            "nativeType": null,
            "relationName": "PostToUser",
            "relationFromFields": [
              "authorId"
            ],
            "relationToFields": [
              "id"
            ],
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "authorId",
            "kind": "scalar",
            "isList": false,
            "isRequired": false,
            "isUnique": false,
            "isId": false,
            "isReadOnly": true,
            "hasDefaultValue": false,
            "type": "String",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "categories",
            "kind": "object",
            "isList": true,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "Category",
            "nativeType": null,
            "relationName": "CategoryToPost",
            "relationFromFields": [],
            "relationToFields": [],
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "createdAt",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "DateTime",
            "nativeType": null,
            "default": {
              "name": "now",
              "args": []
            },
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "updatedAt",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "DateTime",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": true
          },
          {
            "name": "publishedAt",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "DateTime",
            "nativeType": null,
            "default": {
              "name": "now",
              "args": []
            },
            "isGenerated": false,
            "isUpdatedAt": false
          }
        ],
        "primaryKey": null,
        "uniqueFields": [],
        "uniqueIndexes": [],
        "isGenerated": false
      },
      {
        "name": "Category",
        "dbName": null,
        "schema": null,
        "fields": [
          {
            "name": "id",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": true,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "String",
            "nativeType": null,
            "default": {
              "name": "uuid",
              "args": [
                4
              ]
            },
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "name",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "String",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "posts",
            "kind": "object",
            "isList": true,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "Post",
            "nativeType": null,
            "relationName": "CategoryToPost",
            "relationFromFields": [],
            "relationToFields": [],
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "createdAt",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "DateTime",
            "nativeType": null,
            "default": {
              "name": "now",
              "args": []
            },
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "updatedAt",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "DateTime",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": true
          }
        ],
        "primaryKey": null,
        "uniqueFields": [],
        "uniqueIndexes": [],
        "isGenerated": false
      },
      {
        "name": "TypeTest",
        "dbName": null,
        "schema": null,
        "fields": [
          {
            "name": "id",
            "kind": "scalar",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": true,
            "isReadOnly": false,
            "hasDefaultValue": true,
            "type": "String",
            "nativeType": null,
            "default": {
              "name": "uuid",
              "args": [
                4
              ]
            },
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "scalarList",
            "kind": "scalar",
            "isList": true,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "String",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": false
          },
          {
            "name": "role",
            "kind": "enum",
            "isList": false,
            "isRequired": true,
            "isUnique": false,
            "isId": false,
            "isReadOnly": false,
            "hasDefaultValue": false,
            "type": "Role",
            "nativeType": null,
            "isGenerated": false,
            "isUpdatedAt": false
          }
        ],
        "primaryKey": null,
        "uniqueFields": [],
        "uniqueIndexes": [],
        "isGenerated": false
      }
    ],
    "types": [],
    "indexes": [
      {
        "model": "User",
        "type": "id",
        "isDefinedOnField": true,
        "fields": [
          {
            "name": "id"
          }
        ]
      },
      {
        "model": "User",
        "type": "unique",
        "isDefinedOnField": true,
        "fields": [
          {
            "name": "email"
          }
        ]
      },
      {
        "model": "Post",
        "type": "id",
        "isDefinedOnField": true,
        "fields": [
          {
            "name": "id"
          }
        ]
      },
      {
        "model": "Category",
        "type": "id",
        "isDefinedOnField": true,
        "fields": [
          {
            "name": "id"
          }
        ]
      },
      {
        "model": "TypeTest",
        "type": "id",
        "isDefinedOnField": true,
        "fields": [
          {
            "name": "id"
          }
        ]
      }
    ]
  }
};