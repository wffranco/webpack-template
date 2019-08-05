const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({
  path: publicPath,
  filename,
  hmr = false,
}) => ({
  module: {
    rules: [{
      test: /\.(c|le|s[ac])ss$/,
      use: [
        {loader: MiniCssExtractPlugin.loader, options: {publicPath, hmr}},
        'css-loader',
        'less-loader',
        'sass-loader',
      ],
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({filename}),
  ],
});
