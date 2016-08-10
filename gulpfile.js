const gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');


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

gulp.task('watch', ['es6'], function () {
    gulp.watch(['src/js/*.js'], ['es6']);
});

// 默认任务
gulp.task('default', function () {
    gulp.run('watch');
});