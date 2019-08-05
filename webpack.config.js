/**
 * This configuration allows to handle 3 types of compilations:
 * + Compile in production mode
 * + Compile in developer mode
 * + Serve in developer mode
 * Serve in a separate folder, allowing a clean build folder
 */

const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function env(name) { return (process.env.NODE_ENV||'').includes(name); }
const mode = env('prod') ? 'prod' : 'dev';

const css = require('./webpack.css');
const path = require('path').resolve(__dirname, env('serve') ? 'serve' : 'build');
const config = {
  dev: merge.smart(
    {
      mode: 'development',
      devtool: 'eval-cheap-module-source-map',
      plugins: [
        new HtmlWebpackPlugin({
          template: './src/index.html',
          filename: 'dev.html',
        }),
      ],
    },
    css({path, filename: 'style.css', hmr: true}),
  ),
  prod: merge.smart(
    {
      mode: 'production',
      output: {filename: '[name].min.js'},
      plugins: [
        new HtmlWebpackPlugin({
          template: './src/index.html',
          filename: 'index.html',
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.min\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          canPrint: true,
        }),
      ],
    },
    css({path, filename: 'style.min.css'}),
  ),
  serve: {
    entry: {serve: './src/serve.js'},
    devServer: {
      contentBase: path,
      historyApiFallback: true,
      hot: true,
      port: 3000,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
    watch: true,
    watchOptions: {
      aggregateTimeout: 600,
      ignored: /node_modules/,
      poll: 1000,
    },
  },
  common: {
    entry: {index: './src/index.js'},
    output: {
      path,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(c|le|s[ac])ss$/,
          use: [
            'css-loader',
            'sass-loader',
            'less-loader',
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
    ],
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
    },
  },
};

console.log('Mode:', process.env.NODE_ENV);

if (env('serve')) {
  //dev server
  module.exports = merge.smart(config.common, config.dev, config.serve);
} else if (env('build')) {
  //build both compilations
  module.exports = ['dev', 'prod'].map(mode => merge.smart(config.common, config[mode]));
} else {
  //run development or production
  module.exports = merge.smart(config.common, config[mode]);
}
