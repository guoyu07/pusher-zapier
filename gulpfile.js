var gulp = require('gulp');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var header = require('gulp-header');

var pkgInfo = require(__dirname + '/package.json');

gulp.task('build', function() {
  gulp.src(
    [
      './src/header.js',
      './src/dictionize.js',
      './src/index.js'
    ])
    .pipe(concat('pusher-zapier.js'))
    .pipe(header('// Pusher Zapier Library v' + pkgInfo.version + ' Created at ' + new Date() + '\n'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', ['build'], function () {
    return gulp.src('test/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});
