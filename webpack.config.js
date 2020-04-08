const argv = require("yargs").argv;
const mode = argv.production ? "production" : "development";

module.exports = {
  mode,
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
