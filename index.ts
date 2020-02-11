import express = require('express');
import { server as GraphqlServer } from './start-gql-server';
// Create a new express application instance
const app: express.Application = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});

GraphqlServer.start(() =>
  console.log('Server is running on http://localhost:4000')
);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
