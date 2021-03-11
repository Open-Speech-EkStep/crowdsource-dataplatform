const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const browserify = require('gulp-browserify');
const generateLocalisedHtmlFromEjs = require('./locales/utils/i18n-ejs-generator')

gulp.task('ejs', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/views`, `${__dirname}/public`);
  callback();
});

gulp.task('html', function () {
  return gulp
    .src(['views/**'])
    .pipe(
      htmlmin({
        collapseWhitespace: false,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest('views'));
});

gulp.task('js', function () {
  return gulp
    .src(['assets/js/*.js'])
    .pipe(
      browserify({
        transform: ['babelify'],
      })
    )
    .pipe(
      minify({
        ext: {
          min: '.js',
        },
        noSource: true,
      })
    )
    .pipe(gulp.dest('public/js'));
});
gulp.task('css', function () {
  return gulp
    .src(['assets/css/*.css'])
    .pipe(cleanCss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('default', gulp.parallel('js', 'css', 'ejs'));
