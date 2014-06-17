
/* Config
--------------------------------------------------------------------------- */

var casper_options = {
    clientScripts: ['./bower_components/jquery/dist/jquery.min.js']
  // , verbose: true
  // , logLevel: 'debug'
};

var casper  = require('casper').create(casper_options),
    utils   = require('utils'),
    colorizer = require('colorizer').create('Colorizer');


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

casper.start(casper.cli.get('url'));

casper.then( function () {
    clearScreen();
    drawLine();
    this.echo('Suitmedia web validation');
    
    if ( !casper.cli.get('url') ) {
        warn('No URL specified.');
        info('eg: casperjs check.js --url=http://suitmedia.com');
        exitCasper();
    }

    var pageURL     = this.getCurrentUrl(),
        pageStatus  = this.status().currentHTTPStatus;

    this.echo('link\t: ' + pageURL );

    if ( pageStatus === 404 ) {
        this.echo('status\t: ' + colorizer.colorize(pageStatus, 'WARNING') );
        exitCasper();
    } else {
        this.echo('status\t: ' + colorizer.colorize(pageStatus, 'TRACE') );
    }

    drawLine();
});


/* Meta declaration
--------------------------------------------------------------------------- */

casper.then( function () {
    var meta_desc   = 'meta[name="description"]',
        meta_vp     = 'meta[name="viewport"]';

    title('Necessary meta tag');

    if ( this.exists(meta_desc) ) {
        info('  - Description: ' + this.getElementAttribute(meta_desc, 'content'));
    } else {
        warn('  - Description: not specified');
    }

    if ( this.exists(meta_vp) ) {
        info('  - Viewport: ' + this.getElementAttribute(meta_vp, 'content'));
    } else {
        warn('  - Viewport: not specified');
    }
});


/* Favicon
--------------------------------------------------------------------------- */

casper.then( function () {
    var favicon = 'link[rel*="icon"]';

    title('Favicon');

    if ( this.exists(favicon) ) {
        var favicon_href = this.getElementAttribute(favicon, 'href');

        info('  - Favicon is specified: ' + favicon_href);
    } else {
        warn('  - No favicon specified');
    }
});


/* ARIA Landmark
--------------------------------------------------------------------------- */

casper.then( function () {
    var arr_role        = ['banner', 'main', 'contentinfo', 'navigation', 'search'],
        arr_role_length = arr_role.length;

    title('ARIA Landmark');

    for (var i = arr_role_length - 1; i >= 0; i--) {
        var _current = '[role="' + arr_role[i] + '"]';

        if ( this.exists(_current) ) {
            info('  - ' + arr_role[i]);
        } else {
            warn('  - ' + arr_role[i]);
        }
    }
});


/* i18n
--------------------------------------------------------------------------- */

casper.then( function () {
    var lang            = 'html[lang]',
        arr_charset     = ['meta[charset]', 'meta[http-equiv]'],
        charsetExist    = 0;

    title('Internationalization');

    if ( this.exists(lang) ) {
        var content = this.getElementAttribute(lang, 'lang');

        info('  - Language is specified: ' + content);
    } else {
        warn('  - Language is not specified');
    }

    for (var i = arr_charset.length - 1; i >= 0; i--) {
        var curr    = arr_charset[i];

        if ( this.exists(curr) ) {
            /* 
             *  2 ways to declare charset
             *  http://goo.gl/2hpW3P
             */ 
            var curr_opt1   = this.getElementAttribute(curr, 'charset'),
                curr_opt2   = this.getElementAttribute(curr, 'content'),
                content = curr_opt1 || curr_opt2;

            info('  - Character encoding is specified: ' + content);
            charsetExist = 1;
            break;
        }
    }

    if ( charsetExist === 0 ) {
        warn('  - Character encoding is not specified');
    }
});


/* Images with alt
--------------------------------------------------------------------------- */

casper.then( function () {
    var img     = this.getElementsInfo('img'),
        no_alt  = 0;

    if ( !img.length ) return;

    title('Images');

    for (var i = img.length - 1; i >= 0; i--) {
        var curr        = img[i],
            curr_alt    = curr.attributes.alt;

        if ( curr_alt === '' ) {
            no_alt += 1;
        }
    }

    info('  - Total images: ' + img.length);
    warn('  - Images with no alt text: ' + no_alt);
});


/* Get assets
--------------------------------------------------------------------------- */

casper.then( function () {
    var arr_style       = [],
        arr_style_src   = [],
        arr_script      = [],
        arr_script_src  = [];

    title('Assets');

    function checkAssets(asset) {

        if ( casper.exists(asset) ) {
            var asset_arr = casper.getElementsInfo(asset);

            for (var i = 0; i < asset_arr.length; i++) {
                var curr        = asset_arr[i],
                    curr_ref    = curr.attributes.href || curr.attributes.src,
                    filename;

                if ( curr.attributes.href && curr.attributes.href.contains('.css') ) {
                    filename = /[^//]*\.(css)/g.exec(curr_ref).toString().slice(0,-4);

                    arr_style.push(filename);
                    arr_style_src.push(curr_ref);
                } else if ( curr.attributes.src && curr.attributes.src.contains('.js') ) {
                    filename = /[^//]*\.(js)/g.exec(curr_ref).toString().slice(0,-3);

                    arr_script.push(filename);
                    arr_script_src.push(curr_ref);
                }
            };
        }

    }

    function downloadAssets(assets_name, assets_src, destination) {

        for (var i = assets_name.length - 1; i >= 0; i--) {
            
            if ( assets_src[i].contains('main') ) {
                casper.download(assets_src[i], destination + assets_name[i]);
            }

        };

    }

    checkAssets('link[rel="stylesheet"]');
    checkAssets('script[src]');

    info('  - External stylesheet: ' + arr_style.length);
    downloadAssets(arr_style, arr_style_src, 'css/');

    info('  - External scripts: ' + arr_script.length);
    downloadAssets(arr_script, arr_script_src, 'js/');

});


/* Testing end
--------------------------------------------------------------------------- */

casper.then( function () {
    drawLine();
});


/* Run test
--------------------------------------------------------------------------- */

casper.run();