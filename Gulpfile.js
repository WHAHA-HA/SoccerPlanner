var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');

var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');

var ngAnnotate = require('gulp-ng-annotate');
var wiredep = require('wiredep').stream;
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');


var gettext = require('gulp-angular-gettext');
var templateCache = require('gulp-angular-templatecache');

var notify = require("gulp-notify");
// var modernizr = require('gulp-modernizr');
var uglify = require('gulp-uglify');

var paths = {
  scss: 'app/scss/**/*.scss',
  es6: 'app/es6/**/*.js',
  es6index: './app/es6/app.js',
  js: './app/js',
  jsoutput: 'all.js',
  html: 'app/views/**/*.html'
};

gulp.task('styles', function() {
  gulp.src(paths.scss)
    .pipe(sass().on('error', function(){
      sass.logError.apply(arguments);
      gutil.beep();
    }))
    .pipe(gulp.dest('./app/css/'))
});

gulp.task('es6', function() {

  browserify(paths.es6index, { debug: true })
    .transform(babelify.configure({compact: false}))
    .bundle()
    .on('error', function(err){
      var displayErr = gutil.colors.red(err);
      gutil.log(displayErr);
      gutil.beep();
      this.emit('end');
      // throw displayErr;
    })
    .pipe(vinylSourceStream(paths.jsoutput))
    .pipe(vinylBuffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(paths.js))
    .pipe(notify('Finished es6'));

});


gulp.task('xes6', function() {
  gulp.src(paths.es6)
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.js));
});


gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory: './app/components/',
      bowerJson: require('./bower.json'),
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('./app'));
});


gulp.task('pot', function () {
  // return gulp.src(['./app/views/*.html', './app/js/**/*.js'])
  return gulp.src([paths.html, './app/js/**/*.js'])
    .pipe(gettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest('po/'));
});

gulp.task('translations', function () {
  return gulp.src('po/**/*.po')
    .pipe(gettext.compile({
      // options to pass to angular-gettext-tools...
      // format: 'json'
    }))
    .pipe(gulp.dest('./app/js/languages/'));
});

gulp.task('templates', function () {
  return gulp.src([paths.html, 'app/views/**/*.svg'])
    .pipe(templateCache({'module':'sp', 'root': '/views/'}))
    .pipe(gulp.dest('./app/js'));
});

gulp.task("modernizr", function() {
  gulp.src('./app/js/*.js')
      .pipe(modernizr())
      .pipe(uglify())
      .pipe(gulp.dest("./app/js"));
});

gulp.task("minify", function() {
  gulp.src('./app/js/all.js')
      .pipe(uglify())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest("./app/js"));

  gulp.src('./app/css/index.css')
      .pipe(cssmin())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest("./app/css"));
});


gulp.task('watch',function() {
  gulp.watch(paths.scss, ['styles']);
  gulp.watch(paths.html, ['templates']);
  gulp.watch(paths.es6, ['es6']);
});

gulp.task('default', ['styles', 'templates', 'es6', 'watch'], function(){
});
