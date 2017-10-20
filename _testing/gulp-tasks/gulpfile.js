/*

// SASS ok
- sourcemap level 1 = main.scss
// IMAGES ok
// FONTS ok
// VIDEO ok
// SERVER ok
// TWIG ok
// Notification

// postcss.config.js

*/

var gulp = require('gulp');

// How to use gulp-load-plugins with Browser-Sync?
// https://stackoverflow.com/questions/33388559/how-to-use-gulp-load-plugins-with-browser-sync
var plugins = require('gulp-load-plugins')({
    pattern: '*'
});

function getTask(task) {
    return require('./gulp-tasks/' + task)(gulp, plugins);
}


// Tasks
gulp.task('clean', getTask('clean'));
gulp.task('webpack', getTask('webpack'));
gulp.task('styles', getTask('styles'));
gulp.task('fonts', getTask('fonts'));
gulp.task('video', getTask('video'));
gulp.task('images', getTask('images'));
gulp.task('twig', getTask('twig'));
gulp.task('twig-watch', getTask('twig-watch'));

gulp.task('default', () => {
    gulp.start('build');
});


// Watch ???

gulp.task('watch', () => {

    plugins.browserSync.init({
        server: "./dist"
    });

    gulp.watch("assets/styles/*.scss", ['styles']);
    gulp.watch(['templates/**/*'], ['twig-watch']);

});

gulp.task('twig-watch', ['twig'], (done) => {
    console.log('twig-watch')
    plugins.browserSync.reload();
    done();
});

gulp.task('build', ['clean'], () => {
    plugins.runSequence('styles', 'webpack', ['fonts', 'images', 'video',], 'twig');
})





