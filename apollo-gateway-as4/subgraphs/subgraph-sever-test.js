const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');
const { buildSubgraphSchema } = require('@apollo/subgraph')

const delay = delayTime => new Promise((resolve) => setTimeout(resolve, delayTime));

const typeDefs = gql`
    type Query {
        listTestTeams: [TEST]
    }

    type TEST {
        id: ID!
        name: String
    }
`;

const resolvers = {
    Query: {
        async listTestTeams() {
            await delay(3000);
            return [{id: '1', name: 'India'},
                {id: '2', name: 'Australia'},
                {id: '3', name: 'England'},
                {id: '4', name: 'South Africa'},
                {id: '5', name: 'New Zealand'},
                {id: '6', name: 'Pakistan'},
                {id: '7', name: 'Sri Lanka'},
                {id: '8', name: 'West Indies'},
                {id: '9', name: 'Bangladesh'},
                {id: '10', name: 'Zimbabwe'}
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
startStandaloneServer(server, {listen: 3001}).then(url => {
    console.log(`🚀  Test Server ready at ${JSON.stringify(url)}`);
});
