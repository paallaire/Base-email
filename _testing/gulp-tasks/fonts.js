
module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('fonts', function () {
      return gulp.src('./assets/fonts/**/*.*')
        .pipe(plugins.flatten())
        .pipe(gulp.dest('./dist/fonts/'))
        .pipe(plugins.browserSync.stream());
    });

  };
  
};