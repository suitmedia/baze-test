
/* Config
--------------------------------------------------------------------------- */

var casper_options = {
    clientScripts: ['./bower_components/jquery/dist/jquery.min.js']
  // , verbose: true
  // , logLevel: 'debug'
};

var casper  = require('casper').create(casper_options),
    utils   = require('utils');


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
        drawLine();
        casper.exit();
    }

    this.echo('link: ' + this.getCurrentUrl());
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
    var assets = this.evaluate( function () {
        var _css_arr        = [],
            _css_arr_name   = [],
            _js_arr         = [],
            _js_arr_name    = [];

        var _asset = {

            css: function () {
                var el          = $('link[rel="stylesheet"]'),
                    el_length   = el.length;

                if ( !el_length ) {
                    return false;
                }

                for (var i = 0; i < el_length; i++) {
                    var _this       = el.eq(i),
                        _this_src   = _this.attr('href'),
                        _this_name  = /[^//]*\.(css)/g.exec(_this_src);

                    _css_arr.push(_this_src);
                    _css_arr_name.push(_this_name);
                }

                return {
                    'css_array': _css_arr,
                    'css_source': _css_arr_name
                };
            },

            js: function () {
                var el          = $('script[src]'),
                    el_length   = el.length;

                if ( !el_length ) {
                    return false;
                }

                for (var i = 0; i < el_length; i++) {
                    var _this       = el.eq(i),
                        _this_src   = _this.attr('src'),
                        _this_name  = /[^//]*\.(js)/g.exec(_this_src);

                    _js_arr.push(_this_src);
                    _js_arr_name.push(_this_name);
                }

                return {
                    'js_array': _js_arr,
                    'js_source': _js_arr_name
                };
            }

        };

        return {
            'css': _asset.css(),
            'js': _asset.js()
        };
    });

    var assets_css      = assets.css.css_array,
        assets_css_src  = assets.css.css_source,

        assets_js       = assets.js.js_array,
        assets_js_src   = assets.js.js_source;

    title('Assets');
    info('  - External stylesheet: ' + assets_css.length);
    info('  - External script: ' + assets_js.length);

    for ( var i = 0; i < assets_css.length; i++ ) {
        var _this       = assets_css[i],
            _this_name  = assets_css_src[i].toString().slice(0,-4);

        casper.download(_this, 'css/' + _this_name);
    }

    for ( var i = 0; i < assets_js.length; i++ ) {
        var _this       = assets_js[i],
            _this_name  = assets_js_src[i].toString().slice(0,-3);

        if ( _this_name.indexOf('jquery') ) {
            casper.download(_this, 'js/' + _this_name);
        }
    }
});


/* Testing end
--------------------------------------------------------------------------- */

casper.then( function () {
    drawLine();
});


/* Run test
--------------------------------------------------------------------------- */

casper.run();