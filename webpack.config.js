const devMode = process.env.NODE_ENV.substr(0, 4) !== 'prod';
const prodMode = !devMode;
const mode = devMode ? 'development' : 'production';
const sufix = devMode ? '' : '.min';
console.log('Mode: ' + mode);

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = {
  devServer: {port: 3000},
  entry: './src/app.js',
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
    ],
  },
  output: {
    path: __dirname + '/build',
    filename: `app${sufix}.js`,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: prodMode ? 'index.html' : 'dev.html',
    }),
    new MiniCssExtractPlugin({
      filename: `app${sufix}.css`,
    }),
  ],
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
