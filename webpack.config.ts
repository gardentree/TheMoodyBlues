import * as path from "path";
import * as fs from "fs";
import {default as webpack, Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import dotenv from "dotenv";
import {Command} from "commander";

dotenv.config();

const mode = (() => {
  const program = new Command();

  program.allowUnknownOption().option("--mode <value>", "compile mode", "development").parse(process.argv);

  return program.opts().mode;
})();
console.log(`mode: ${mode}`);

const {compilerOptions} = JSON.parse(fs.readFileSync(path.resolve(__dirname, "tsconfig", `${mode}.json`), "utf8"));
function typescript(name: string) {
  return {
    test: /\.tsx?$/,
    use: {
      loader: "ts-loader",
      options: {
        configFile: path.resolve(__dirname, "src", name, "tsconfig.json"),
        compilerOptions: compilerOptions,
      },
    },
    include: [path.resolve(__dirname, "src", "shared"), path.resolve(__dirname, "src", name)],
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
      alias: {
        "@shared": path.resolve(__dirname, "src/shared"),
      },
    },
  };
}

const main: Configuration = {
  mode: mode,
  target: "electron-main",
  entry: {
    main: "./src/main/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./build"),
  },
  module: {
    rules: [typescript("main")],
  },
  plugins: [new webpack.EnvironmentPlugin(["CONSUMER_KEY", "CONSUMER_SECRET"])],
};
const preload: Configuration = {
  mode: mode,
  target: "electron-preload",
  entry: {
    preload: "./src/preload/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./build"),
  },
  module: {
    rules: [typescript("preload")],
  },
};
const renderer: any = {
  mode: mode,
  target: "web",
  entry: {
    renderer: "./src/renderer/index.tsx",
    preferences: "./src/renderer/preferences/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./build"),
  },
  module: {
    rules: [
      typescript("renderer"),
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "@actions": path.resolve(__dirname, "src/renderer/modules"),
      "@libraries": path.resolve(__dirname, "src/renderer/libraries"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html",
      filename: "index.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: "./src/renderer/preferences/index.html",
      filename: "preferences.html",
      inject: false,
    }),
  ],
  devServer: {
    static: path.join(__dirname, "./build"),
  },
  performance: {
    maxAssetSize: 1024 * 1024,
    maxEntrypointSize: 1024 * 1024,
  },
};

export default [main, preload, renderer];
