

module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('clean', function (done) {
      console.log('call del');
      plugins.del(["dist"]);
      done();
    });

  }

}
