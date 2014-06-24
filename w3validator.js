
/* Config
--------------------------------------------------------------------------- */

var casper      = require('casper').create(),
    utils       = require('utils'),
    colorizer   = require('colorizer').create('Colorizer');


/* Helper functions
--------------------------------------------------------------------------- */

function clearScreen() {
    for (var i = 10 - 1; i >= 0; i--) {
        console.log('\n');
    }
}

function drawLine() {
    console.log('-------------------------------------------------------');
}

function title(text) {
    return casper.echo('# ' + text, 'PARAMETER');
}

function param(text) {
    return casper.echo(text, 'PARAMETER');
}

function info(text) {
    return casper.echo(text, 'INFO');
}

function warn(text) {
    return casper.echo(text, 'WARNING');
}

function comment(text) {
    return casper.echo(text, 'COMMENT');
}

function exitCasper() {
    drawLine();
    casper.exit();
}

/*
 * String.prototype.contains polyfill
 * http://goo.gl/F0x4Gg
 */
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}


/* Testing start
--------------------------------------------------------------------------- */

var url = casper.cli.get('url');

if ( !url && url === '' ) {
    clearScreen();
    drawLine();

    warn('Please specify the URL.');
    warn('e.g: casperjs w3validator.js --url=http://suitmedia.com');
    
    exitCasper();
}

casper.start('http://validator.w3.org/check?uri=' + url);

casper.then( function () {
    clearScreen();

    drawLine();
    this.echo('W3C Validator');
    info('URL: ' + url);
    drawLine();
});

casper.then( function () {
    var title = this.getTitle();

    if ( !title.contains('Invalid') ) return;

    var errors              = this.getElementsInfo('.msg_err'),
        errors_msg          = this.getElementsInfo('.msg_err .msg'),
        errors_line         = this.getElementsInfo('.msg_err em'),

        warnings            = this.getElementsInfo('.msg_warn'),
        warnings_msg        = this.getElementsInfo('.msg_warn .msg'),
        warnings_line       = this.getElementsInfo('.msg_warn em'),

        errors_count        = errors.length,
        warnings_count      = warnings.length,

        errors_result,
        warnings_result;

    for ( var i = 0; i < errors_count; i++ ) {
        var line        = errors_line[i].text,
            line_error  = line.substring(0, line.indexOf(','));

        this.echo( line_error );
        warn( errors_msg[i].text );
        this.echo('');
    }

    errors_result   = colorizer.colorize( '✖ ' + errors_count + ' errors', 'WARNING' );
    warnings_result = colorizer.colorize( warnings_count + ' warnings', 'COMMENT' );

    this.echo( errors_result + ' and ' + warnings_result );
});

/* Run test
--------------------------------------------------------------------------- */

casper.run();