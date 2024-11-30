const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const graphQLSchema = require("./schema/schema");

const app = express();

app.use(
  "/graphql",
  expressGraphQL({
    schema: graphQLSchema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
