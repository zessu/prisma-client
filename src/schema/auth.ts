import { mutationField, interfaceType, stringArg } from 'nexus';
import { prismaObjectType } from 'nexus-prisma';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const RegisterResponse = interfaceType({
  name: 'RegisterResponse',
  definition: t => {
    t.string('email'), t.string('password');
  }
});

export const LoginResponse = interfaceType({
  name: 'RegisterResponse',
  definition: t => {
    t.string('email'), t.string('password');
  }
});

export const Query = prismaObjectType({
  name: 'Query',
  definition: t => t.prismaFields(['*'])
});

export const Mutation = prismaObjectType({
  name: 'Query',
  definition: t => t.prismaFields(['*'])
});

export const Auth = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['*']),
      t.field('register', {
        type: RegisterResponse,
        args: {
          username: stringArg({ nullable: false }),
          password: stringArg({ nullable: false })
        },
        resolve: async (_, { username, password }, ctx, info) => {
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await ctx.prisma.createUser({
            username,
            password: hashedPassword
          });
          return user;
        }
      });
    t.field('login', {
      type: LoginResponse,
      args: {
        username: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (parent, { username, password }, ctx, info) => {
        const user = await ctx.prisma.user({ username });

        if (!user) {
          throw new Error('Invalid Login');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error('Invalid Login');
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.email
          },
          'my-secret-from-env-file-in-prod',
          {
            expiresIn: '30d' // token will expire in 30days
          }
        );
        return {
          token,
          user
        };
      }
    });
  }
});
