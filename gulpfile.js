var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    bower = require('bower'),
    autoprefix = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload');

var config = {
  sassPath: './sass',
  bowerDir: './bower_components',
  pubPath: './public'
};

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir));
});

gulp.task('icons', function() {
  return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
    .pipe(gulp.dest(config.pubPath + '/fonts/'));
});

gulp.task('css', function() {
  return gulp.src(config.sassPath + '/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [
        config.sassPath,
        config.bowerDir + '/bootstrap-sass/assets/stylesheets',
        config.bowerDir + '/font-awesome/scss',
        ]
        })
      .on("error", notify.onError(function (error) {
        return "Error: " + error.message;
        })))
    .pipe(gulp.dest(config.pubPath + './css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(config.pubPath + '/css'));
});

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(express.static('public'));
  app.listen(4000, '0.0.0.0');
});

gulp.task('watch', function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['express', 'watch'], function() {

});
