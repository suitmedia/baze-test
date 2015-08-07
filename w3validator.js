
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

    var errors              = this.getElementsInfo('.error'),
        errors_msg          = this.getElementsInfo('.error p:first-child span'),
        errors_line         = this.getElementsInfo('.error .location .first-line'),
        errors_code         = this.getElementsInfo('.error .extract'),

        warnings            = this.getElementsInfo('.warning'),
        warnings_msg        = this.getElementsInfo('.warning span'),
        warnings_line       = this.getElementsInfo('.warning .location .first-line'),
        warnings_code       = this.getElementsInfo('.warning .extract'),

        errors_count        = errors.length,
        warnings_count      = warnings.length,

        errors_result,
        warnings_result;

    for ( var i = 0; i < errors_count; i++ ) {

        this.echo( (i+1) + "." );
        helper.warn( "Error : " + errors_msg[i].text );
        this.echo( "Line  : " + errors_line[i].text );
        this.echo('');
    }

    errors_result   = colorizer.colorize( '✖ ' + errors_count + ' errors', 'WARNING' );
    warnings_result = colorizer.colorize( warnings_count + ' warnings', 'COMMENT' );

    this.echo( errors_result + ' and ' + warnings_result );
});

/* Run test
--------------------------------------------------------------------------- */

casper.run();