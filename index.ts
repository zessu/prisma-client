import express = require('express');
// import { server as GraphqlServer } from './start-gql-server';
// Create a new express application instance
const app: express.Application = express();
import { PrismaClient, User } from '@prisma/client';

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/createUser', async function(req, res) {
  console.log('reached here');
  const prisma = new PrismaClient();
  const user1 = await prisma.user.create({
    data: {
      name: 'john shoe',
      email: 'johnd@gmail.com',
      password: 'mypassword'
    }
  });
  res.send(user1);
});

// GraphqlServer.start(() =>
//   console.log('Server is running on http://localhost:4000')
// );

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
