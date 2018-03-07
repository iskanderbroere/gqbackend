const { GraphQLServer } = require('graphql-yoga')
const { Engine } = require('apollo-engine')
const { Prisma } = require('prisma-binding')
const compression = require('compression')
const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: process.env.NODE_ENV === 'development'
    })
  })
})

const engine = new Engine({
  engineConfig: { 
    apiKey: process.env.APOLLO_ENGINE_KEY,
    "stores": [
      {
        "name": "publicResponseCache",
        "inMemory": {
          "cacheSize": 10485760
        }
      }
    ],
    "queryCache": {
      "publicFullQueryStore": "publicResponseCache"
    }
  },
  endpoint: '/',
  // graphqlPort: parseInt(process.env.PORT, 10) || 4000
  graphqlPort: 4000
})
engine.start()

server.express.use(compression())
server.express.use(engine.expressMiddleware())

const options = {
  cors: {
    origin: "http://localhost:3000"
  },
  playground: "/playground",
  tracing: true,
  cacheControl: true
}

server.start(options, ({port}) => console.log(`Server is running on http://localhost:${port}`))
