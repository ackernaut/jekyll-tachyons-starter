
// Require
// -------

var del          = require('del'),
    gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    jshint       = require('gulp-jshint'),
    minifycss    = require('gulp-minify-css'),
    notify       = require('gulp-notify'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-sass'),
    scsslint     = require('gulp-scsslint'),
    uglify       = require('gulp-uglify');

// Paths
// -----

var css     = 'assets/dist/css',
    js      = 'assets/dist/js',
    nodeDir = 'node_modules/',
    scripts = [
              nodeDir + 'jquery/dist/jquery.js',
              'assets/src/libs/**/*.js',
              'assets/src/scripts/**/*.js'
            ],
    styles  = 'assets/src/styles/**/*.scss';

// Clean
// -----

gulp.task('clean', function (cb) {
  del([
    'assets/dist/css/**/*',
    'assets/dist/js/**/*'
  ], cb);
});

// Default
// -------

gulp.task('default', ['clean', 'scripts', 'styles']);

// Scripts
// -------

gulp.task('scripts', function() {
  return gulp.src(scripts)
    // .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js', {
      newLine: ';'
    }))
    .pipe(gulp.dest(js))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(js))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('jshint', function() {
  return gulp.src('assets/src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Sass lint
// ---------

gulp.task('scsslint', function() {
  return gulp.src(styles)
    .pipe(scsslint('assets/src/styles/.scss-lint.yml'))
    .pipe(scsslint.reporter());
});

// Styles
// ------

gulp.task('styles', function() {
  return gulp.src(styles)
    .pipe(sass({
      includePaths: ['node_modules'],
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(css))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Watch
// -----

gulp.task('watch', function() {
  gulp.watch(scripts, ['scripts']);
  gulp.watch(styles, ['styles']);
});
