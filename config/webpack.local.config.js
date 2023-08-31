const path = require('path');
const fs = require('fs');
const { rimrafSync } = require('rimraf');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');

const {
  NODE_ENV: MODE,
  _BUILD_DIST_DIR: DIST_DIR,
  _BUILD_HOST: HOST,
  _BUILD_PUBLIC_PATH: PUBLIC_PATH,
  _BUILD_OPEN_PATH: OPEN_PATH,
  _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME,
  _BUILD_PORT: PORT,
  _BUILD_SRC_DIR: SRC_DIR,
  _BUILD_STATIC_DIR: STATIC_DIR,
  _BUILD_UI_NAME: UI_NAME
} = setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

console.info(`\nCleaning output directory...\n\t${DIST_DIR}\n`);
rimrafSync(DIST_DIR);

module.exports = merge(
  {
    plugins: [
      ...setupWebpackDotenvFilesForEnv({
        directory: RELATIVE_DIRNAME,
        env: MODE
      }),
      new ESLintPlugin({
        context: SRC_DIR,
        failOnError: false
      })
    ]
  },
  {
    entry: {
      app: path.join(SRC_DIR, 'index.js')
    },
    output: {
      filename: '[name].bundle.js',
      path: DIST_DIR,
      publicPath: PUBLIC_PATH,
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)?$/,
          include: [SRC_DIR],
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          include: input => input.indexOf('fonts') > -1 || input.indexOf('pficon') > -1,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]'
          }
        },
        {
          test: /\.svg$/i,
          include: input => input.indexOf('fonts') === -1 || input.indexOf('pficon') === -1,
          type: 'asset',
          parser: {
            dataUrlCondition: { maxSize: 5000 }
          },
          generator: {
            dataUrl: content => svgToMiniDataURI(content.toString()),
            filename: 'images/[hash][ext][query]'
          }
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: { maxSize: 5000 }
          },
          generator: {
            filename: 'images/[hash][ext][query]'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }
      ]
    },
    mode: MODE,
    devtool: 'eval-source-map',
    devServer: {
      ...((OPEN_PATH && { open: [OPEN_PATH] }) || {}),
      host: HOST,
      port: PORT,
      compress: true,
      historyApiFallback: true,
      hot: true,
      devMiddleware: {
        // stats: 'errors-only',
        writeToDisk: false
      },
      client: {
        overlay: false,
        progress: false
      },
      static: {
        directory: DIST_DIR
      },
      watchFiles: {
        paths: ['src/**/*', 'public/**/*']
      }
    },
    plugins: [
      ...setupWebpackDotenvFilesForEnv({
        directory: RELATIVE_DIRNAME
      }),
      new HtmlWebpackPlugin({
        ...((UI_NAME && { title: UI_NAME }) || {}),
        template: path.join(STATIC_DIR, 'index.html')
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: /%([A-Z_]+)%/g,
          replacement: (match, $1) => process.env?.[$1] || match
        }
      ]),
      ...(() => {
        try {
          const fileResults = fs
            .readdirSync(STATIC_DIR)
            ?.filter(fileDir => !/^(\.|index)/.test(fileDir))
            ?.map(fileDir => ({
              from: path.join(STATIC_DIR, fileDir),
              to: path.join(DIST_DIR, fileDir)
            }));

          return (
            (fileResults?.length > 0 && [
              new CopyPlugin({
                patterns: fileResults
              })
            ]) ||
            []
          );
        } catch (e) {
          console.error(`./config/webpack.common.js copy plugin error: ${e.message}`);
          return [];
        }
      })(),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css'
      })
    ],
    resolve: {
      symlinks: false,
      cacheWithContext: false
    }
  }
);
