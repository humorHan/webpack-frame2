//TODO 删除文件夹
//TODO img处理

var gulp = require('gulp');
var webpack = require('webpack');
var gulpUtil = require('gulp-util');
var webpackConfig = require('./webpack-config.js');
gulp.task('build', function (done) {
    webpack(webpackConfig(true, true), function(err, stats) {
        if (err) {
            throw new gulpUtil.PluginError('webpack', err);
        }
        gulpUtil.log('[webpack]', stats.toString({colors: true}));
    done();
    });
});
