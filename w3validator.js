
/* Config
--------------------------------------------------------------------------- */

var casper      = require('casper').create(),
    utils       = require('utils'),
    colorizer   = require('colorizer').create('Colorizer'),
    helper      = require('./helper');


/* Testing start
--------------------------------------------------------------------------- */

var url = casper.cli.get('url');

if ( !url && url === '' ) {
    helper.clearScreen();
    helper.drawLine();

    helper.warn('Please specify the URL.');
    helper.warn('e.g: casperjs w3validator.js --url=http://suitmedia.com');
    
    helper.exitCasper();
}

casper.start('http://validator.w3.org/check?uri=' + url);

casper.then( function () {
    helper.clearScreen();

    helper.drawLine();
    this.echo('W3C Validator');
    helper.info('URL: ' + url);
    helper.drawLine();
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
        helper.warn( errors_msg[i].text );
        this.echo('');
    }

    errors_result   = colorizer.colorize( '✖ ' + errors_count + ' errors', 'WARNING' );
    warnings_result = colorizer.colorize( warnings_count + ' warnings', 'COMMENT' );

    this.echo( errors_result + ' and ' + warnings_result );
});

/* Run test
--------------------------------------------------------------------------- */

casper.run();