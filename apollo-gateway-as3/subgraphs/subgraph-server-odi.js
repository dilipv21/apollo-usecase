const {ApolloServer} = require('apollo-server');
const {gql} = require("apollo-server");
const {buildSubgraphSchema} = require('@apollo/subgraph');
const delay = delayTime => new Promise((resolve) => setTimeout(resolve, delayTime));



const typeDefs = gql`
    type Query {
        listOdiTeams: [ODI]
    }

    type ODI {
        id: ID!
        name: String
    }
`;

const resolvers = {
    Query: {
        async listOdiTeams() {
            await delay(2000);
            return [
                {id: '1', name: 'India'},
                {id: '2', name: 'Australia'},
                {id: '3', name: 'South Africa'},
                {id: '4', name: 'Pakistan'},
                {id: '5', name: 'New Zealand'},
                {id: '6', name: 'England'},
                {id: '7', name: 'Sri Lanka'},
                {id: '8', name: 'Bangladesh'},
                {id: '9', name: 'Afghanistan'},
                {id: '10', name: 'West Indies'}
            ];

        }
    },
};

let schema = buildSubgraphSchema([{typeDefs, resolvers}]);

const server = new ApolloServer({
    schema,
    formatError: (err) => {
        // Don't give the specific errors to the client.
        if (err.message.startsWith('TBD')) {
            return new Error('Internal server error');
        }
        // Otherwise return the original error. The error can also
        // be manipulated in other ways, as long as it's returned.
        return err;
    },
});

// The `listen` method launches a web server.
server.listen(5002).then(({url}) => {
    console.log(`Started the Subgraph 3 ${JSON.stringify(url)}`)
});
