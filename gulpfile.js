const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const browserify = require('gulp-browserify');
const replace = require('gulp-replace-task');
const args = require('yargs').argv;
const fs = require('fs');
const generateLocalisedHtmlFromEjs = require('./locales/utils/i18n-ejs-generator')

gulp.task('ejs', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/views`, `${__dirname}/public`);
  callback();
});

gulp.task('html', function () {
  return gulp
    .src(['views/*.ejs'])
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
    .src(['assets/js/*.js','views/*.js'])
    .pipe(
      browserify({
        transform: ['babelify'],
      })
    )
    .pipe(replace({
      patterns: [
        {
          match: 'apiUrl',
          replacement: settings.apiUrl
        },
      ]
    }))
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
    .src(['assets/css/*.css','views/*.css'])
    .pipe(cleanCss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('default', gulp.parallel('js', 'css', gulp.series('html', 'ejs')));
