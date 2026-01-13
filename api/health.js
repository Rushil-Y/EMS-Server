const { app, init } = require("../server/main");

module.exports = async (req, res) => {
  await init().catch(() => {});
  req.url = "/health";
  return app(req, res);
};
