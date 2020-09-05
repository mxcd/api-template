import 'graphql-import-node';
const schemas = require('./types.graphql');
const operation = require('./operation.graphql');
const inputs = require('./inputs.graphql');
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from '../controller/resolvers';
import { GraphQLSchema } from 'graphql';
// import {GraphQLDateTime} from "graphql-iso-date"

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: [operation, schemas, inputs],
    resolvers
});
export default schema;

// Reference for combining schemas into one typeDef
// https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2/
/*
// schema.js
import { typeDef as Author } from './author.js';
import { typeDef as Book } from './book.js';
const Query = `
  type Query {
    author(id: Int!): Post
    book(id: Int!): Post
  }
`;
makeExecutableSchema({
    typeDefs: [ Query, Author, Book ],
    resolvers: {},
});
*/
