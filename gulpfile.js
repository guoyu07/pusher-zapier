var gulp = require('gulp');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');

gulp.task('build', function() {
  gulp.src(
    [
      './bower_components/cryptojslib/rollups/hmac-md5.js',
      './bower_components/cryptojslib/rollups/sha256.js',
      './src/crypto-wrapper.js',
      './src/index.js'
    ])
    .pipe(concat('pusher-zapier.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', function () {
    return gulp.src('test/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});
