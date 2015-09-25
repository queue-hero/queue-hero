var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  karma = require('gulp-karma'),
  bs = require('browser-sync'),
  reload = bs.reload,
  when = require('gulp-if'),
  shell = require('gulp-shell'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  clean = require('gulp-clean'),
  gutil = require('gulp-util'),
  filesize = require('gulp-filesize');

var jsScripts = [
  'client/bower_components/angular/angular.min.js',
  'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
  'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'client/bower_components/ng-file-upload/ng-file-upload.min.js',
  'client/src/app.js',
  'client/src/**/*.js'

];

// the paths to our app files
var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/src/**/*.js'],
  html: ['client/src/**/*.html'],
  styles: ['client/bower_components/bootstrap/dist/css/bootstrap.min.css', 'client/styles/*.css'],
  test: ['specs/**/*.js']
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
    .pipe(concat('queueHero.min.js', {newLine: '\n'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/'))
    .pipe(filesize())
    .on('error', gutil.log);
});

gulp.task('copy-css', function(){
    gulp.src(paths.styles, { base: './'})
     .pipe(gulp.dest('./build/styles'));
});

gulp.task('copy-html', function(){
    gulp.src(paths.html, { base: './client/' })
     .pipe(gulp.dest('./build/'));
});

gulp.task('move-index', function(){
    gulp.src('client/index_gulp.html')
     .pipe(rename('index.html'))
     .pipe(gulp.dest('./build/'));
});

gulp.task('serve', function() {
  nodemon({script: 'index.js', ignore: 'node_modules/**/*.js'});
});

gulp.task('default', ['convert-js', 'copy-html', 'copy-css', 'move-index']);
// gulp.task('build', ['karma', 'convert-js', 'copy-html', 'copy-css', 'move-index']);
