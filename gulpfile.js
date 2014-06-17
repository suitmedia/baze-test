
/* ------------------------------------------------------------------------

    Baze Test
    v0.1.0
    Testing tool by Suitmedia

   ------------------------------------------------------------------------ */

var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    clean       = require('gulp-clean'),
    yargs       = require('yargs').argv,

    // CSS Lint
    cssLint     = require('gulp-csslint'),

    // JS Hint
    jsHint      = require('gulp-jshint'),

    // Page Speed Insight
    psi         = require('psi'),
    // Site to run PSI
    site        = yargs.url;


/* CSS Lint
--------------------------------------------------------------------------- */

var cssLintReporter = function (file) {
    gutil.log();
    gutil.log(gutil.colors.magenta(file.path));
    gutil.log('--------------------------------------------------\n');

    file.csslint.results.forEach(function(result) {
        gutil.log(gutil.colors.gray('line: ' + result.error.line));
        gutil.log('\t' + gutil.colors.blue(result.error.message));
        gutil.log('');
    });

    gutil.log('CSS lint result: ' + gutil.colors.red('✖ ' + file.csslint.errorCount + ' problems'));
};

gulp.task('css-lint', function () {
    var options = {
        'box-sizing'                : false,    // no longer support IE7 
        'universal-selector'        : false,    // http://goo.gl/UbxPMq
        'unique-headings'           : false,
        'compatible-vendor-prefixes': false,    // handled by autoprefixer
        'gradients'                 : false,    // handled by autoprefixer
        'vendor-prefix'             : false,    // handled by autoprefixer
        'box-model'                 : false,    // border-box specified
        'known-properties'          : false,
        'floats'                    : false
    };

    return gulp
        .src('./css/*.css')
        .pipe(cssLint(options))
        .pipe(cssLint.reporter(cssLintReporter));

});


/* JS Hint
--------------------------------------------------------------------------- */

gulp.task('js-hint', function () {

    return gulp
        .src('./js/*.js')
        .pipe(jsHint())
        .pipe(jsHint.reporter('jshint-stylish'));

});


/* PSI Desktop
--------------------------------------------------------------------------- */

gulp.task('psi-desktop', function (cb) {

    psi({
        nokey: true,
        url: site,
        strategy: 'desktop'
    }, cb);

});


/* PSI Mobile
--------------------------------------------------------------------------- */

gulp.task('psi-mobile', function (cb) {

    psi({
        nokey: true,
        url: site,
        strategy: 'mobile'
    }, cb);

});


/* Clean
--------------------------------------------------------------------------- */

gulp.task('clean', function () {
    return gulp
        .src(['./css/', './js/'], {read: false})
        .pipe(clean());
});


/* Gulp tasks
--------------------------------------------------------------------------- */

gulp.task('lint', function () {
    gulp.start('css-lint', 'js-hint');
});
