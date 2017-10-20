const gulp = require('gulp');
const twig = require('gulp-twig')

module.exports = function () {

  return gulp
    .src('./templates/*.twig')
    .pipe(twig())
    .pipe(gulp.dest('./public/'));

};