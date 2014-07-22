
/* ------------------------------------------------------------------------

    Baze Test
    v0.1.0
    Testing tool by Suitmedia

   ------------------------------------------------------------------------ */

var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    del         = require('del'),
    yargs       = require('yargs').argv,
    shell       = require('gulp-shell'),
    fs          = require('fs'),
    mapStream   = require('map-stream'),

    // CSS Lint
    cssLint     = require('gulp-csslint'),

    // JS Hint
    jsHint      = require('gulp-jshint'),

    // Page Speed Insight
    psi         = require('psi'),
    // Site to run PSI
    site        = yargs.url;



/* W3C Validator
--------------------------------------------------------------------------- */

gulp.task('w3', shell.task([
    'casperjs w3validator.js --url=' + site + ' --ignore-ssl-errors=true'
]));


/* Test
--------------------------------------------------------------------------- */

gulp.task('test', shell.task([
    'casperjs check.js --url=' + site + ' --ignore-ssl-errors=true'
]));


/* CSS Lint
--------------------------------------------------------------------------- */

var cssLintReporter = function (file) {
    var lint_result = '',
        output      = {
            dir : 'results',
            path: 'results/CSSLint.txt'
        },
        tmp;

    function writeReport(message, doubleLine) {
        if ( doubleLine ) {
            return lint_result += message + '\n\n';
        }

        return lint_result += message + '\n';
    }

    function saveReport() {
        fs.writeFile(output.path, lint_result, function (err) {
            if ( err ) return console.log(err);
        });
    }

    gutil.log();
    gutil.log(gutil.colors.magenta(file.path));
    gutil.log('--------------------------------------------------\n');

    file.csslint.results.forEach(function(result) {
        tmp = 'line: ' + result.error.line;
        gutil.log(gutil.colors.gray(tmp));
        writeReport(tmp, false);

        tmp = result.error.message;
        gutil.log('\t' + gutil.colors.blue(tmp));
        writeReport(tmp, true);

        gutil.log('');
    });

    tmp = file.csslint.errorCount + ' problems';
    gutil.log('CSS lint result: ' + gutil.colors.red('✖ ' + tmp));
    writeReport('CSS lint result: ' + tmp, false);

    fs.mkdir(output.dir, function (e) {
        saveReport();
    });

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
        'floats'                    : false,
        'adjoining-classes'         : false     // no longer support IE6
    };

    return gulp
        .src('./css/*.css')
        .pipe(cssLint(options))
        .pipe(cssLint.reporter(cssLintReporter));

});


/* JS Hint
--------------------------------------------------------------------------- */

var generateReport = mapStream( function (file, cb) {
    var msg     = '',
        i       = 0,
        output  = {
            dir: 'results',
            path: 'results/JSHint.txt'
        };

    function writeReport() {
        fs.writeFile(output.path , msg, function (err) {
            if ( err ) return console.log(err);
        });
    }

    if ( !file.jshint.success ) {

        file.jshint.results.forEach( function (err) {
            if ( err ) {
                msg += 'line ' + err.error.line + '\n';
                msg += err.error.reason + '\n\n';
                i   += 1;
            }
        });

        msg += 'JSHint results: ' + i + ' problems';
 
        fs.mkdir(output.dir, function (e) {
            writeReport();
        });

    }

    cb(null, file);
});

gulp.task('js-hint', function () {

    return gulp
        .src('./js/*.js')
        .pipe(jsHint())
        .pipe(jsHint.reporter('jshint-stylish'))
        .pipe(generateReport);

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
    del(['./css/', './js/', './results/'], function (err) {
        console.log('Directory cleaned.');
    });
});


/* Gulp tasks
--------------------------------------------------------------------------- */

gulp.task('lint', function () {
    gulp.start('css-lint', 'js-hint');
});
