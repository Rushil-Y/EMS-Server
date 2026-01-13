const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { dbConnect } = require("./dbConnect");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./GqlSchema");
const resolvers = require("./GqlResolvers");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://rushils-ems-ui.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server / Postman / Vercel health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked origin: " + origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/**
 * Static & health check
 */
app.use(express.static("public"));
app.get("/health", (req, res) => res.json({ ok: true }));

/**
 * Apollo GraphQL server
 */
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
});

let apolloStarted = false;

async function init() {
  await dbConnect();

  if (!apolloStarted) {
    await apollo.start();
    apollo.applyMiddleware({
      app,
      path: "/graphql",
      cors: false,
    });
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
