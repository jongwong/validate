const { resolve } = require("path");

module.exports = function(env) {
  let config = {
    entry: {
      index: "./src/index.ts",
      "index.browser": "./src/index.browser.ts"
    },
    output: {
      path: resolve("./dist"),
      filename: "[name].min.js"
    },
    mode: env.NODE_ENV,
    watch: env.NODE_ENV == "development",
    devtool: env.NODE_ENV == "development" ? "inline-source-map" : undefined,
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    module: {
      rules: [{ test: /\.tsx?$/, use: [{
          loader: 'ts-loader',
          options: {
            configFile: resolve(__dirname,'./tsconfig.json')
          }
        }] }]
    },
    plugins: []
  };
  return config;
};
