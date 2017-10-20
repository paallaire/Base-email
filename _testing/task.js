
gulp.task('sassSorting', function () {
    return gulp.src('assets/styles/**/*.scss')
        .pipe(plugins.postcss([
            plugins.postcssSorting(sortingOptions)
        ]))
        .pipe(gulp.dest('dist/sorting/'))
});
