/* ==========================================================================
   #Modules
   ========================================================================== */

var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();
var data = require('gulp-data');
var twig = require('gulp-twig');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var inlineCss = require('gulp-inline-css');
var imagemin = require('gulp-imagemin');
var argv = require('minimist')(process.argv.slice(2));

/* ==========================================================================
   #Path
   ========================================================================== */

var path = {
  public: './public/',
  scss: 'assets/styles/**/*.scss',
  twig: 'twig/**/*.html',
  twigData: './twig/data.json',
  images: 'assets/images/**/*',
};

/* ==========================================================================
   #HELPER
   ========================================================================== */

var onError = function (err) {
  console.log("///////////// ERROR");
  console.log(err.toString());
  this.emit('end');
};

/* ==========================================================================
   #manifest
   ========================================================================== */

// See https://github.com/austinpray/asset-builder
var manifest = require('asset-builder')('./assets/manifest.json');

var folder = manifest.folders;

// `path` - Paths to base asset directories. With trailing slashes.
// - `path.source` - Path to the source files. Default: `assets/`
// - `path.dist` - Path to the build directory. Default: `dist/`
var path = manifest.paths;

// `config` - Store arbitrary configuration values here.
var config = manifest.config || {};

// `globs` - These ultimately end up in their respective `gulp.src`.
// - `globs.js` - Array of asset-builder JS dependency objects. Example:
//   ```
//   {type: 'js', name: 'main.js', globs: []}
//   ```
// - `globs.css` - Array of asset-builder CSS dependency objects. Example:
//   ```
//   {type: 'css', name: 'main.css', globs: []}
//   ```
// - `globs.fonts` - Array of font path globs.
// - `globs.images` - Array of image path globs.
// - `globs.bower` - Array of all the main Bower files.
var globs = manifest.globs;

// `project` - paths to first-party assets.
// - `project.js` - Array of first-party JS assets.
// - `project.css` - Array of first-party CSS assets.
var project = manifest.getProjectGlobs();

// CLI options
var enabled = {
  // Enable static asset revisioning when `--production`
  rev: argv.production,
  // Disable source maps when `--production`
  maps: !argv.production,
  // Fail styles task on error when `--production`
  failStyleTask: argv.production,
};


/* ==========================================================================
   #TASKS
   ========================================================================== */

gulp.task('clean', require('del').bind(null, ["public","build"]));

gulp.task('build', function (callback) {
  runSequence('styles', 'twig-watch', 'inline-css',
    callback);
});

gulp.task('watch', function () {

  browserSync.init({
    server: {
      baseDir: "./public/"
    },
    ghostMode: {
      clicks: true,
      links: true,
      forms: true,
      scroll: true
    },
    reloadDelay: 1000
  });

  // HTML twig
  gulp.watch(['./templates/**/*.*'], ['twig-watch']);
  
  gulp.watch([path.source + path.css + '/**/*.scss'], ['style-watch']);

});

gulp.task('twig', function () {
  return gulp
    .src(path.twig)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(data(function (file) {
      return require('./twig/data.json');
    }))
    .pipe(twig())
    .pipe(gulp.dest(path.public))
});

gulp.task('twig-watch', ['twig'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('styles', function () { 
  return gulp
    .src(path.source + path.css + "/**/*.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write('.', {
      sourceRoot: "assets/styles/"
    }))
    .pipe(gulp.dest(path.dist + path.css + '/'))
    .pipe(browserSync.stream());
});

gulp.task('style-watch', function (done) {
  runSequence('styles', 'twig', function () {
    browserSync.reload();
    done();
  });
});

gulp.task('inline-css', ['styles'], function () {
  return gulp.src(path.public + '/*.html')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(inlineCss({
      applyStyleTags: true,
      applyLinkTags: true,
      removeStyleTags: false,
      removeLinkTags: true
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('images', function () {
  return gulp.src(globs.images)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 4}),
      imagemin.svgo( {plugins: [{removeViewBox: true},{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]} )
    ], {
      verbose: true
    }))
    .pipe(gulp.dest(path.public + 'images'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});