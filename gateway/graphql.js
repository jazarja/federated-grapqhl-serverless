const _ = require('lodash')
const {ApolloServer} = require('apollo-server-lambda');
const {ApolloGateway, RemoteGraphQLDataSource} = require('@apollo/gateway');

const gateway = new ApolloGateway({
    serviceList: [
        {name: 'instrument', url: 'https://nowey5t7y1.execute-api.ap-southeast-1.amazonaws.com/dev/instrument'},
        {name: 'exchange', url: 'https://nowey5t7y1.execute-api.ap-southeast-1.amazonaws.com/dev/exchange'},
    ],
    buildService({ url }) {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
                request.http.headers.set('Authorization', context.jwt);
            }
        });
    }
});


const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: async ({event}) => {
        const token = event.headers.Authorization || '';
        console.log("Token", token);
        // if (!token) throw new Error('No access token');
        return {
            jwt: token
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