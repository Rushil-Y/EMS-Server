const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { dbConnect } = require("./dbConnect");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./GqlSchema");
const resolvers = require("./GqlResolvers");

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * CORS
 */
const allowedOrigins = [
  "https://rushils-ems-ui.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked origin: " + origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/**
 * Basic routes
 */
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("EMS Server running. Use /graphql");
});

app.get("/health", (req, res) => res.json({ ok: true }));

const apollo = new ApolloServer({ typeDefs, resolvers });

let apolloStarted = false;
let initPromise = null;

async function init() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await dbConnect();

    if (!apolloStarted) {
      await apollo.start();
      apollo.applyMiddleware({ app, path: "/graphql", cors: false });
      apolloStarted = true;
    }
  })();

  return initPromise;
}

// Local dev: start normally
if (require.main === module) {
  init()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`App is running : http://localhost:${PORT}/`);
        console.log(
          `GraphQL endpoint : http://localhost:${PORT}${apollo.graphqlPath}`
        );
      });
    })
    .catch((err) => console.error("Init error:", err));
}

module.exports = { app, init };
