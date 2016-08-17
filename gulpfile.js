const gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();  //自动同步



// Load plugins
const $ = require('gulp-load-plugins')();

/* es6 */
gulp.task('es6', function () {
    return gulp.src('src/js/*.js')
        .pipe($.plumber())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js/'));
});
// // 自动同步
gulp.task('browser-sync',function () {
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js'
    ];
//代理模式（本地服务器）
    browserSync.init(files,{
        proxy: 'http://localhost:63342/slide/index.html?_ijt=v3685kgrfvqbuvtov860rg0s44',
    });
//本地静态文件
//     browserSync.init(files, {
//         server: {
//             baseDir: './src'   //该路径到html的文件夹目录
//         }
//     });
});

gulp.task('watch', ['es6'], function () {
    gulp.watch(['src/js/*.js'], ['es6']);
});

// 默认任务
gulp.task('default', function () {
    gulp.run('watch','browser-sync');
});