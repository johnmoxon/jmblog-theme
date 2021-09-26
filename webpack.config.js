const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  resolve: {
    modules: ['node_modules'],
    alias: {
      Assets: path.resolve(__dirname, 'src/assets/'),
      Default: path.resolve(__dirname, 'src/default/'),
      Includes: path.resolve(__dirname, 'src/_includes/'),
      Layouts: path.resolve(__dirname, 'src/_layouts/'),
    }
  },
  mode: 'production',
  entry: {
    critical: "Assets/sass/critical.scss",
    // critical: './src/assets/sass/critical.scss',
    default: 'Default/js/index.js',
    vendor: 'Default/js/vendor.js',
    maintenance: './src/maintenance/js/index.js'
  },
  output: {
    path: path.resolve(__dirname, '_build'),
    filename: 'assets/js/[name].[fullhash].js',
    publicPath: '/'
  },
  
  devtool: false,
  plugins: [
    
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    new CopyPlugin({
      patterns: [
        
        // { from: 'src/admin', to: 'admin' },
        { from: 'src/assets', to: 'assets' },
        { 
          from: 'src/_includes', 
          to: '_includes', 
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ["**/default.html", "**/maintenance.html"],
          }
        },
        { from: 'src/_layouts', to: '_layouts' },

        { from: 'README.md', to: '.' },
        { from: 'LICENSE.txt', to: '.' },
        { from: 'Gemfile', to: '.' },
        { from: 'Gemfile.lock', to: '.' },
        { from: 'jmblog-theme.gemspec', to: '.' },
        { from: '_config.yml', to: '.' },

        // Helpful for development 
        { from: '_authors', to: '_authors' },
        { from: '_data', to: '_data' },
        // { from: '_drafts', to: '_drafts' }, // Used when symlinking in drafts 
        { from: '_pages', to: '_pages' },
        { from: '_posts', to: '_posts' },
        { from: 'index.html', to: '.' },


      ],
      options: {
        concurrency: 100,
      },
    }),
    new HtmlWebpackPlugin({
      title: 'default',
      hash: false,
      inject: false,
      scriptLoading: 'defer',
      chunks: [
        'critical',
        'default',
        'vendor',
      ],
      // excludeChunks:['critical'],
      template: './src/_includes/themes/jmblog-theme/theme/default.html',
      filename: '_includes/themes/jmblog-theme/theme/default.html',
      minify: 
      // false,
      {
        collapseWhitespace: false,
        removeComments: false,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        useShortDoctype: true
        
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Error page',
      hash: true,
      scriptLoading: 'defer',
      inject: true,
      chunks: ['maintenance'],
      template: './src/_includes/themes/jmblog-theme/theme/maintenance.html',
      filename: '_includes/themes/jmblog-theme/theme/maintenance.html',
      'meta': {
        // 'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        // 'theme-color': '#4285f4'
        // Will generate: <meta name="theme-color" content="#4285f4">
        // 'Content-Security-Policy': { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src https:' },
        // Will generate: <meta http-equiv="Content-Security-Policy" content="default-src https:">
        // Which equals to the following http header: `Content-Security-Policy: default-src https:`
        // 'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
        // Will generate: <meta http-equiv="set-cookie" content="value; expires=date; path=url">
        // Which equals to the following http header: `set-cookie: value; expires=date; path=url`
      },
      minify: {
        collapseWhitespace: false,
        removeComments: false,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        useShortDoctype: true
    
      }
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].[fullhash].css",  // it's gonna be 'critical.bundle.css' //then maybe home + everything else
      // chunkFilename: "assets/css/[id].css",
    }),
    new CompressionPlugin({
      filename: 'assets/css/[name].br', //this doesn't work because not all the assets are CSS, potentiall define different Compression plugins, unless there is a PATH option
      algorithm: 'brotliCompress',
      test: /\.(js|css|svg|woff|woff2)$/,
      compressionOptions: {
        // zlib’s `level` option matches Brotli’s `BROTLI_PARAM_QUALITY` option.
        level: 11,
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: 'assets/js/[name].js.map',
    //   exclude: ['vendor.bundle.js']
    // }),
  ],
  // devServer: {
  //   contentBase: './_build',
  //   compress:true,
  //   port: 9000,
  //   host: '0.0.0.0',
  //   hot: true,
  //   open: true,
  //   inline: true,
  // },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        // use: [MiniCssExtractPlugin.loader, "css-loader"],
        use: [
          MiniCssExtractPlugin.loader,  // one of the key incredients!
          "css-loader",
          'sass-loader', // Compiles Sass to CSS
          // 'style-loader', // create `style` nodes from JS strings
          // 'css-loader', // Translates CSS into CommonJS
        ]
      },
      {
        test: /\.(png|svg|jpeg|jpg|gif)$/,
        type: 'asset/resource'
      },
    ],
  },
};
