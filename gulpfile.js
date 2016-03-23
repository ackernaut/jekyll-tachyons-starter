
// Require
// --------

var browserSync  = require('browser-sync'),
    cp           = require('child_process'),
    del          = require('del'),
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
// ------

var css     = 'assets/dist/css',
    js      = 'assets/dist/js',
    nodeDir = 'node_modules/',
    scripts = [
              nodeDir + 'jquery/dist/jquery.js',
              'assets/src/libs/**/*.js',
              'assets/src/scripts/**/*.js'
            ],
    styles  = 'assets/src/styles/**/*.scss';

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Build the Jekyll Site
// ----------------------

gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build', '--config=./_config.yml,./_dev/_config.yml'], { stdio: 'inherit' })
    .on('close', done);
});

// Rebuild Jekyll, run page reload
// --------------------------------

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Wait for jekyll-build, then launch the Server
// ----------------------------------------------

gulp.task('browser-sync', ['scripts', 'styles', 'jekyll-build'], function () {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// Clean
// ------

gulp.task('clean', function (cb) {
  del([
    'assets/dist/css/**/*',
    'assets/dist/js/**/*'
  ], cb);
});

// Default
// --------

gulp.task('default', ['browser-sync', 'watch']);

// Scripts
// --------

gulp.task('scripts', function () {
  return gulp.src(scripts)
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js', {
      newLine: ';'
    }))
    .pipe(gulp.dest(js))
    .pipe(gulp.dest('_site/' + js))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(js))
    .pipe(gulp.dest('_site/' + js))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('jshint', function () {
  return gulp.src('assets/src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Sass lint
// ----------

gulp.task('scsslint', function () {
  return gulp.src(styles)
    .pipe(scsslint('.scss-lint.yml'))
    .pipe(scsslint.reporter());
});

// Styles
// -------

gulp.task('styles', function () {
  return gulp.src(styles)
    .pipe(sass({
      includePaths: ['node_modules'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(css))
    .pipe(gulp.dest('_site/' + css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(css))
    .pipe(gulp.dest('_site/' + css))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Watch
// ------

gulp.task('watch', function () {
  gulp.watch(scripts, ['scripts']);
  gulp.watch(styles, ['styles']);
  gulp.watch(['**/*.html'], ['jekyll-rebuild']);
});
