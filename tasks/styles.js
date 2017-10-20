
const gulp        = require('gulp');

const sass        = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');

const postcss     = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const browserSync = require('browser-sync').get("dev");

module.exports = function (browserSync) {

  console.log('styles');

  return gulp.src('./assets/styles/main.scss')
    //.pipe(wait(500)) ???
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      errLogToConsole: true
    }))
    .pipe(postcss([
      //lost(),
      autoprefixer({
        browsers: [
          "last 2 versions",
          "IE 9",
          "Safari 8"
        ]
      })
      /*
      cssnano({
        preset: 'default'
      })
      */
    ]))
    .pipe(sourcemaps.write('.', {
      sourceRoot: './public/dist/styles/'
    }))
    .pipe(gulp.dest('./public/dist/styles/'))
    .pipe(browserSync.stream());

};
