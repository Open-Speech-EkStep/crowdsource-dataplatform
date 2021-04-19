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
  generateLocalisedHtmlFromEjs(`${__dirname}/src/views`, `${__dirname}/target`);
  callback();
});

gulp.task('html', function () {
  return gulp
    .src(['src/views/**'])
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
    .pipe(gulp.dest('target/js'));
});
gulp.task('css', function () {
  return gulp
    .src(['src/assets/css/*.css'])
    .pipe(cleanCss())
    .pipe(gulp.dest('target/css'));
});

gulp.task('default', gulp.parallel('js', 'css', gulp.series('html', 'ejs')));
