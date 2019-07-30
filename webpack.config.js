const devMode = process.env.NODE_ENV.substr(0, 4) !== 'prod';
const prodMode = !devMode;
const mode = devMode ? 'development' : 'production';
const sufix = devMode ? '' : '.min';
console.log('Mode: ' + mode);

const path = require('path');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = {
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    hot: true,
    port: 3000,
  },
  entry: './src/index.js',
  mode,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          // {loader: MiniCssExtractPlugin.loader, options: {hmr: devMode}},
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'sass-loader'},
        ],
      },
      {
        test: /\.less$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'less-loader'}, // compiles Less to CSS
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
  output: {
    path: __dirname + '/build',
    filename: `app${sufix}.js`,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: prodMode ? 'prod.html' : 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: `app${sufix}.css`,
    }),
    new VueLoaderPlugin(),
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
}

if (prodMode) {
  config.plugins.push(
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    })
  );
}

module.exports = config
