// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var  url="http://localhost:8080"

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9606,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/register': {
            target: url+"/user/register",
            changeOrigin:true,
            pathRewrite: {
                '^/register': '/'
            }
        },
        '/login': {
            target: url+"/user/login",
            changeOrigin:true,
            pathRewrite: {
                '^/login': '/'
            }
        },
        '/modifyPassword': {
            target: url+"/user/modifyPassword",
            changeOrigin:true,
            pathRewrite: {
                '^/modifyPassword': '/'
            }
        },
        '/queryUserByContent': {
            target: url+"/user/queryUserByContent",
            changeOrigin:true,
            pathRewrite: {
                '^/queryUserByContent': '/'
            }
        },
        '/queryParkByParkName': {
            target: url+"/park/queryParkByParkName",
            changeOrigin:true,
            pathRewrite: {
                '^/queryParkByParkName': '/'
            }
        },
        '/chargeStrategyByContent': {
            target: url+"/chargeStrategy/chargeStrategyByContent",
            changeOrigin:true,
            pathRewrite: {
                '^/chargeStrategyByContent': '/'
            }
        },
        '/queryUser': {
            target: url+"/user/queryUser",
            changeOrigin:true,
            pathRewrite: {
                '^/queryUser': '/'
            }
        },
        '/queryCar': {
            target: url+"/car/queryCar",
            changeOrigin:true,
            pathRewrite: {
                '^/queryCar': '/'
            }
        },
        '/allParkDailyIncome': {
            target: url+"/charge/allParkDailyIncome",
            changeOrigin:true,
            pathRewrite: {
                '^/allParkDailyIncome': '/'
            }
        },
        '/allPark': {
            target: url+"/park/allPark",
            changeOrigin:true,
            pathRewrite: {
                '^/allPark': '/'
            }
        },
        '/addCar': {
            target: url+"/car/addCar",
            changeOrigin:true,
            pathRewrite: {
                '^/addCar': '/'
            }
        },
        '/addPark': {
            target: url+"/park/addPark",
            changeOrigin:true,
            pathRewrite: {
                '^/addPark': '/'
            }
        },
        '/editPark': {
            target: url+"/park/editPark",
            changeOrigin:true,
            pathRewrite: {
                '^/editPark': '/'
            }
        },
        '/deletePark': {
            target: url+"/park/deletePark",
            changeOrigin:true,
            pathRewrite: {
                '^/deletePark': '/'
            }
        },
        '/queryPlace': {
            target: url+"/place/queryPlace",
            changeOrigin:true,
            pathRewrite: {
                '^/queryPlace': '/'
            }
        },
        '/addPlace': {
            target: url+"/place/addPlace",
            changeOrigin:true,
            pathRewrite: {
                '^/addPlace': '/'
            }
        },
        '/deletePlace': {
            target: url+"/place/deletePlace",
            changeOrigin:true,
            pathRewrite: {
                '^/deletePlace': '/'
            }
        },
        '/allChargeStrategy': {
            target: url+"/chargeStrategy/allChargeStrategy",
            changeOrigin:true,
            pathRewrite: {
                '^/allChargeStrategy': '/'
            }
        },
        '/addChargeStrategy': {
            target: url+"/chargeStrategy/addChargeStrategy",
            changeOrigin:true,
            pathRewrite: {
                '^/addChargeStrategy': '/'
            }
        },
        '/editChargeStrategy': {
            target: url+"/chargeStrategy/editChargeStrategy",
            changeOrigin:true,
            pathRewrite: {
                '^/editChargeStrategy': '/'
            }
        },
        '/deleteChargeStrategy': {
            target: url+"/chargeStrategy/deleteChargeStrategy",
            changeOrigin:true,
            pathRewrite: {
                '^/deleteChargeStrategy': '/'
            }
        },
        '/queryChargeStrategy': {
            target: url+"/chargeStrategy/queryChargeStrategy",
            changeOrigin:true,
            pathRewrite: {
                '^/queryChargeStrategy': '/'
            }
        },
        '/queryDailyIncome': {
            target: url+"/charge/queryDailyIncome",
            changeOrigin:true,
            pathRewrite: {
                '^/queryDailyIncome': '/'
            }
        },
        '/queryParkIncome': {
            target: url+"/charge/queryParkIncome",
            changeOrigin:true,
            pathRewrite: {
                '^/queryParkIncome': '/'
            }
        },
        '/queryParkByContent': {
            target: url+"/park/queryParkByContent",
            changeOrigin:true,
            pathRewrite: {
                '^/queryParkByContent': '/'
            }
        },
        '/allCommentary': {
            target: url+"/commentary/allCommentary",
            changeOrigin:true,
            pathRewrite: {
                '^/allCommentary': '/'
            }
        },
        '/queryCommentary': {
            target: url+"/commentary/queryCommentary",
            changeOrigin:true,
            pathRewrite: {
                '^/queryCommentary': '/'
            }
        },
        '/deleteCommentary': {
            target: url+"/commentary/deleteCommentary",
            changeOrigin:true,
            pathRewrite: {
                '^/deleteCommentary': '/'
            }
        },
        '/deployCoupon': {
            target: url+"/coupon/deployCoupon",
            changeOrigin:true,
            pathRewrite: {
                '^/deployCoupon': '/'
            }
        }
        ,
        '/nf': {
            target: url+"/chat/nf",
            changeOrigin:true,
            pathRewrite: {
                '^/nf': '/'
            }
        }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
