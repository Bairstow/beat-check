// always
'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');

// load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var vueify = require('vueify');
var source = require('vinyl-source-stream');
var sourceFile = './app/scripts/app.js';
var destFolder = './dist/scripts';
var destFileName = 'app.js';

// styles
gulp.task('styles', ['sass', 'moveCss']);
gulp.task('moveCss',['cleanCss'], function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/styles/**/*.css'], { base: './app/styles/' })
  .pipe(gulp.dest('dist/styles'));
});
gulp.task('sass', function() {
  gulp.src('./app/styles/scss/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('./app/styles'))
    .pipe($.size());
});

// linting
gulp.task('lint', function() {
  return gulp.src('./app/scripts/*.js')
    .pipe($.cached('linting'))
    .pipe($.eslint())
    .pipe($.eslint.format());
});

// bundling scripts
var bundler = browserify({
  entries: [sourceFile],
  debug: true,
  insertGlobals: true,
  cache: {},
  packageCache: {},
  fullPaths: true
});
function rebundle() {
  return bundler.transform(vueify)
    .bundle()
    // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source(destFileName))
    .pipe(gulp.dest(destFolder));
};
gulp.task('scripts', rebundle);

// html
gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.cached($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

// clean
gulp.task('cleanCss', function() {
  $.cached.caches = {};
  del.sync(['dist/styles']);
});
gulp.task('cleanScripts', function() {
  $.cached.caches = {};
  del.sync(['dist/scripts']);
});
gulp.task('cleanAll', function() {
  $.cached.caches = {};
  del.sync(['dist/styles', 'dist/scripts', 'dist/images']);
});

// bundle
gulp.task('bundle', ['styles', 'scripts'], function() {
  return gulp.src('./app/*.html')
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

// move libraries
gulp.task('moveLibraries',['cleanScripts'], function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/scripts/**/*.js'], { base: './app/scripts/' })
  .pipe(gulp.dest('dist/scripts'));
});

// json
gulp.task('json', function() {
  gulp.src('app/scripts/json/**/*.json', {
      base: 'app/scripts'
    })
    .pipe(gulp.dest('dist/scripts/'));
});

// robots.txt and favicon.ico
gulp.task('extras', function() {
  return gulp.src(['app/*.txt', 'app/*.ico'])
    .pipe(gulp.dest('dist/'))
    .pipe($.size());
});

// watch
gulp.task('watch', ['scripts', 'styles', 'html', 'fonts'], function() {
  // watch .json files
  gulp.watch('app/scripts/**/*.json', ['json']);
  // watch .html files
  gulp.watch('app/*.html', ['html']);
  // watch style and script files
  gulp.watch(['app/styles/**/*.scss'], ['styles']);
  // watch script files
  gulp.watch(['app/scripts/**/*.js', 'app/scripts/**/*.vue'], ['scripts', 'styles'])
  // watch image files
  // gulp.watch('app/images/**/*');
});

// build
gulp.task('build', ['html', 'bundle', 'images', 'fonts', 'extras'], function() {
  gulp.src('dist/scripts/app.js')
    .pipe($.uglify())
    .pipe($.stripDebug())
    .pipe(gulp.dest('dist/scripts'));
});

// default task
gulp.task('default', ['clean', 'build', 'jest']);
