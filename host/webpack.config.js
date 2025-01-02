const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");

const deps = require("./package.json").dependencies;

const printCompilationMessage = require("./compilation.config.js");

module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:3000/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
    onListening: function (devServer) {
      const port = devServer.server.address().port;

      printCompilationMessage("compiling", port);

      devServer.compiler.hooks.done.tap("OutputMessagePlugin", (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage("failure", port);
          } else {
            printCompilationMessage("success", port);
          }
        });
      });
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
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        "product-detail": "product_detail@http://localhost:3001/remoteEntry.js",
        "shopping-cart": "shopping_cart@http://localhost:3002/remoteEntry.js",
        auth: "auth@http://localhost:3003/remoteEntry.js",
        search: "search@http://localhost:3004/remoteEntry.js",
        orders: "orders@http://localhost:3005/remoteEntry.js",
      },
      exposes: {
        "./router": "./src/router.ts",
        "./hooks": "./src/store/hooks.ts",
        "./store/slices/authSlice": "./src/store/slices/authSlice.ts",
        "./utils": "./src/utils/formatters.ts",
        "./store/slices/cartSlice": "./src/store/slices/cartSlice",
        "./store/slices/productSlice": "./src/store/slices/productSlice",
        "./store/slices/searchSlice": "./src/store/slices/searchSlice.ts",
        "./store/slices/orderSlice": "./src/store/slices/orderSlice.ts",
        "./Components/ProductItem": "./src/Components/ProductItem.tsx",
        "./Components/HomeLayout": "./src/Components/HomeLayout.tsx",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        "react-router-dom": {
          singleton: true,
          requiredVersion: deps["react-router-dom"],
        },
        "@reduxjs/toolkit": { singleton: true },
        "redux-persist": { singleton: true },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv(),
  ],
});
