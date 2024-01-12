const {ApolloServer} = require('apollo-server');
const {ApolloGateway} = require('@apollo/gateway');
const {RemoteGraphQLDataSource} = require("@apollo/gateway");
const {ApolloServerPluginInlineTraceDisabled} = require('apollo-server-core');

const fs = require('fs')
const port = 5000;
const supergraphSdl = fs.readFileSync('./composition/supergraph.graphql').toString();



const gateway = new ApolloGateway({
    supergraphSdl,
    buildService({name, url}) {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({request, context}) {
                request.http.headers.set("x-forwarded-for", context.xff);
            },

            didReceiveResponse({response, request, context}) {
                return response;
            }
        });
    }
})

const server = new ApolloServer({
    gateway,
    formatError: (err) => {
        // Don't give the specific errors to the client.
        return err;
    },
    plugins: [ApolloServerPluginInlineTraceDisabled()]
});

// The `listen` method launches a web server.
server.listen(port).then(({url}) => {
    console.log(` Started the As-Is state of GraphQL ${JSON.stringify(url)}`);
});