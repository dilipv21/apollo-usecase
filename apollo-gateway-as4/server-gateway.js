const {ApolloServer} = require('@apollo/server');
const {startStandaloneServer} = require('@apollo/server/standalone');
const {ApolloGateway, RemoteGraphQLDataSource} = require('@apollo/gateway');
const {readFileSync} = require('fs');

const supergraphSdl = readFileSync('./composition/supergraph.graphql').toString();

class CustomisedDataSource extends RemoteGraphQLDataSource {

    fetcher = require('make-fetch-happen').defaults({
        maxSockets : 50,
        retry: 3,
        onRetry() {
            console.log("It retries")
        }
    });

    willSendRequest({request, context}) {
        // Pass the user's id from the context to each subgraph
        // as a header called `user-id`
        request.http.headers.set('user-id', context.userId);
    }

    didReceiveResponse({response, request, context}) {
        //console.log("Response processed.")
        return response;
    }

    didEncounterError(error, _fetchRequest, _fetchResponse, _context) {
        console.log(`didEncounterError :: ${JSON.stringify(error)}`)
        //super.didEncounterError(error, _fetchRequest, _fetchResponse, _context);
        throw error
    }

    errorFromResponse(response) {
        console.log(`errorFromResponse :: ${JSON.stringify(response)}`)
        return super.errorFromResponse(response);
    }

}

const gateway = new ApolloGateway({
    supergraphSdl,
    buildService({name, url}) {
        return new CustomisedDataSource({url});
    }
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
    gateway,
    formatError: (err) => {
        console.log(`Formatted Error ${JSON.stringify(err)}`);
        throw  err;
    }
});

// Note the top-level `await`!
startStandaloneServer(server, {listen: 3000}).then(
    url => {
        console.log(`🚀  Server ready at ${JSON.stringify(url)}`);
    }
);

