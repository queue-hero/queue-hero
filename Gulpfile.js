var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var karma = require('gulp-karma');
var bs = require('browser-sync');
var reload = bs.reload;
var when = require('gulp-if');
var shell = require('gulp-shell');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var filesize = require('gulp-filesize');
var bower = require('gulp-bower');

var jsScripts = [
  'client/bower_components/angular/angular.min.js',
  'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
  'client/bower_components/socket.io-client/socket.io.js',
  'client/bower_components/angular-messages/angular-messages.min.js',
  'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'client/bower_components/angular-animate/angular-animate.min.js',
  'client/bower_components/ng-file-upload/ng-file-upload.min.js',
  'client/bower_components/angular-cookies/angular-cookies.min.js',
  'client/bower_components/angular-mapbox/dist/angular-mapbox.min.js',
  'client/bower_components/moment/min/moment-with-locales.min.js',
  'client/bower_components/underscore/underscore-min.js',
  'client/bower_components/mapbox.js/mapbox.js',
  'client/src/**/*.js',
  'client/src/app.js'
];

// the paths to our app files
var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/src/**/*.js'],
  html: ['client/src/**/*.html'],
  styles: ['client/styles/*.css'],
  test: ['specs/**/*.js'],
  images: ['client/images/*']
};

gulp.task('clean', function() {
  return gulp.src('build', {
      read: false
    })
    .pipe(clean());
});

gulp.task('karma', shell.task([
  'karma start'
]));

gulp.task('convert-js', function() {
  //specifc order
  return gulp.src(jsScripts)
    .pipe(concat('queueHero.min.js', {
      newLine: '\n'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('build/'))
    .pipe(filesize())
    .on('error', gutil.log);
});

gulp.task('copy-css', function() {
  gulp.src(paths.styles, {
    base: './client/styles'
  })
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('copy-images', function() {
  gulp.src(paths.images, {
    base: './client/images'
  })
    .pipe(gulp.dest('./build/images'));
});

gulp.task('copy-html', function() {
  gulp.src(paths.html, {
    base: './client/'
  })
    .pipe(gulp.dest('./build/'));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('build/bower_components'));
});

gulp.task('move-index', function() {
  gulp.src('client/index_gulp.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['convert-js', 'copy-html', 'copy-css', 'copy-images', 'move-index','bower']);
