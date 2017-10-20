
const webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  config = require("../webpack.config.js");

module.exports = function (gulp, plugins) {

  return function () {

    gulp.task('webpack', (e) => {
      return gulp.src('app.js')
        .pipe(webpackStream(config, webpack))
        .pipe(gulp.dest('./dist/scripts/'));
    });

  };
  
};

