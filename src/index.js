const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
      secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
      debug: process.env.NODE_ENV === 'development' ? true : false // log all GraphQL queries & mutations
    })
  })
})

const options = {
  cors: {
    origin: process.env.NODE_ENV === 'development' ? "http://localhost:3000" : false
  },
  playground: "/playground"
}

server.start(options, ({port}) => console.log(`Server is running on http://localhost:${port}`))
