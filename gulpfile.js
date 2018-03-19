var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var replace = require('gulp-replace');
var gaTag = require('./ga.js');

var pkg = require('./package.json');
var keys = {};
try {
  keys = require('./keys.json');
} catch (e) {
  console.log('No keys file found. Assuming keys are in process.ENV');
}

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  gulp
    .src(
      ['./node_modules/bootstrap/dist/**/*', '!./node_modules/bootstrap/dist/css/bootstrap-grid*', '!./node_modules/bootstrap/dist/css/bootstrap-reboot*',]
    )
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  gulp
    .src([
      './node_modules/font-awesome/**/*',
      '!./node_modules/font-awesome/{less,less/*}',
      '!./node_modules/font-awesome/{scss,scss/*}',
      '!./node_modules/font-awesome/.*',
      '!./node_modules/font-awesome/*.{txt,json,md}',
    ])
    .pipe(gulp.dest('./vendor/font-awesome'))

  // jQuery
  gulp
    .src(['./node_modules/jquery/dist/*', '!./node_modules/jquery/dist/core.js',])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp
    .src(['./node_modules/jquery.easing/*.js'])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Simple Line Icons
  gulp
    .src(['./node_modules/simple-line-icons/fonts/**',])
    .pipe(gulp.dest('./vendor/simple-line-icons/fonts'))

  gulp
    .src(['./node_modules/simple-line-icons/css/**',])
    .pipe(gulp.dest('./vendor/simple-line-icons/css'))

});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp
    .src('./scss/**/*.scss')
    .pipe(sass.sync({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp
    .src(['./css/*.css', '!./css/*.min.css',])
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify',]);

// Minify JavaScript
gulp.task('js:minify', function() {
  var stripeKey = process.env.STRIPE_PUBLISHABLE_API_KEY || keys.stripePublishableKey;
  return gulp
    .src(['./js/*.js', '!./js/*.min.js',])
    .pipe(replace('STRIPE_PUBLISHABLE_API_KEY', stripeKey))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// Minify JavaScript
gulp.task('publish', ['default'], function() {
  gulp
    .src('./favicon/*')
    .pipe(gulp.dest('dist'));

  // Add google analytics to published HTML
  gulp
    .src('./*.html')
    .pipe(replace('<!-- GOOGLE_ANALYTICS_SCRIPT -->', gaTag))
    .pipe(gulp.dest('dist'));

  gulp
    .src('./vendor/**/*')
    .pipe(gulp.dest('dist/vendor'));

  gulp
    .src('./css/*.min.*')
    .pipe(gulp.dest('dist/css'));

  gulp
    .src('./js/*.min.*')
    .pipe(gulp.dest('dist/js'));
});

// JS
gulp.task('js', ['js:minify']);

// Default task
gulp.task('default', ['css', 'js', 'vendor',]);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', [
  'css', 'js', 'browserSync',
], function() {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
});
