const { app, init } = require("../server/main");

module.exports = async (req, res) => {
  await init();
  return app(req, res);
};
