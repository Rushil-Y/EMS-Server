const express = require("express");
require("dotenv").config();

const { dbConnect } = require("./dbConnect");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./GqlSchema");
const resolvers = require("./GqlResolvers");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

app.get("/health", (req, res) => res.json({ ok: true }));

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
});

let apolloStarted = false;

async function init() {
  // Connect to MongoDB Atlas
  await dbConnect();

  if (!apolloStarted) {
    await apollo.start();
    apollo.applyMiddleware({ app, path: "/graphql" });
    apolloStarted = true;
  }
}

init().catch((err) => console.error("Init error:", err));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App is running : http://localhost:${PORT}/`);
    console.log(
      `GraphQL endpoint : http://localhost:${PORT}${apollo.graphqlPath}`
    );
  });
}

module.exports = app;
