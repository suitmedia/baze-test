
/* ------------------------------------------------------------------------

    Baze Test
    v0.1.0
    Testing tool by Suitmedia

   ------------------------------------------------------------------------ */

var gulp        = require('gulp'),
    gutil       = require('gulp-util'),

    // CSS Lint
    cssLint     = require('gulp-csslint'),

    // JS Hint
    jsHint      = require('gulp-jshint'),

    // Image min
    imageMin    = require('gulp-imagemin');


/* CSS Lint
--------------------------------------------------------------------------- */

var cssLintReporter = function (file) {
    gutil.log()
    gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));

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


/* Optimize image
--------------------------------------------------------------------------- */

gulp.task('image-min', function () {

    return gulp
        .src(['img/*.jpg', 'img/*.png', 'img/*.gif'])
        .pipe(imageMin());

});