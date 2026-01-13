const app = require("../server/main");

module.exports = (req, res) => {
  return app(req, res);
};
