/*
/!**
 * Created by humorHan on 2016/6/17.
 *!/
var webpackConfig = require('./webpack-config.js');

var webpack = require('webpack-stream');

var gulp = require('gulp');

var path = require('path');

var plumber = require('gulp-plumber'); //捕获出错问题 接收errorHandler参数

var named = require('vinyl-named');

var minifycss = require('gulp-minify-css');

var minifyHTML = require("gulp-minify-html");

var del = require('del');

var vinylPaths = require('vinyl-paths');

var rev = require('gulp-rev');

var revCollector = require('gulp-rev-collector');

var less = require('gulp-less');

var less_source_maps = require('gulp-sourcemaps');

gulp.task("less-to-css",['publish-img'], function(){
    return gulp.src(path.join(__dirname, './less/!**!/!*.less'))
        .pipe(less_source_maps.init())
        .pipe(less())
        .pipe(less_source_maps.write('./maps'))
        .pipe(gulp.dest(path.join(__dirname, '/bundle/css/')));
});

gulp.task('watch:less-dev', function(){
    gulp.watch(path.join(__dirname , '/less/!**!/!*.less'), ['less-to-css']);
});

gulp.task('js-dev', ['publish-static-js'],function(){
    return gulp.src(path.join(__dirname, '/js/!**!/!*.js'))
        .pipe(named())
        .pipe(webpack(webpackConfig(true, true, false)))
        .pipe(gulp.dest(path.join(__dirname, '/bundle/js/')));
});

gulp.task('js', ['publish-static-js'],function(){
    return gulp.src(path.join(__dirname, '/js/!**!/!*.js'))
        .pipe(named())
        .pipe(webpack(webpackConfig(false, false, false)))
        .pipe(gulp.dest(path.join(__dirname, '/bundle/js/')));
});

gulp.task('publish-static-js',['less-to-css'],function(){
    return gulp.src([path.join(__dirname, '/dep/jquery-1.12.1.min.js')])
        .pipe(gulp.dest(path.join(__dirname, '/bundle/js/')));
});

gulp.task('publish-img',function(){
    return gulp.src(path.join(__dirname, '/img/!**!/!*.*'))
        .pipe(gulp.dest(path.join(__dirname, '/bundle/img/')));
});

//测试包(不压缩 不版本化 且开启调试模式)
gulp.task('bundle',['js-dev','watch:less-dev']);

//测试包(不压缩 不版本化)
gulp.task('pack',['js']);

//正式包
gulp.task('package', ['rev-css']);

gulp.task('rev-css', ['rev-js'], function(){
    return gulp.src([path.join(__dirname, '/mfg/rev/!*.json'), path.join(__dirname, '/mfg/bundle/css/!**!/!*.css')])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(path.join(__dirname, '/mfg/bundle/css')))
});

//修改js中引用地址
gulp.task('rev-js', ['rev-html'], function(){
    return gulp.src([path.join(__dirname, '/mfg/rev/!*.json'), path.join(__dirname, '/mfg/bundle/js/!**!/!*.js')])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(path.join(__dirname, '/mfg/bundle/js')))
});

//修改html页面引用的css和js
gulp.task('rev-html', ['dist-img'], function(){
    return gulp.src([path.join(__dirname, '/mfg/rev/!*.json'), path.join(__dirname, '/mfg/html/!**!/!*.html')])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(path.join(__dirname, '/mfg/html/')))
});

gulp.task('dist-img',['compress-js'], function(){
    return gulp.src(path.join(__dirname, '/img/!**!/!*.*'))
        .pipe(rev())
        .pipe(gulp.dest(path.join(__dirname, '/mfg/bundle/img')))
        .pipe(rev.manifest('img.json'))
        .pipe(gulp.dest(path.join(__dirname, '/mfg/rev')));
});

gulp.task('compress-js',['dist-static-js'],function() {
    return gulp.src(path.join(__dirname, '/js/!**!/!*.js'))
        .pipe(named())
        .pipe(webpack(webpackConfig(false, false, true)))
        .pipe(rev())
        .pipe(gulp.dest(path.join(__dirname, '/mfg/bundle/js/')))
        .pipe(rev.manifest('js.json'))
        .pipe(gulp.dest(path.join(__dirname, '/mfg/rev')));
});

gulp.task('dist-static-js',['less'],function(){
    return gulp.src([path.join(__dirname, '/dep/jquery-1.12.1.min.js')])
        .pipe(gulp.dest(path.join(__dirname, '/mfg/bundle/js')));
});

gulp.task('less',['html'],function() {
    return gulp.src(path.join(__dirname, '/less/!**!/!*.less'))
        //.pipe(minifycss({keepBreaks:true,compatibility:'ie8,+spaceAfterClosingBrace'}))
        .pipe(less())
        .pipe(minifycss({keepBreaks:true}))
        .pipe(rev())
        .pipe(gulp.dest(path.join(__dirname, '/mfg/bundle/css/')))
        .pipe(rev.manifest('css.json'))
        .pipe(gulp.dest(path.join(__dirname, '/mfg/rev')));
});

gulp.task('html',['del-dist'],function() {
    //var opts = {comments:false,spare:true,quotes:true,collapseWhitespace: false,removeComments: true};
    return gulp.src(path.join(__dirname, '/html/!**!/!*.html'))
        //.pipe(minifyHTML(opts))
        .pipe(rev())
        .pipe(gulp.dest(path.join(__dirname, '/mfg/html')))
        .pipe(rev.manifest('html.json'))
        .pipe(gulp.dest(path.join(__dirname, '/mfg/rev')));
});

//删除上线文件
gulp.task('del-dist',function(){
    return gulp.src(path.join(__dirname,'mfg'), {read: false})
        .pipe(vinylPaths(del));
});*/

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