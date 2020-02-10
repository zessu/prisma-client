import * as path from 'path';
import { GraphQLServer } from 'graphql-yoga';
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma';
import { prisma } from './generated/prisma-client';
import datamodelInfo from './generated/nexus-prisma';
import { Auth, Query, Mutation } from './src/schema/auth';
const jwt = require('jsonwebtoken');

const schema = makePrismaSchema({
  types: [Query, Mutation, Auth],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts')
  }
});

const server = new GraphQLServer({
  schema,
  context: {
    prisma
  }
});
server.start(() => console.log('Server is running on http://localhost:4000'));
