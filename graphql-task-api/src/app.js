const path = require('path');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();
const PORT = process.env.PORT || 5000;

// Task Management System web page (served at / and /index.html)
app.use(express.static(path.join(__dirname, '..', 'public')));

// GraphQL endpoint with the GraphiQL interface
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(PORT, () => {
  console.log(`Task Management System: http://localhost:${PORT}/index.html`);
  console.log(`GraphQL endpoint (GraphiQL): http://localhost:${PORT}/graphql`);
});