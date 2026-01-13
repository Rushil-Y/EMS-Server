const { app, init } = require("../server/main");

module.exports = async (req, res) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "https://rushils-ems-ui.vercel.app",
    "http://localhost:3000",
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await init();

  req.url = "/graphql";
  return app(req, res);
};
