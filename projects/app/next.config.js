require('dotenv').config()

const webpack = require("webpack");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const optimizedImages = require("next-optimized-images");
const withTM = require('next-transpile-modules');

var ASSET_PREFIX = process.env.ASSET_PREFIX || '';

console.log({ASSET_PREFIX});

module.exports = withPlugins(
  [
    [
      withCSS,
      {
        cssLoaderOptions: {
          url: false
        }
      }
    ],
    [optimizedImages],
    [withTM, {
      transpileModules: []
    }],
  ],
  {
    assetPrefix: ASSET_PREFIX,
    distDir: '.build',
    exportTrailingSlash: true,
    webpack: config => {
      config.optimization.minimizer = [config.optimization.minimizer[0]];

      if (!config.isServer) {
        config.node = {
          fs: 'empty'
        }
      }

      config.module.rules.push(
        {
          type: 'javascript/auto',
          test: /\.mjs$/,
          use: [],
        },
      );
      
      config.plugins = config.plugins || []
      config.plugins = [
        ...config.plugins,

        new Dotenv({
          path: path.join(__dirname, '.env'),
          systemvars: true
        }),

        new webpack.IgnorePlugin(/\.flow$/),
      ]
  
      return config;
    },
  },
);
