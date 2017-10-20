
module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('styles', function () {

      return gulp.src('assets/styles/main.scss')
        //.pipe(wait(500)) ???
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
          outputStyle: 'nested', // libsass doesn't support expanded yet
          precision: 10,
          includePaths: ['.'],
          errLogToConsole: true
        }))
        .pipe(plugins.postcss([
          plugins.lost(),
          plugins.autoprefixer({
            browsers: [
              "last 2 versions",
              "IE 9",
              "Safari 8"
            ]
          })
          /*
          plugins.cssnano({
            preset: 'default'
          })
          */
        ]))
        .pipe(plugins.sourcemaps.write('.', {
          sourceRoot: './dist/styles/'
        }))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(plugins.browserSync.stream());
    });

  };

};
