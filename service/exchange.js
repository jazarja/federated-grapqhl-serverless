const _ = require('lodash')
const {ApolloServer} = require('apollo-server-lambda');
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = require('./schemas/exchange');

const resolvers = {
    Exchange: {
        __resolveReference: async (ref) => {
            let result = {
                name: "Exchange: "+ref.id,
                country: "Global",
                id: ref.id,
            };

            return result;
        },
    },
    Query: {
        allExchanges: async (parent, {}, context, info) => {
            return [
                {"id": "IDX", "name": "Indonesia Stock Exchange", "country": "ID"},
                {"id": "NYSE", "name": "New York Stock Exchange", "country": "US"},
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