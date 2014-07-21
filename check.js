
/* Config
--------------------------------------------------------------------------- */

var casper_options = {
    clientScripts: ['./bower_components/jquery/dist/jquery.min.js']
};

var casper      = require('casper').create(casper_options),
    utils       = require('utils'),
    colorizer   = require('colorizer').create('Colorizer'),
    helper      = require('./helper');
    

/* Testing start
--------------------------------------------------------------------------- */

casper.start(casper.cli.get('url'));

casper.then( function () {
    helper.clearScreen();
    helper.drawLine();
    this.echo('Suitmedia web validation');
    
    if ( !casper.cli.get('url') ) {
        helper.warn('No URL specified.');
        helper.info('eg: casperjs check.js --url=http://suitmedia.com');
        helper.exitCasper();
    }

    var pageURL     = this.getCurrentUrl(),
        pageStatus  = this.status().currentHTTPStatus;

    this.echo('link\t: ' + pageURL );

    if ( pageStatus !== 200 ) {

        if ( pageStatus === null ) {
            this.echo('');
            helper.warn('Test fail. Run gulp test --url [url] to conduct test.');
            this.echo('');
        } else {
            this.echo('status\t: ' + colorizer.colorize(pageStatus, 'WARNING') );
        }

        helper.exitCasper();
    } else {
        this.echo('status\t: ' + colorizer.colorize(pageStatus, 'TRACE') );
    }

    helper.drawLine();
});


/* Meta declaration
--------------------------------------------------------------------------- */

casper.then( function () {
    var meta_desc   = 'meta[name="description"]',
        meta_vp     = 'meta[name="viewport"]';

    helper.title('Necessary meta tag');

    if ( this.exists(meta_desc) ) {
        helper.info('  - Description: ' + this.getElementAttribute(meta_desc, 'content'));
    } else {
        helper.warn('  - Description: not specified');
    }

    if ( this.exists(meta_vp) ) {
        helper.info('  - Viewport: ' + this.getElementAttribute(meta_vp, 'content'));
    } else {
        helper.warn('  - Viewport: not specified');
    }
});


/* Favicon
--------------------------------------------------------------------------- */

casper.then( function () {
    var favicon = 'link[rel*="icon"]';

    helper.title('Favicon');

    if ( this.exists(favicon) ) {
        var favicon_href = this.getElementAttribute(favicon, 'href');

        helper.info('  - Favicon is specified: ' + favicon_href);
    } else {
        helper.warn('  - No favicon specified');
    }
});


/* ARIA Landmark
--------------------------------------------------------------------------- */

casper.then( function () {
    var arr_role        = ['banner', 'main', 'contentinfo', 'navigation', 'search'],
        arr_role_length = arr_role.length;

    helper.title('ARIA Landmark');

    for (var i = arr_role_length - 1; i >= 0; i--) {
        var _current = '[role="' + arr_role[i] + '"]';

        if ( this.exists(_current) ) {
            helper.info('  - ' + arr_role[i]);
        } else {
            helper.warn('  - ' + arr_role[i]);
        }
    }
});


/* i18n
--------------------------------------------------------------------------- */

casper.then( function () {
    var lang            = 'html[lang]',
        arr_charset     = ['meta[charset]', 'meta[http-equiv="Content-Type"]'],
        charsetExist    = 0;

    helper.title('Internationalization');

    if ( this.exists(lang) ) {
        var content = this.getElementAttribute(lang, 'lang');

        helper.info('  - Language is specified: ' + content);
    } else {
        helper.warn('  - Language is not specified');
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

            helper.info('  - Character encoding is specified: ' + content);
            charsetExist = 1;
            break;
        }
    }

    if ( charsetExist === 0 ) {
        helper.warn('  - Character encoding is not specified');
    }
});


/* Images with alt
--------------------------------------------------------------------------- */

casper.then( function () {
    var img     = this.getElementsInfo('img'),
        no_alt  = 0;

    if ( !img.length ) return;

    helper.title('Images');

    for (var i = img.length - 1; i >= 0; i--) {
        var curr        = img[i],
            curr_alt    = curr.attributes.alt;

        if ( curr_alt === '' ) {
            no_alt += 1;
        }
    }

    helper.info('  - Total images: ' + img.length);
    helper.warn('  - Images with no alt text: ' + no_alt);
});


/* Get assets
--------------------------------------------------------------------------- */

casper.then( function () {
    var arr_style       = [],
        arr_style_src   = [],
        arr_script      = [],
        arr_script_src  = [];

    helper.title('Assets');

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

    helper.info('  - External stylesheet: ' + arr_style.length);
    downloadAssets(arr_style, arr_style_src, 'css/');

    helper.info('  - External scripts: ' + arr_script.length);
    downloadAssets(arr_script, arr_script_src, 'js/');

});


/* Testing end
--------------------------------------------------------------------------- */

casper.then( function () {
    helper.drawLine();
});


/* Run test
--------------------------------------------------------------------------- */

casper.run();