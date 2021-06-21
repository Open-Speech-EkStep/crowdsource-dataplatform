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

const env = args.env || 'local';

const filename = 'env.config.' + env + '.json';
const settings = JSON.parse(fs.readFileSync('src/assets/config/' + filename, 'utf8'));

gulp.task('common-ejs-gen', function () {
  return gulp.src(['src/views/common/**/*.ejs']).pipe(gulpFlatten()).pipe(gulp.dest('build/views/common'));
});

gulp.task('html-gen-common', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/src/views`, `${__dirname}/target`, null, settings.enabled_languages);
  callback();
});

gulp.task('html-gen-boloIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'boloIndia', settings.enabled_languages);
  callback();
});

gulp.task('html-gen-sunoIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'sunoIndia', settings.enabled_languages);
  callback();
});

gulp.task('html-gen-likhoIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'likhoIndia', settings.enabled_languages);
  callback();
});

gulp.task('html-gen-dekhoIndia', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'dekhoIndia', settings.enabled_languages);
  callback();
});

gulp.task('ejs-gen-boloIndia', function () {
  return gulp
    .src(['src/views/modules/boloIndia/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/boloIndia'));
});

gulp.task('ejs-gen-sunoIndia', function () {
  return gulp
    .src(['src/views/modules/sunoIndia/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/sunoIndia'));
});

gulp.task('ejs-gen-likhoIndia', function () {
  return gulp
    .src(['src/views/modules/likhoIndia/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/likhoIndia'));
});

gulp.task('ejs-gen-dekhoIndia', function () {
  return gulp
    .src(['src/views/modules/dekhoIndia/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/dekhoIndia'));
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
    .pipe(
      replace({
        patterns: [
          {
            match: 'cdnUrl',
            replacement: settings.cdnUrl,
          },
        ],
      })
    ).pipe(
      replace({
        patterns: [
          {
            match: 'whitelistingEmail',
            replacement: settings.whitelistingEmail,
          },
        ],
      })
    ).pipe(
      replace({
        patterns: [
          {
            match: 'enabled_languages',
            replacement: settings.enabled_languages,
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

function jsFlatten(moduleName) {
  return gulp
    .src([`src/views/modules/${moduleName}/**/*.js`])
    .pipe(gulpFlatten())
    .pipe(gulp.dest(`build/js/${moduleName}`));
}

gulp.task('js-boloIndia-flat', () => { return jsFlatten('boloIndia') });

gulp.task('js-sunoIndia-flat', () => { return jsFlatten('sunoIndia') });

gulp.task('js-likhoIndia-flat', () => { return jsFlatten('likhoIndia') });

gulp.task('js-dekhoIndia-flat', () => { return jsFlatten('dekhoIndia') });

function jsGulp(moduleName) {
  const filename = 'env.config.' + env + '.json';
  const settings = JSON.parse(fs.readFileSync('src/assets/config/' + filename, 'utf8'));
  return gulp
    .src([`build/js/${moduleName}/*.js`])
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
    .pipe(
      replace({
        patterns: [
          {
            match: 'cdnUrl',
            replacement: settings.cdnUrl,
          },
        ],
      })
    ).pipe(
      replace({
        patterns: [
          {
            match: 'whitelistingEmail',
            replacement: settings.whitelistingEmail,
          },
        ],
      })
    ).pipe(
      replace({
        patterns: [
          {
            match: 'enabled_languages',
            replacement: settings.enabled_languages,
          },
        ],
      })
    )
    .pipe(gulp.dest(`target/js/${moduleName}`));
}

gulp.task('js-common', () => { return jsGulp('common') });

gulp.task('js-boloIndia', () => { return jsGulp('boloIndia') });

gulp.task('js-sunoIndia', () => { return jsGulp('sunoIndia') });

gulp.task('js-likhoIndia', () => { return jsGulp('likhoIndia') });

gulp.task('js-dekhoIndia', () => { return jsGulp('dekhoIndia') });

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

function cssClean(moduleName) {
  return gulp
    .src([`src/views/modules/${moduleName}/**/*.css`])
    .pipe(gulpFlatten())
    .pipe(cleanCss())
    .pipe(gulp.dest(`target/css/${moduleName}`));
}

gulp.task('css-boloIndia', () => { return cssClean('boloIndia') });

gulp.task('css-sunoIndia', () => { return cssClean('sunoIndia') });

gulp.task('css-likhoIndia', () => { return cssClean('likhoIndia') });

gulp.task('css-dekhoIndia', () => { return cssClean('dekhoIndia') });

gulp.task('json', function () {
  return gulp
    .src(['src/assets/keyBoardLayout/*.json'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/json'));
});

gulp.task('generateBuild',
  gulp.parallel('common-ejs-gen', 'ejs-gen-boloIndia', 'ejs-gen-sunoIndia', 'ejs-gen-likhoIndia', 'ejs-gen-dekhoIndia', 'js-common-flat', 'js-boloIndia-flat', 'js-sunoIndia-flat', 'js-likhoIndia-flat', 'js-dekhoIndia-flat')
);

gulp.task(
  'default',
  gulp.parallel(
    'js',
    'json',
    gulp.series('js-common-flat', 'js-common', 'js-boloIndia-flat', 'js-boloIndia', 'js-sunoIndia-flat', 'js-sunoIndia', 'js-likhoIndia-flat', 'js-likhoIndia', 'js-dekhoIndia-flat', 'js-dekhoIndia'),
    'css',
    'css-common',
    'css-sunoIndia',
    'css-boloIndia',
    'css-likhoIndia',
    'css-dekhoIndia',
    gulp.series('html', 'common-ejs-gen', 'html-gen-common', 'ejs-gen-boloIndia', 'html-gen-boloIndia', 'ejs-gen-sunoIndia', 'html-gen-sunoIndia', 'ejs-gen-likhoIndia', 'html-gen-likhoIndia', 'ejs-gen-dekhoIndia', 'html-gen-dekhoIndia')
  )
);
