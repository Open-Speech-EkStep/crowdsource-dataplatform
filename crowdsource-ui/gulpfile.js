const gulp = require('gulp');
const livereload = require('gulp-livereload');
const gulpFlatten = require('gulp-flatten');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const browserify = require('gulp-browserify');
const replace = require('gulp-replace-task');
const replace_sting = require('gulp-replace');
var uglify = require('gulp-uglify');
const terser = require('gulp-terser')
const args = require('yargs').argv;
const fs = require('fs');
const generateLocalisedHtmlFromEjs = require('./locales/utils/i18n-ejs-generator');

const env = args.env || 'local';

const filename = 'env.config.' + env + '.json';
const settings = JSON.parse(fs.readFileSync('src/assets/config/' + filename, 'utf8'));


gulp.task('common-ejs-gen', function () {
  return gulp.src(['src/views/common/**/*.ejs']).pipe(gulpFlatten()).pipe(gulp.dest('build/views/common')).pipe(livereload());
});

gulp.task('html-gen-common', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/src/views`, `${__dirname}/target`, null, settings.enabled_languages,settings.contextRoot,settings.brand);
  callback();
});

gulp.task('html-gen-text', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'text', settings.enabled_languages,settings.contextRoot,settings.brand);
  callback();
});

gulp.task('html-gen-asr', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'asr', settings.enabled_languages,settings.contextRoot,settings.brand);
  callback();
});

gulp.task('html-gen-parallel', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'parallel', settings.enabled_languages,settings.contextRoot,settings.brand);
  callback();
});

gulp.task('html-gen-ocr', function (callback) {
  generateLocalisedHtmlFromEjs(`${__dirname}/build/views`, `${__dirname}/target`, 'ocr', settings.enabled_languages,settings.contextRoot,settings.brand);
  callback();
});

gulp.task('ejs-gen-text', function () {
  return gulp
    .src(['src/views/modules/text/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/text'))
    .pipe(livereload());
});

gulp.task('ejs-gen-asr', function () {
  return gulp
    .src(['src/views/modules/asr/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/asr'))
    .pipe(livereload());
});

gulp.task('ejs-gen-parallel', function () {
  return gulp
    .src(['src/views/modules/parallel/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/parallel'))
    .pipe(livereload());
});

gulp.task('ejs-gen-ocr', function () {
  return gulp
    .src(['src/views/modules/ocr/**/*.ejs'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/views/ocr'))
    .pipe(livereload());
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
    .pipe(gulp.dest('src/views'))
    .pipe(livereload());
});

gulp.task('js-config-1', function () {
  return gulp
    .src(['src/assets/js/*.js'])
    .pipe(replace_sting(/\/brand\/.*.json/, `/brand/${settings.brand}.json`))
    .pipe(gulp.dest('src/assets/js'))
})

gulp.task('js-config-2', function () {
  return gulp
    .src(['src/views/js/*.js'])
    .pipe(replace_sting(/\/brand\/.*.json/, `/brand/${settings.brand}.json`))
    .pipe(gulp.dest('src/views/js'))
})

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
            match: 'titleLogoUrl',
            replacement: settings.titleLogoUrl,
          },
        ],
      })
    )
    .pipe(
      replace({
        patterns: [
          {
            match: 'contextRoot',
            replacement: settings.contextRoot,
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
    ).pipe(replace_sting('"\/img\/', `"${settings.contextRoot}/img/${settings.brand}/`)
    ).pipe(
      replace({
        patterns: [
          {
            match: 'feedbackTopComponent',
            replacement: settings.feedbackTopComponent
          },
          {
            match: 'enabled_languages',
            replacement: settings.enabled_languages,
          },
          {
            match: 'showDataSource',
            replacement: settings.showDataSource,
          }
        ],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('target/js'));
});

gulp.task('js-common-flat', function () {
  return gulp
    .src(['src/views/common/**/*.js', 'src/views/js/*.js'])
    .pipe(gulpFlatten())
    .pipe(
      replace({
        patterns: [
          {
            match: 'contextRoot',
            replacement: settings.contextRoot,
          },
        ],
      })
    )
    .pipe(gulp.dest('build/js/common'));
});

function jsFlatten(moduleName) {
  return gulp
    .src([`src/views/modules/${moduleName}/**/*.js`])
    .pipe(gulpFlatten())
    .pipe(
      replace({
        patterns: [
          {
            match: 'contextRoot',
            replacement: settings.contextRoot,
          },
        ],
      })
    )
    .pipe(gulp.dest(`build/js/${moduleName}`));
}

gulp.task('js-text-flat', () => { return jsFlatten('text') });

gulp.task('js-asr-flat', () => { return jsFlatten('asr') });

gulp.task('js-parallel-flat', () => { return jsFlatten('parallel') });

