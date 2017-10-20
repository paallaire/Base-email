
module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('video', function () {
      return gulp.src('./assets/video/**/*.*')
        .pipe(gulp.dest('./dist/video/'))
        .pipe(plugins.browserSync.stream());
    });

  };

};

