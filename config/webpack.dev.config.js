const {
  // babelLoaderResolve,
  cssLoaderResolve,
  sassLoaderResolve,
  tsLoaderResolve,
  EslintWebpackPlugin,
  MiniCssExtractPlugin
} = require('weldable/lib/packages');

module.exports = ({ SRC_DIR, MOCK_PORT } = {}) => ({
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js)?$/,
        include: [SRC_DIR],
        use: [tsLoaderResolve]
      },
      {
        test: /\.(sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, cssLoaderResolve, sassLoaderResolve]
      }
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      context: SRC_DIR,
      failOnError: false
    })
  ],
  devServer: {
    proxy: [
      {
        context: ['/api'],
        target: `http://localhost:${MOCK_PORT}`,
        secure: false
      }
    ]
  }
});
