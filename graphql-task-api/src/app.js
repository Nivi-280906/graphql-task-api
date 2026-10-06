const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Task Management GraphQL API is running. Open /graphql');
});

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
