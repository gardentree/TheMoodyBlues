const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  plugins: [new webpack.EnvironmentPlugin(["CONSUMER_KEY", "CONSUMER_SECRET"])],
};
