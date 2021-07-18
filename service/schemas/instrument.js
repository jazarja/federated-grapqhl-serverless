const { gql } = require('apollo-server');

const typeDefs = gql`
  # Query schema
  type Instrument @key(fields: "id") {
    id: ID!
    name: String
    market: Market
  }
  
  extend type Market @key(fields: "id") {
    id: ID! @external
  }
  
  extend type Query {
    getAllInstrument: [Instrument]
  }
  
  # Mutation schema
  input instrument_update_input {
    name: String!
  }
  
  extend type Mutation {
    updateInstrument(input: instrument_update_input): Instrument
  }  
`;
module.exports = typeDefs;