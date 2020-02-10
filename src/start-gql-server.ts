import * as path from 'path';
import { GraphQLServer } from 'graphql-yoga';
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma';
import { prisma } from './../generated/prisma-client';
import datamodelInfo from './../generated/nexus-prisma';

const User = prismaObjectType({
  name: 'User',
  description: 'User',
  definition: t => t.prismaFields(['*'])
});

const Post = prismaObjectType({
  name: 'Post',
  description: 'Post',
  definition: t => t.prismaFields(['*'])
});

const Query = prismaObjectType({
  name: 'Query',
  definition: t => t.prismaFields(['*'])
});

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => t.prismaFields(['*'])
});

const schema = makePrismaSchema({
  types: [User, Post, Query, Mutation],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts')
  }
});

export function CreateGraphqlServer() {
  const server = new GraphQLServer({
    schema,
    context: { prisma }
  });
  server.start(() => console.log(`Server is running on http://localhost:4000`));
}
