
/* ------------------------------------------------------------------------

    Baze Test
    v0.1.0
    Testing tool by Suitmedia

   ------------------------------------------------------------------------ */

var gulp        = require('gulp'),
    gUtil       = require('gulp-util'),

    // CSS Lint
    cssLint     = require('gulp-csslint'),

    // JS Hint
    jsHint      = require('gulp-jshint'),

    // Image min
    imageMin    = require('gulp-imagemin');


/* CSS Lint
--------------------------------------------------------------------------- */

gulp.task('css-lint', function () {
    var options = {
        'box-sizing'                : false,    // no longer support IE7 
        'universal-selector'        : false,    // http://goo.gl/UbxPMq
        'unique-headings'           : false,
        'compatible-vendor-prefixes': false,    // handled by autoprefixer
        'gradients'                 : false,    // handled by autoprefixer
        'vendor-prefix'             : false,    // handled by autoprefixer
        'box-model'                 : false,    // border-box specified
        'known-properties'          : false
    };

    return gulp
        .src('./css/*.css')
        .pipe(cssLint(options))
        .pipe(cssLint.reporter());

});


/* JS Hint
--------------------------------------------------------------------------- */

gulp.task('js-hint', function () {

    return gulp
        .src('./js/*.js')
        .pipe(jsHint())
        .pipe(jsHint.reporter());

});


/* Optimize image
--------------------------------------------------------------------------- */

gulp.task('image-min', function () {

    return gulp
        .src(['img/*.jpg', 'img/*.png', 'img/*.gif'])
        .pipe(imageMin());

});