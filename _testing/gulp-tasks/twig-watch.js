module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('twig-watch', ['twig23'], function (done) {
      plugins.browserSync.reload();
      done();
    });

  };
};
