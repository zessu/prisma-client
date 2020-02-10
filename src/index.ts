import { CreateGraphqlServer } from './start-gql-server';

'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {
  CreateGraphqlServer();
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
