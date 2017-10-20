const config     = require('../config.json');
const gulp       = require("gulp");
const browserSync = require('browser-sync').create();

gulp.task('watch', function () {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("assets/styles/*.scss", ['sass']);

});


