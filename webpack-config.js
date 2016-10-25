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
//TODO 放在配置文件内通过传参决定html的hash是否添加
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
    var cssName = isDev ? 'css/[name].css' : 'css/[name]-[contenthash].css';
    var cssExtractTextPlugin = new ExtractTextPlugin(cssName, {
        disable: false,
        allChunks: false //不将所有的文件都打包到一起
    });
    return {
        watch: isWatch,
        cache: isWatch,
        devtool: isDev ? "#inline-source-map" : null,//eval-source-map / source-map
        //TODO 添加公共模块的 more -> one 文件(公共模块：库文件 + 公共js)
        entry: entries,
        output: {
            path: path.join(__dirname, 'bundle'),
            publicPath: '/webpack-frame2/bundle/',
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
                /*{
                    test: /\.css$/,
                    loader: isDev ? 'style!css' : cssExtractTextPlugin.extract('style', ['css'])
                },*/
                {
                    test: /\.less$/,
                    loader: isDev ? cssExtractTextPlugin.extract(
                        'css?sourceMap!' +
                        'less?sourceMap'
                    ) : cssExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
                },
                {
                    test: /\.tpl$/,
                    loader: 'tmodjs-loader'
                },
                {
                    test: /\.(png|jpeg|jpg|gif)$/,
                    //loader: 'url?limit=8192&name=img/[hash:8]-[name].[ext]'
                    loader: 'url?limit=8192&name=img/[name].[ext]'
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
            var pluginsArr = [];
            if (isDev) {
                pluginsArr.push(
                    new webpack.optimize.CommonsChunkPlugin({
                        name: "vendor",
                        filename: "js/vendor.js",
                        minChunks: Infinity
                    }), cssExtractTextPlugin);
            }
            return pluginsArr.concat(htmlPlugin);
        })(),
        externals: {
            'jquery': '$'
        }
    }
};
