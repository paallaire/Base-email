const config = require('../config.json');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

module.exports = function () {

  return gulp.src(`${config.src}images/*.*`)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins:
        [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ], { verbose: true }))
    .pipe(gulp.dest(`{config.dist}/images/`))

};