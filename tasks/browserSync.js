const config = require('../config.json');
const gulp = require("gulp");
const browserSync = require('browser-sync').get("dev");

module.exports = function () {

    browserSync.init({
        server: "./public"
    });

    gulp.watch("./assets/styles/*.scss", ['sass']);

};

