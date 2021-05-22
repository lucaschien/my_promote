var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var program = require('commander')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

//此處修改原本發佈產品時固定走 config.build.assetsPublicPath 的規則, 改依照 commander 指令的參數而定 lucas
program.option('-a, --api_env [env]', 'Which api env to use')
.parse(process.argv);

console.log('NODE_ENV...', process.env.NODE_ENV);

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    //path: config.build.assetsRoot,
    path: (config[program.api_env])
      ? config[program.api_env].assetsRoot
      : config.build.assetsRoot,
    filename: '[name].js',
    // publicPath: process.env.NODE_ENV === 'production'
    //   ? config.build.assetsPublicPath
    //   : config.dev.assetsPublicPath
    publicPath: (config[program.api_env])
      ? config[program.api_env].assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'common': resolve('src/common')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:7].[ext]',
            //publicPath: '../../',
            // publicPath: process.env.NODE_ENV === 'production'? config.build.assetsPublicPath : '../../',
            /* publicPath: process.env.NODE_ENV === 'production'?
              config[program.api_env].assetsPublicPath + config[program.api_env].assetsSubDirectory : '../../', */
            publicPath: config[program.api_env].STATIC_PATH,
            outputPath: utils.assetsPath('img/')
          }
        }
      },
      {
        test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:7].[ext]',
            // publicPath: '../../',
            // publicPath: process.env.NODE_ENV === 'production'? config.build.assetsPublicPath+'/static/fonts/' : '/static/fonts/',
            publicPath: process.env.NODE_ENV === 'production'?
              config[program.api_env].assetsPublicPath + config[program.api_env].assetsSubDirectory + '/fonts/' : '/static/fonts/',
            outputPath: utils.assetsPath('fonts/')
          }
        }
      }
    ]
  }
}
