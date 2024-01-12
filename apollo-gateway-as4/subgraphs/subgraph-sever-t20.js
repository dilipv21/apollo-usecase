const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');
const { buildSubgraphSchema } = require('@apollo/subgraph')
const delay = delayTime => new Promise((resolve) => setTimeout(resolve, delayTime));

const typeDefs = gql`
    type Query {
        listT2OTeams: [T20]
    }

    type T20 {
        id: ID!
        name: String
    }
`;

const resolvers = {
    Query: {
        async listT2OTeams() {
            await delay(1000);
            return [{id: '1', name: 'India'},
                {id: '2', name: 'England'},
                {id: '3', name: 'New Zealand'},
                {id: '4', name: 'Australia'},
                {id: '5', name: 'Pakistan'},
                {id: '6', name: 'South Africa'},
                {id: '7', name: 'West Indies'},
                {id: '8', name: 'Sri Lanka'},
                {id: '9', name: 'Bangladesh'},
                {id: '10', name: 'Afghanistan'}
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
startStandaloneServer(server, {listen: 3003}).then(url => {
    console.log(`🚀  T20 Server ready at ${JSON.stringify(url)}`);
});
