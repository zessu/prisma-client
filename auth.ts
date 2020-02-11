import { interfaceType, stringArg, inputObjectType, queryType } from 'nexus';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LoginType = inputObjectType({
  name: 'LoginType',
  definition: t => {
    definition: t => {
      t.string("email"),
      t.string("password")
    }
  }
});

export const RegisterType({
  name: 'RegisterInputs',
  definition: t => {
    t.string("email"),
    t.string("password")
  }
});

export const LoginResponse = interfaceType({
  name: 'LoginResponse',
  definition: t => {
    t.string('token');
    t.resolveType(() => null);
  }
});

export const RegisterResponse = interfaceType({
  name: 'RegisterResponse',
  definition: t => {
    t.string('token')
    t.resolveType(() => null);
  }
});

export const Query = queryType({
  definition(t) {
    t.crud.user()
    t.crud.users({ ordering: true })
    t.crud.post()
    t.crud.posts({ filtering: true })
  },
})

export const Query = queryType({
  definition: t => {
  }
});

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['*']);
    t.field('register', {
      type: RegisterResponse,
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (_, { email, password }, ctx, info) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await ctx.prisma.createUser({
          email,
          password: hashedPassword
        });
        return { email: user.email, password: user.password };
      }
    });
    t.field('login', {
      type: LoginResponse,
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (parent, { email, password }, ctx, info) => {
        const user = await ctx.prisma.user({ email });

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
            email: user.email
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