gulp.task('js-ocr-flat', () => { return jsFlatten('ocr') });

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
            match: 'titleLogoUrl',
            replacement: settings.titleLogoUrl,
          },
        ],
      })
    )
    .pipe(
      replace({
        patterns: [
          {
            match: 'contextRoot',
            replacement: settings.contextRoot,
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
    ).pipe(replace_sting('"\/img\/', `"${settings.contextRoot}/img/${settings.brand}/`)
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
            match: 'feedbackTopComponent',
            replacement: settings.feedbackTopComponent
          },
          {
            match: 'enabled_languages',
            replacement: settings.enabled_languages,
          },
          {
            match: 'showDataSource',
            replacement: settings.showDataSource,
          }
        ],
      })
    )
    .pipe(terser())
    .pipe(gulp.dest(`target/js/${moduleName}`));
}

gulp.task('js-common', () => { return jsGulp('common') });

gulp.task('js-text', () => { return jsGulp('text') });

gulp.task('js-asr', () => { return jsGulp('asr') });

gulp.task('js-parallel', () => { return jsGulp('parallel') });

gulp.task('js-ocr', () => { return jsGulp('ocr') });

gulp.task('css', function () {
  return gulp.src(['src/assets/css/*.css']).pipe(gulpFlatten()).pipe(cleanCss()).pipe(replace_sting('\/img\/', `${settings.contextRoot}/img/${settings.brand}/`)).pipe(gulp.dest('target/css'));
});

gulp.task('scss', function () {
  return gulp.src(['src/assets/css/*.scss']).pipe(gulpFlatten()).pipe(sass().on('error', sass.logError)).pipe(replace_sting('\/img\/', `${settings.contextRoot}/img/${settings.brand}/`)).pipe(cleanCss()).pipe(gulp.dest('target/css'));
});

gulp.task('css-common', function () {
  return gulp
    .src(['src/views/common/**/*.css', 'src/views/style/common.css'])
    .pipe(gulpFlatten())
    .pipe(cleanCss())
    .pipe(replace_sting('\/img\/', `${settings.contextRoot}/img/${settings.brand}/`))
    .pipe(gulp.dest('target/css/common'));
});


function cssClean(moduleName) {
  return gulp
    .src([`src/views/modules/${moduleName}/**/*.css`])
    .pipe(gulpFlatten())
    .pipe(cleanCss())
    .pipe(replace_sting('\/img\/', `${settings.contextRoot}/img/${settings.brand}/`))
    .pipe(gulp.dest(`target/css/${moduleName}`));
}

gulp.task('css-text', () => { return cssClean('text') });

gulp.task('css-asr', () => { return cssClean('asr') });

gulp.task('css-parallel', () => { return cssClean('parallel') });

gulp.task('css-ocr', () => { return cssClean('ocr') });

gulp.task('json', function () {
  return gulp
    .src(['src/assets/keyBoardLayout/*.json'])
    .pipe(gulpFlatten())
    .pipe(gulp.dest('build/json'));
});

gulp.task('generateBuild',
  gulp.parallel('common-ejs-gen', 'ejs-gen-text', 'ejs-gen-asr', 'ejs-gen-parallel', 'ejs-gen-ocr', 'js-common-flat', 'js-text-flat', 'js-asr-flat', 'js-parallel-flat', 'js-ocr-flat')
);

gulp.task('copy locales', () =>
  gulp.src(['locales/*.json'])
    .pipe(gulp.dest('./../crowdsource-api/locales'))
);

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/views/**/*.ejs', gulp.series(
    // 'html',
    'common-ejs-gen',
    'html-gen-common',
    'ejs-gen-text',
    'html-gen-text',
    'ejs-gen-asr',
    'html-gen-asr',
    'ejs-gen-parallel',
    'html-gen-parallel',
    'ejs-gen-ocr',
    'html-gen-ocr'));
  gulp.watch('src/views/**/*.css', gulp.parallel(
    'css',
    'scss',
    'css-common',
    'css-asr',
    'css-text',
    'css-parallel',
    'css-ocr',
  ));
  gulp.watch('src/assets/css/*.css', gulp.parallel(
    'css',
    'scss',
  ));
});

gulp.task('json', function () {
  return gulp.src([`brand/${settings.brand}.json`]).pipe(gulp.dest('build/brand')).pipe(livereload()).pipe(gulp.dest('target/brand'));
});

gulp.task(
  'default',
  gulp.series('copy locales','js-config-1','js-config-2',
    gulp.parallel(
      'js',
      'json',
      gulp.series('js-common-flat', 'js-common', 'js-text-flat', 'js-text', 'js-asr-flat', 'js-asr', 'js-parallel-flat', 'js-parallel', 'js-ocr-flat', 'js-ocr'),
      'css',
      'scss',
      'css-common',
      'css-asr',
      'css-text',
      'css-parallel',
      'css-ocr',
      gulp.series('html', 'common-ejs-gen', 'html-gen-common', 'ejs-gen-text', 'html-gen-text', 'ejs-gen-asr', 'html-gen-asr', 'ejs-gen-parallel', 'html-gen-parallel', 'ejs-gen-ocr', 'html-gen-ocr')
    ))
);
