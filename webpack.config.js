const fs = require("fs");

const env = process.env.NODE_ENV || "development";
const isDev = env === "development";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const outputPath = path.resolve(__dirname, "dist");

//template 下の、複数の ejs ファイルを読み込む
let htmlPageNames = [];
const pages = fs.readdirSync("./src/template");
pages.forEach((page) => {
  if (page.endsWith(".ejs")) {
    htmlPageNames.push(page.split(".ejs")[0]);
  }
});
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/template/${name}.ejs`,
    filename: `${name}.html`,
  });
});

module.exports = {
  mode: env,

  entry: "./index.js",

  output: {
    path: outputPath,
    filename: "[name].js",
    assetModuleFilename: "images/[name][ext]",
  },

  target: isDev ? "web" : "browserslist",
  //webpack-dev-server@3 では browserslist を指定すると HMR が機能しない

  devtool: isDev ? "eval-cheap-source-map" : false,

  devServer: {
    contentBase: path.join(__dirname, "./src/template"),
    watchContentBase: true,
    hot: true,
    open: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { useBuiltIns: "usage", corejs: "3" }],
            ],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.ejs$/i,
        use: ["html-loader", "template-ejs-loader"],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { url: false, importLoaders: 2 },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets",
          to: "",
        },
      ],
    }),
  ].concat(multipleHtmlPlugins),
};
