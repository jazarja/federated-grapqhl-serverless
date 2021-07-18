const _ = require('lodash')
const { gql } = require('apollo-server');
const {ApolloServer} = require('apollo-server-lambda');
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = require("./schemas/instrument");

const resolvers = {
    Instrument: {
        __resolveReference: async (ref) => {
            let result = {
                name: "name",
                market: "market",
                id: ref.id,
            };

            return result;
        },
    },
    Query: {
        getAllInstrument: async (parent, {}, context, info) => {
            return [
                {"id" : "ASII", "market" : "IDX", "name" : "Astra"},
                {"id" : "BBCA", "market" : "IDX", "name" : "BCA"},
            ]
        },
    },
    Mutation: {
        updateInstrument: async (__, {input}, context, info) => {
            let result = {
                name: input.name,
                market: "market",
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