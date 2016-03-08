// always
'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');

// load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var vueify = require('vueify');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var sourceFile = './app/scripts/app.js';
var destFolder = './build/scripts';
var destFileName = 'app.js';

// styles
gulp.task('styles', ['sass', 'moveCss']);
gulp.task('sass', function() {
  gulp.src('./app/styles/scss/*.scss')
  .pipe($.sass().on('error', $.sass.logError))
  .pipe($.autoprefixer('last 1 version'))
  .pipe(gulp.dest('./build/styles'))
  .pipe($.size());
});
gulp.task('moveCss',['cleanCss'], function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/styles/**/*.css'], { base: './app/styles/' })
  .pipe(gulp.dest('build/styles'));
});

// linting
// gulp.task('lint', function() {
//   return gulp.src('./app/scripts/*.js')
//     .pipe($.cached('linting'))
//     .pipe($.eslint())
//     .pipe($.eslint.format());
// });

// bundling scripts
var bundler = browserify({
  entries: [sourceFile],
  debug: true,
  insertGlobals: true,
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
    // .pipe($.useref())
    .pipe(gulp.dest('build'))
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
    .pipe(gulp.dest('build/images'))
    .pipe($.size());
});

// fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('build/fonts'));
});

// clean
gulp.task('cleanCss', function() {
  $.cached.caches = {};
  del.sync(['build/styles']);
});
gulp.task('cleanScripts', function() {
  $.cached.caches = {};
  del.sync(['build/scripts']);
});
gulp.task('cleanAll', function() {
  $.cached.caches = {};
  del.sync(['build/styles', 'build/scripts', 'build/images']);
});
gulp.task('cleanBuild', function() {
  $.cached.caches = {};
  del.sync(['build']);
});

// bundle
// gulp.task('bundle', ['styles', 'scripts'], function() {
//   return gulp.src('./app/*.html')
//     .pipe($.useref())
//     .pipe(gulp.dest('dist'));
// });

// move libraries
gulp.task('moveLibraries',['cleanScripts'], function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(['./app/scripts/**/*.js'], { base: './app/scripts/' })
  .pipe(gulp.dest('build/scripts'));
});

// json
gulp.task('json', function() {
  gulp.src('app/scripts/json/**/*.json', {
      base: 'app/scripts'
    })
    .pipe(gulp.dest('build/scripts/'));
});

// robots.txt and favicon.ico
gulp.task('extras', function() {
  return gulp.src(['app/*.txt', 'app/*.ico'])
    .pipe(gulp.dest('build/'))
    .pipe($.size());
});

// watch
gulp.task('watch', ['orderedCompile'], function() {
  gulp.watch('app/scripts/**/*.json', ['json']);
  gulp.watch('app/*.html', ['html']);
  gulp.watch(['app/styles/**/*.scss'], ['styles']);
  gulp.watch(['app/scripts/**/*.vue'], ['orderedCompile']);
  // gulp.watch(['app/scripts/**/*.js']), ['scripts']);
  gulp.watch('app/images/**/*', ['images']);
});

// hard coding task execution order to test vue compilation
gulp.task('orderedCompile', function() {
  runSequence(
    'cleanBuild',
    'scripts',
    'styles',
    'html',
    'fonts'
  );
});

// build
gulp.task('build', ['html', 'bundle', 'images', 'fonts', 'extras'], function() {
  gulp.src('build/scripts/app.js')
    .pipe($.uglify())
    .pipe($.stripDebug())
    .pipe(gulp.dest('dist/scripts'));
});

// default task
gulp.task('default', ['orderedCompile']);
