const _ = require('lodash')
const { gql } = require('apollo-server');
const {ApolloServer} = require('apollo-server-lambda');
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = require("./schemas/instrument");

const resolvers = {
    Instrument: {
        exchange: (instrument) => ({ __typename: 'Exchange', id: instrument.exchange }),

        __resolveReference: async (ref) => {
            let result = {
                name: "name",
                exchange: "IDX",
                id: ref.id,
            };

            return result;
        },
    },
    Query: {
        allInstruments: async (parent, {}, context, info) => {
            return [
                {"id" : "ASII", "exchange" : "IDX", "name" : "Astra"},
                {"id" : "BBCA", "exchange" : "IDX", "name" : "BCA"},
            ]
        },
    },
    Mutation: {
        updateInstrument: async (__, {input}, context, info) => {
            let result = {
                name: input.name,
                exchange: "IDX",
                id: "id",
            };

            return result;
        },
    }
};

const schema = buildFederatedSchema([{typeDefs, resolvers}]);

const server = new ApolloServer({
    schema,
    context: async ({ event, context, express }) => {
        const token = event.headers.Authorization || '';
        console.log("Token", token);
        // if (!token) throw new Error('No access token');
        return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            context
        };
    },
});

exports.main = server.createHandler(
    {
        cors: {
            origin: '*',
            credentials: true,
        },
    }
);