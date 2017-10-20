
/* --------------------------------------------------------------------------------
    Variables
-------------------------------------------------------------------------------- */
var gulp = require('gulp');
var config = require('./config.json');

// How to use gulp-load-plugins with Browser-Sync?
// https://stackoverflow.com/questions/33388559/how-to-use-gulp-load-plugins-with-browser-sync
var plugins = require('gulp-load-plugins')({
  pattern: '*'
});



/* --------------------------------------------------------------------------------
    onError
-------------------------------------------------------------------------------- */

var onError = function (err) {
  plugins.notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(err);

  console.log(err.toString());

  this.emit('end');
}


/* --------------------------------------------------------------------------------
    TASKS
-------------------------------------------------------------------------------- */


/* clean
================================================================= */
gulp.task('clean', (done) => {
  plugins.del(['dist']);
  done();
});



/* webpack
================================================================= */
const webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  webpackConfig = require('./webpack.config.js');

gulp.task('webpack', () => {
  return gulp.src('app.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(config.dist + 'scripts/'));
});



/* webpack-watch
================================================================= */
gulp.task('webpack-watch', ['webpack'], (done) => {
  plugins.browserSync.reload();
  done();
});



/* styles
================================================================= */
gulp.task('styles', () => {

  return gulp.src(config.src + 'styles/main.scss')
    .pipe(plugins.plumber({ errorHandle: onError }))
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
          'last 2 versions',
          'IE 9',
          'Safari 8'
        ]
      }),
      /*
      plugins.cssnano({
        preset: 'default'
      })
      */
    ]))
    .pipe(plugins.sourcemaps.write('.', {
      sourceRoot: config.dist + 'styles/'
    }))
    .pipe(gulp.dest(config.dist + 'styles/'))
    .pipe(plugins.browserSync.stream())

});



/* lintCss
================================================================= */
gulp.task('lintCss', function lintCssTask() {
  return gulp.src([
    config.src + 'styles/**/*.scss',
    '!' + config.src + 'styles/icomoon/**/*.scss',
    '!' + config.src + 'styles/10.utils/**/*.scss',
    '!' + config.src + 'styles/11.vendors/**/*.scss'
  ])
    .pipe(plugins.stylelint({
      failAfterError: true,
      reportOutputDir: 'reports/lint',
      reporters: [
        { formatter: 'verbose', console: true },
      ],
      debug: true
    }));
});



/* fonts
================================================================= */
gulp.task('fonts', () => {
  return gulp.src(config.src + 'fonts/**/*.*')
    .pipe(plugins.plumber({ errorHandle: onError }))
    .pipe(plugins.flatten())
    .pipe(gulp.dest(config.dist + 'fonts/'))
    .pipe(plugins.browserSync.stream());
});



/* video
================================================================= */
gulp.task('video', () => {
  return gulp.src(config.src + 'video/**/*.*')
    .pipe(plugins.plumber({ errorHandle: onError }))
    .pipe(gulp.dest(config.dist + 'video/'))
    .pipe(plugins.browserSync.stream());
});



/* images
================================================================= */
gulp.task('images', () => {
  return gulp.src(config.src + 'images/**/*.*')
    .pipe(plugins.plumber({ errorHandle: onError }))
    .pipe(plugins.imagemin([
      plugins.imagemin.gifsicle({ interlaced: true }),
      plugins.imagemin.jpegtran({ progressive: true }),
      plugins.imagemin.optipng({ optimizationLevel: 5 }),
      plugins.imagemin.svgo({ plugins: [{ removeViewBox: true }] })
    ], { verbose: true }))
    .pipe(gulp.dest(config.dist + 'images/'))
    .pipe(plugins.browserSync.stream())
});



/* twig
================================================================= */
gulp.task('twig', () => {
  return gulp.src(config.twig + '*.twig')
    .pipe(plugins.plumber({ errorHandle: onError }))
    .pipe(plugins.twig())
    .pipe(gulp.dest(config.dist));
});



/* twig-watch
================================================================= */
gulp.task('twig-watch', ['twig'], (done) => {
  plugins.browserSync.reload();
  done();
});



/* watch
================================================================= */
gulp.task('watch', () => {

  plugins.browserSync.init({
    server: config.dist
  });

  gulp.watch(config.src + 'styles/**/*.scss', ['styles']);
  gulp.watch(config.twig + '**/*.twig', ['twig-watch']);
  gulp.watch(config.src + 'scripts/**/*.js', ['webpack-watch']);

});



/* build
================================================================= */
gulp.task('build', ['clean'], () => {
  plugins.runSequence('styles', 'webpack', ['fonts', 'images', 'video',], 'twig');
})



/* default
================================================================= */
gulp.task('default', () => {
  gulp.start('build');
});



/* indent
================================================================= */
gulp.task('indent', () => {
  gulp.src(config.src + 'styles/**/*.scss')
    .pipe(plugins.indent({
      tabs: false,
      amount: 2
    }))
    .pipe(gulp.dest("./test"));
});