const graphql = require("graphql");
const axios = require("axios");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const userType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const rootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: userType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const res = await axios.get(`http://localhost:4000/users/${args.id}`);
        return res.data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQueryType,
});
