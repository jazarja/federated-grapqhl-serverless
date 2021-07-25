const { gql } = require('apollo-server');

const typeDefs = gql`
  # Query schema
  type Instrument @key(fields: "id") {
    id: ID!
    name: String
    exchange: Exchange
  }
  
  extend type Exchange @key(fields: "id") {
    id: ID! @external
  }
  
  extend type Query {
    allInstruments: [Instrument]
  }
  
  # Mutation schema
  input InstrumentUpdateInput {
    name: String!
  }
  
  extend type Mutation {
    updateInstrument(input: InstrumentUpdateInput): Instrument
  }  
`;
module.exports = typeDefs;