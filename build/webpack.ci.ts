import * as path from 'path';
import * as webpack from 'webpack';
import { PackageManifestWebpackPlugin } from './package-manifest-webpack-plugin';

const webpackNodeExternals = require('webpack-node-externals');

const production = process.env.NODE_ENV === 'production';

export default {
  target: 'node',
  devtool: 'source-map',
  externals: [
    webpackNodeExternals()
  ],
  entry: {
    'index': './src/arbor-ci/index.ts',
    'arbor': './src/arbor/index.ts'
  },
  output: {
    path: path.resolve('./dist/arbor-ci'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: { configFileName: './src/arbor-ci/tsconfig.json' }
        }
      }
    ]
  },
  plugins: [
    new PackageManifestWebpackPlugin('./src/arbor-ci/package.json'),
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    ...(production ? [new webpack.NoEmitOnErrorsPlugin()] : [])
  ]
} as webpack.Configuration;
