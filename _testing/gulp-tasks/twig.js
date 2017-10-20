module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('twig', function () {
      return gulp
        .src('templates/*.twig')
        .pipe(plugins.twig())
        .pipe(gulp.dest('./dist/'));
    });

  };
};

/*
gulp.task('twig-watch', ['twig'], function (done) {
  browserSync.reload();
  done();
});
*/