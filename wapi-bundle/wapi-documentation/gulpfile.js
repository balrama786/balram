const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const scssParser = require('postcss-scss');

// Define paths for source and destination files
const paths = {
  scss: './assets/scss/**/*.scss',
  css: './assets/css',
};

// Compile SCSS to CSS with autoprefixing and sourcemaps
function compileScss() {
  return gulp
    .src(paths.scss, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], cascade: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream())
    .pipe(livereload());
}

// Process SCSS with PostCSS (if needed)
function processScss() {
  return gulp.src(paths.scss)
    .pipe(postcss([], { syntax: scssParser }))
    .pipe(gulp.dest('./assets/css/vendors/'));
}

// Initialize BrowserSync
function syncBrowser(done) {
  browserSync.init({
    server: './',
    startPath: 'index.html',
    host: 'localhost',
    open: true,
    tunnel: false,
  });
  done();
}

// Watch files for changes
function watchFiles() {
  livereload.listen();
  gulp.watch(paths.scss, gulp.series(compileScss));
  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch('assets/js/*.js').on('change', browserSync.reload);
}

// Define tasks
exports.compileScss = compileScss;
exports.processScss = processScss;
exports.syncBrowser = syncBrowser;
exports.watchFiles = watchFiles;

// Default task
exports.default = gulp.series(compileScss, syncBrowser, watchFiles);
