const { join,resolve } = require('path');
const { compact } = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'PROD';
  const outputPath = join(__dirname, 'dist');
  return {
    context: process.cwd(),
    entry: resolve('src/index.tsx'),
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    bail: true,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    node: {
      __dirname: false
    },
    optimization: {
      concatenateModules: false,
      minimizer: isProd
        ? [
            new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: true,
              terserOptions: { output: { comments: false } }
            }),
            new OptimizeCssAssetsPlugin({
              cssProcessorOptions: {
                mergeIdents: true
              },
              cssProcessorPluginOptions: {
                preset: [
                  'default',
                  { discardComments: { removeAll: true }, mergeIdents: true }
                ]
              }
            })
          ]
        : [],
      runtimeChunk: 'single'
    },
    output: {
      filename: '[name].js',
      path: outputPath,
      publicPath: ''
    },
    module: {
      rules: [
        {
          test: new RegExp('\\.(j|t)sx?$'),
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                ['@babel/preset-env', { targets: { chrome: 75 } }],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                'lodash',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
                ['transform-react-remove-prop-types', { mode: 'wrap' }]
              ]
            }
          }
        },
        {
          test: /\.(woff2?|eot|ttf|png|jpg|gif|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 20000,
              fallback: 'file-loader'
            }
          }
        },
        {
          test: /\.css$/,
          use: createCssUse()
        },
        {
          test: /root.scss$/,
          use: createCssUse(true)
        },
        {
          test: /\.scss$/,
          exclude: /root.scss$/,
          use: createCssUse(true, true)
        },
        {
          test: /\.jsx?$/,
          use: 'source-map-loader',
          //exclude: /node_modules/,
          enforce: 'pre'
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        chunkFilename: '[name].css',
        filename: '[name].css'
      }),
      new LodashModuleReplacementPlugin({
        collections: true,
        paths: true,
        flattening: true
      }),
      new HtmlWebpackPlugin({
        template: join(__dirname, 'index.ejs'),
        title: 'Who Gives A Fuq',
        filename: 'index.html',
        //baseHref: key === 'core-widgets/index' ? '' : '<base href="../" />',
        minify: { collapseWhitespace: true }
      })
    ]
  };
};

function createCssUse(sass = false, modules = false) {
  return compact([
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: modules && {
          localIdentName: '[path][name]-[local]-[hash:base64:5]'
        }
      }
    },
    sass && 'sass-loader'
  ]);
}
