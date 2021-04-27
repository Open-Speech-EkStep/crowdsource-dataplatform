const gulp = require('gulp');
const minify = require('gulp-minify');
const gulpFlatten = require('gulp-flatten');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const browserify = require('gulp-browserify');
const replace = require('gulp-replace-task');
const args = require('yargs').argv;
const fs = require('fs');
const generateLocalisedHtmlFromEjs = require('./locales/utils/i18n-ejs-generator');

gulp.task('common-ejs-gen', function () {
  return gulp.src(['views/common/**/*.ejs']).pipe(gulpFlatten()).pipe(gulp.dest('build/views/common'));
});

gulp.task('html-gen-boloIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/views`, `${__dirname}/public`);
  callback();
});

gulp.task('html-gen-sunoIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/public`, 'sunoIndia');
  callback();
});

gulp.task('ejs-gen-sunoIndia', function () {
  return gulp
    .src(['views/modules/sunoIndia/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/sunoIndia'));
});

gulp.task('html', function () {
  return gulp
    .src(['views/*'])
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
  var env = args.env || 'local';

  var filename = 'env.config.' + env + '.json';
  var settings = JSON.parse(fs.readFileSync('assets/config/' + filename, 'utf8'));
  return gulp
    .src(['assets/js/*.js', 'views/*.js'])
    .pipe(
      browserify({
        transform: ['babelify'],
      })
    )
    .pipe(
      replace({
        patterns: [
          {
            match: 'apiUrl',
            replacement: settings.apiUrl,
          },
        ],
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
  return gulp.src(['assets/css/*.css']).pipe(gulpFlatten()).pipe(cleanCss()).pipe(gulp.dest('public/css'));
});

gulp.task('css-common', function () {
  return gulp
    .src(['views/common/**/*.css', 'views/style/common.css'])
    .pipe(gulpFlatten())
    .pipe(cleanCss())
    .pipe(gulp.dest('public/css/common'));
});

gulp.task('css-sunoIndia', function () {
  return gulp
    .src(['views/modules/sunoIndia/**/*.css'])
    .pipe(gulpFlatten())
    .pipe(cleanCss())
    .pipe(gulp.dest('public/css/sunoIndia'));
});

gulp.task(
  'default',
  gulp.parallel(
    'js',
    'css',
    'css-common',
    'css-sunoIndia',
    gulp.series('html', 'common-ejs-gen', 'html-gen-boloIndia', 'ejs-gen-sunoIndia', 'html-gen-sunoIndia')
  )
);
