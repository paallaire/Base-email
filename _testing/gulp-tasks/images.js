

module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('images', function () {
      return gulp.src('./assets/images/**/*.*')
        .pipe(plugins.imagemin([
          plugins.imagemin.gifsicle({ interlaced: true }),
          plugins.imagemin.jpegtran({ progressive: true }),
          plugins.imagemin.optipng({ optimizationLevel: 5 }),
          plugins.imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ], { verbose: true }))
        .pipe(gulp.dest('./dist/images/'))
    });
  };

};




