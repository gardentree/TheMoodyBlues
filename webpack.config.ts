import * as path from "path";
import {default as webpack, Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import dotenv from "dotenv";
import {Command} from "commander";

dotenv.config();

const mode = (() => {
  const program = new Command();

  program.option("--mode <value>", "compile mode", "development");
  program.parse(process.argv);

  return program.opts().mode;
})();
console.log(`mode: ${mode}`);

const typescript = {
  test: /\.tsx?$/,
  use: {
    loader: "ts-loader",
    options: {
      configFile: `tsconfig/${mode}.json`,
    },
  },
};

const main: Configuration = {
  mode: mode,
  target: "electron-main",
  entry: {
    main: "./src/main/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./build"),
    clean: true,
  },
  module: {
    rules: [typescript],
  },
  resolve: {
    fallback: {
      assert: false,
      constants: false,
      http: false,
      https: false,
      os: false,
      path: false,
      querystring: false,
      stream: false,
      url: false,
      util: false,
    },
  },
};
const renderer: Configuration = {
  mode: mode,
  target: "electron-renderer",
  entry: {
    renderer: "./src/renderer/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./build"),
  },
  module: {
    rules: [
      typescript,
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    fallback: {
      assert: false,
      constants: false,
      http: false,
      https: false,
      os: false,
      path: false,
      querystring: false,
      stream: false,
      url: false,
      util: false,
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html",
      filename: "index.html",
    }),
    new webpack.EnvironmentPlugin(["CONSUMER_KEY", "CONSUMER_SECRET"]),
  ],
};

export default [main, renderer];
