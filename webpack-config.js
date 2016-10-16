/**
 * Created by humorHan on 2016/6/17.
 */
var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var jsDir = path.resolve(__dirname, 'js');
var htmlDir = path.resolve(__dirname, 'html');
var node_modules = path.resolve(__dirname, 'node_modules');

//入口文件
var entries = (function(){
    var entryJs = glob.sync(jsDir + '/*.js'),
        map = {};
    entryJs.forEach(function(filePath){
        var fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[fileName] = filePath;
    });
    return map;
})();

//html
var htmlPlugin = (function(){
    var entryHtml = glob.sync(htmlDir + '/*.html');
    var tempArr = [];
    entryHtml.forEach(function(filePath){
        var fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        var conf = {
            template: filePath,
            filename: 'html/' + fileName + '.html'
        };
        if (fileName in entries) {
            conf.inject = 'body';
            conf.chunks = ['vendor', fileName]
        }
        tempArr.push(new HtmlWebpackPlugin(conf))
    });
    return tempArr;
})();

/**
 * webpack 配置
 * @param isWatch 监听模式包括watch和cache参数
 * @param isDev   调试模式 vs 线上
 */
module.exports = function(isWatch, isDev) {
    return {
        watch: isWatch,
        cache: isWatch,
        devtool: isDev ? "#inline-source-map" : null,//eval-source-map / source-map
        //TODO 添加公共模块的 more -> one 文件(公共模块：库文件 + 公共js)
        entry: entries,
        output: {
            path: path.join(__dirname, 'bundle'),
            publicPath: '/bundle/',
            filename: isDev ? "js/[name].js" : "js/[name]-[chunkhash].js",
            chunkFilename: isDev ? "js/[name]-chunk.js" : "js/[name]-chunk-[chunkhash].js"
        },
        resolve: {
            root: [path.join(__dirname, 'js'), path.join(__dirname, 'dep')],
            extensions:['.js','.tpl','.less','.json',''],
            modulesDirectories:['dep','tpl','node_modules'],
            alias: {
                'mock': path.join(__dirname, 'dep', 'mock.js')
            }
        },
        module: {
            loaders: [
                /*  {
                 test: /\.less$/,
                 //loader: 'style!css!less?sourceMap'
                 //loader: isDev ? ExtractTextPlugin.extract('style!css?sourceMap!less?sourceMap?sourceMap=inline?sourceMap') : ExtractTextPlugin.extract('style!css!less')
                 loader: ExtractTextPlugin.extract('css?sourceMap!' +
                 'less?sourceMap'
                 )
                 },*/
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
                },
                {
                    test: /\.tpl$/,
                    loader: 'tmodjs-loader'
                },
                {
                    test: /\.(png|jpeg|jpg|gif)$/,
                    loader: 'url?limit=8192&name=img/[hash:8].[name].[ext]'
                },
                {
                    test: /^es5-sham\.min\.js|es5-shim\.min\.js$/,
                    loader: 'script',
                    exclude: node_modules
                },
                {
                    test: /\.html$/,
                    //loader: 'html?minimize=false&interpolate=true',
                    loader: 'html'
                }
            ]
        },
        plugins: (function (){
            if (isDev) {
                return [
                    new webpack.optimize.CommonsChunkPlugin({
                        name: "vendor",
                        filename: "js/vendor.js",
                        minChunks: Infinity
                    }),
                    new ExtractTextPlugin('css/[name].css', {
                        disable: false,
                        allChunks: true
                    })
                ].concat(htmlPlugin);
            } else {
                return [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        },
                        output: {
                            comments: false
                        },
                        mangle: {
                            except: ['$', 'exports', 'require']
                        }
                    }),
                    new ExtractTextPlugin('css/[name]-[contenthash].css', {
                        disable: false,
                        allChunks: false
                    }),
                    new webpack.optimize.CommonsChunkPlugin({
                        name: "vendor",
                        filename: "vendor.js",
                        minChunks: 5 //Infinity
                    })
                ].concat(htmlPlugin);
            }
        })(),
        externals: {
            'jquery': '$'
        }
    }
};