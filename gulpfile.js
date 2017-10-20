
/* --------------------------------------------------------------------------------
    Variables
-------------------------------------------------------------------------------- */
const config = require('./config.json');

const gulp = require('gulp');
const requireDir = require('require-dir');
const tasks = requireDir('./tasks');


const browserSync = require('browser-sync').create("dev");

// Tasks
gulp.task('clean', tasks.clean);
gulp.task('images', tasks.images);
gulp.task('watch', tasks.browserSync);
gulp.task('styles', tasks.styles);

gulp.task('twig', tasks.twig);
