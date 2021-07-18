const _ = require('lodash')
const {ApolloServer} = require('apollo-server-lambda');
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = require('./schemas/market');

const resolvers = {
    Market: {
        __resolveReference: async (ref) => {
            let result = {
                name: "name",
                market: "market",
                id: "id",
            };

            return result;
        },
    },
    Query: {
        getAllMarket: async (parent, {}, context, info) => {
            return [
                {"id": "IDX", "name": "Indonesia Stock Exchange", "country": "ID"},
            ]
        },
    },
};

const schema = buildFederatedSchema([{typeDefs, resolvers}]);

const server = new ApolloServer({
    schema,
    context: async ({event, context, express}) => {
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