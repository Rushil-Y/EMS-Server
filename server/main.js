const express = require("express");
const { dbConnect } = require("./dbConnect");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./GqlSchema");
const resolvers = require("./GqlResolvers");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

// application middlewares
app.use(express.static("public"));

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

async function startServer() {
    await dbConnect();
    await server.start().then(() => {
        server.applyMiddleware({ app, path: '/graphql' });
    }).catch((error) => console.error(error));
}

startServer();

// application port
app.listen(PORT, () => {
    console.log(`App is running : http://localhost:${PORT}/`);
})