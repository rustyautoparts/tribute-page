/*jshint esversion: 6, node: true */
'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefix = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      cleanCSS = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      inject = require('gulp-inject'),
      runSequence = require('run-sequence'),
      livereload = require('gulp-livereload'),
      del = require('del');

var config = {
  sassPath: './src/sass',
  bowerDir: './bower_components',
  pubPath: './dist'
};

gulp.task('clean', function() {
  return del(['dist/index.html', 'dist/css', 'dist/maps']).then(paths => {
    console.log('Files and directories deleted:/n', paths.join('\n'));
  });
});

gulp.task('icons', function() {
  return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
    .pipe(gulp.dest(config.pubPath + '/fonts/'));
});

gulp.task('sass', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: 
          [config.bowerDir + '/bootstrap-sass/assets/stylesheets',
           config.bowerDir + '/font-awesome/scss']
      }))
      .pipe(autoprefix())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
  var injectFiles = gulp.src(['dist/css/main.css']);
  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'dist']
  };

  return gulp.src('./src/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(gulp.dest('dist'));
});

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(express.static('dist'));
  console.log('Starting localserver on port 4000\n');
  app.listen(4000, '0.0.0.0');
});

gulp.task('watch', function() {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('build', function() {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['express', 'watch'], function() {

});
