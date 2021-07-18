const { gql } = require('apollo-server');

const typeDefs = gql`
  # Query schema
  type Market @key(fields: "id") {
    id: ID!
    name: String
    country: String
  }
  
  extend type Query {
    getAllMarket: [Market]
  }
`;
module.exports = typeDefs;