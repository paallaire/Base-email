
/* --------------------------------------------------------------------------------
    letiables
-------------------------------------------------------------------------------- */
const config = require('./config.json');
const ftpConnection = require('./ftp.json');
const argv = require('minimist')(process.argv.slice(2));

const gulp = require('gulp');
const del = require('del');
const rename = require("gulp-rename");
const runSequence = require('run-sequence');
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

const browserSync = require('browser-sync').create('dev');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const inlineCSS = require('gulp-inline-css');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const twig = require('gulp-twig');
const data = require('gulp-data');



/*
browserSync.create("dev");
global.browserSync = browserSync.get('dev');
*/


/* --------------------------------------------------------------------------------
    clean
-------------------------------------------------------------------------------- */
gulp.task('clean', function () {

    del([
        'public',
        'prod'
    ]);

})


/* --------------------------------------------------------------------------------
    watch
-------------------------------------------------------------------------------- */
gulp.task('watch', function () {

    browserSync.init({
        files: ['./templates/**/*.twig'],
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

    gulp.watch("./assets/styles/**/*.scss", ['styles']);
    gulp.watch("./templates/**/*.twig", ['twig']);

});


/* --------------------------------------------------------------------------------
    images
-------------------------------------------------------------------------------- */
gulp.task('images', function () {

    return gulp.src(`${config.src}images/*.*`)
        .pipe(plumber())
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
        .pipe(gulp.dest(`{config.dist}/images/`));

});


/* --------------------------------------------------------------------------------
    styles
-------------------------------------------------------------------------------- */
gulp.task('styles', function () {

    return gulp.src('./assets/styles/{inline,embed}.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'nested', // libsass doesn't support expanded yet
            precision: 10,
            includePaths: ['.'],
            errLogToConsole: true
        }))
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    "last 2 versions",
                    "IE 9",
                    "Safari 8"
                ]
            }),
            cssnano({
                preset: 'default'
            })
        ]))
        .pipe(sourcemaps.write('.', {
            sourceRoot: './public/dist/styles/'
        }))
        .pipe(gulp.dest('./public/dist/styles/'))
        .pipe(browserSync.stream());

});


/* --------------------------------------------------------------------------------
    inlineCSS
-------------------------------------------------------------------------------- */
gulp.task('inlineCSS', ['styles'], function () {

    return gulp.src('./public/*.html')
        .pipe(plumber())
        .pipe(inlineCSS({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: false,
            removeLinkTags: true
        }))
        .pipe(rename({
            suffix: "-inline"
        }))
        .pipe(gulp.dest('./public/'));

});

/* --------------------------------------------------------------------------------
    twig
-------------------------------------------------------------------------------- */
gulp.task('twig', ['styles'], function () {

    return gulp
        .src('./templates/*.twig')
        .pipe(plumber())
        .pipe(twig())
        .pipe(gulp.dest('./public/'));

});


/* --------------------------------------------------------------------------------
    build
-------------------------------------------------------------------------------- */
gulp.task('build', function () {
    runSequence('clean', 'twig', 'inlineCSS')
});


/* --------------------------------------------------------------------------------
    default
-------------------------------------------------------------------------------- */
gulp.task('default', function () {
    gulp.start('build');
});


/* --------------------------------------------------------------------------------
    deploy
-------------------------------------------------------------------------------- */
gulp.task('deploy', function () {
    runSequence('cleanremote', 'upload')
});


/* --------------------------------------------------------------------------------
    upload
-------------------------------------------------------------------------------- */
gulp.task('upload', function () {

    let conn = ftp.create({
        host: ftpConnection.host,
        user: ftpConnection.user,
        password: ftpConnection.password,
        parallel: 10,
        log: gutil.log,
        idleTimeout: 1000
    });

    let globs = [
        'public/**/*',
    ];

    // using base = '.' will transfer everything to /public_html correctly 
    // turn off buffering in gulp.src for best performance 

    return gulp.src(globs, { base: '.', buffer: false })
        .pipe(conn.newer('/')) // only upload newer files 
        .pipe(conn.dest('/'));

});


/* --------------------------------------------------------------------------------
    cleanremote
-------------------------------------------------------------------------------- */
gulp.task('cleanremote', function (cb) {

    let conn = ftp.create({
        host: ftpConnection.host,
        user: ftpConnection.user,
        password: ftpConnection.password,
        parallel: 10,
        log: gutil.log,
        idleTimeout: 100
    });

    return conn.rmdir('./public', function (err) {
        cb();
        gulp.start('deploy');
    });
    
});

