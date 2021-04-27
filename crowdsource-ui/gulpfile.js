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
  return gulp.src(['src/views/common/**/*.ejs']).pipe(gulpFlatten()).pipe(gulp.dest('build/views/common'));
});

gulp.task('html-gen-boloIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/src/views`, `${__dirname}/target`);
  callback();
});

gulp.task('html-gen-sunoIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'sunoIndia');
  callback();
});

gulp.task('ejs-gen-sunoIndia', function () {
  return gulp
    .src(['src/views/modules/sunoIndia/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/sunoIndia'));
});

gulp.task('html', function () {
  return gulp
    .src(['src/views/**/*.ejs'])
    .pipe(
      htmlmin({
        collapseWhitespace: false,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest('src/views'));
});

gulp.task('js', function () {
  var env = args.env || 'local';

  var filename = 'env.config.' + env + '.json';
  var settings = JSON.parse(fs.readFileSync('src/assets/config/' + filename, 'utf8'));
  return gulp
    .src(['src/assets/js/*.js'])
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
    .pipe(gulp.dest('target/js'));
});

gulp.task('js-common-flat', function () {
  return gulp
    .src(['src/views/common/**/*.js', 'src/views/js/*.js'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/js/common'));
});

gulp.task('js-sunoIndia-flat', function () {
  return gulp
    .src(['src/views/modules/sunoIndia/**/*.js'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/js/sunoIndia'));
});

gulp.task('js-common', function () {
  var env = args.env || 'local';

  var filename = 'env.config.' + env + '.json';
  var settings = JSON.parse(fs.readFileSync('src/assets/config/' + filename, 'utf8'));
  return gulp
    .src(['build/js/common/*.js'])
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
    .pipe(gulp.dest('target/js/common'));
});

gulp.task('js-sunoIndia', function () {
  var env = args.env || 'local';

  var filename = 'env.config.' + env + '.json';
  var settings = JSON.parse(fs.readFileSync('src/assets/config/' + filename, 'utf8'));
  return gulp
    .src(['build/js/sunoIndia/*.js'])
    .pipe(gulpFlatten())
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
    .pipe(gulp.dest('target/js/sunoIndia'));
});

gulp.task('css', function () {
  return gulp.src(['src/assets/css/*.css']).pipe(gulpFlatten()).pipe(cleanCss()).pipe(gulp.dest('target/css'));
});

gulp.task('css-common', function () {
  return gulp
    .src(['src/views/common/**/*.css', 'src/views/style/common.css'])
    .pipe(gulpFlatten())
    .pipe(cleanCss())
    .pipe(gulp.dest('target/css/common'));
});

gulp.task('css-sunoIndia', function () {
  return gulp
    .src(['src/views/modules/sunoIndia/**/*.css'])
    .pipe(gulpFlatten())
    .pipe(cleanCss())
    .pipe(gulp.dest('target/css/sunoIndia'));
});

gulp.task(
  'default',
  gulp.parallel(
    'js',
    gulp.series('js-common-flat', 'js-common', 'js-sunoIndia-flat', 'js-sunoIndia'),
    'css',
    'css-common',
    'css-sunoIndia',
    gulp.series('html', 'common-ejs-gen', 'html-gen-boloIndia', 'ejs-gen-sunoIndia', 'html-gen-sunoIndia')
  )
);
