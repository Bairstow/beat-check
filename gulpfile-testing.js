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
var server = require('gulp-server-livereload')
var source = require('vinyl-source-stream');
var sourceFile = './app/scripts/app.js';
var destFolder = './build/scripts';
var destFileName = 'app.js';

// bundling scripts
// var bundler = browserify({
//   entries: [sourceFile],
//   debug: true,
//   insertGlobals: true,
//   fullPaths: true
// });
// function rebundle() {
//   return bundler
//     .transform(vueify)
//     .bundle()
//     // log errors if they happen
//     .on('error', $.util.log.bind($.util, 'Browserify Error'))
//     .pipe(source(destFileName))
//     .pipe(gulp.dest(destFolder));
// };
// gulp.task('scripts', rebundle);

var b = browserify('./app/scripts/app.js');
gulp.task('bundle-app', function() {
  return b
    .transform(vueify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/scripts'));
});

// watch
gulp.task('watch', ['bundle-app'], function() {
  gulp.watch('app/scripts/**/*.vue', ['bundle-app']);
  // gulp.watch('app/scripts/**/*.vue', function(event) {
  //   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  //   gulp.start('bundle-app');
  // });
});

// gulp.task('webserver', ['watch'], function() {
//   gulp.src('.')
//     .pipe(server({
//       livereload: true,
//       directoryListing: true,
//       defaultFile: './build/index.html',
//       open: false
//     }));
// });
