const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');
const { buildSubgraphSchema } = require('@apollo/subgraph')

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

const server = new ApolloServer({
    schema: buildSubgraphSchema({
        typeDefs,
        resolvers
    })
});

// Note the top-level await!
startStandaloneServer(server, {listen: 3002}).then(url => {
    console.log(`🚀  Odi Server ready at ${JSON.stringify(url)}`);
});
