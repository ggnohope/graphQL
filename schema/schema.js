const graphql = require("graphql");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

const companyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(userType),
      async resolve(parentValue, args) {
        const res = await axios.get(
          `http://localhost:4000/companies/${parentValue.id}/users`
        );
        return res.data;
      },
    },
  }),
});

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: companyType,
      async resolve(parentValue, args) {
        const res = await axios.get(
          `http://localhost:4000/companies/${parentValue.companyId}`
        );
        return res.data;
      },
    },
  }),
});

const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    user: {
      type: userType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const res = await axios.get(`http://localhost:4000/users/${args.id}`);
        return res.data;
      },
    },
    company: {
      type: companyType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const res = await axios.get(
          `http://localhost:4000/companies/${args.id}`
        );
        return res.data;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: userType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        const { firstName, age, companyId } = args;
        const res = await axios.post("http://localhost:4000/users", {
          firstName,
          age,
          companyId,
        });
        return res.data;
      },
    },
    deleteUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        const { id } = args;
        const res = await axios.delete(`http://localhost:4000/users/${id}`);
        return res.data;
      },
    },
    editUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      async resolve(parentValue, args) {
        const { id, firstName, age, companyId } = args;
        const res = await axios.patch(`http://localhost:4000/users/${id}`, {
          firstName,
          age,
          companyId,
        });
        return res.data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation: mutation,
});
