const { gql } = require('apollo-server');

const typeDefs = gql`
  # Query schema
  type Exchange @key(fields: "id") {
    id: ID!
    name: String
    country: String
  }
  
  extend type Query {
    allExchanges: [Exchange]
  }
`;
module.exports = typeDefs;