# GraphQL API Guidelines

## Naming conventions
### General Naming & Namespaces
All types, inputs, operations, etc (except for those used globally, e.g. Access or UserError) shall have the module (API) name prefixed to make them uniquely identifiable within a system

### Types & Inputs
GraphQL **types** and **inputs** shall be written in UpperCamelCase  
Good Examples:
- ImageDirectory
- UserGroup
- ImageTag
- CreateImageDirectoryPayload

Bad Examples:
- create_image_directory_payload
- userError

### Queries & Mutations
GraphQL **queries** and **mutations** shall be written in lowerCamelCase
Good Examples:
- createPictureDirectory
- createUser
- pictureDirectories

Bad Examples:
- create_picture_directory
- CreateUser
- picture_directories

Queries shall always be called like the object or property they are querying for. No `get` in front of the query name  
Singular shall be used if only one element will be returned  
Plural shall be used, if a list of elements will be returned  
  
Mutation names shall describe the operation they are executing:
Common operations are `create`, `edit` or `delete`  
It has to be differentiated between the creation of an object (e.g. `createTag`) and the adding of an object relation (e.g. `addTagToPicture`)

### Mutation Input
only one input argument

### Mutation Payload
always returning custom payload with resulting object(s) and user error