const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");

const deps = require("./package.json").dependencies;

module.exports = (_, argv) => ({
  output: {
    publicPath: "auto",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "product_detail",
      filename: "remoteEntry.js",
      remotes: {
        host: "host@http://localhost:3000/remoteEntry.js",
      },
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
          eager: true,
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: deps["react-router-dom"],
          eager: true,
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv(),
  ],
});
