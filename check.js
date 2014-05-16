
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


/* Viewport declaration
--------------------------------------------------------------------------- */

casper.then( function () {
    var meta = this.evaluate( function () {

        var check = {

            description: function () {
                var el = $('meta[name="description"]');

                if ( el.length ) {
                    return {
                        'status': true,
                        'content': el.attr('content')
                    };
                } else {
                    return {
                        'status': false
                    };
                }
            },

            vp: function () {
                var el = $('meta[name="viewport"]');

                if ( el.length ) {
                    return {
                        'status': true,
                        'content': el.attr('content')
                    };
                } else {
                    return {
                        'status': false
                    };
                }
            }

        };

        return {
            'description': check.description(),
            'viewport': check.vp()
        };

    });

    title('Necessary meta tag');

    if ( meta.description.status ) {
        info('  - Description: ' + meta.description.content);
    } else if ( !meta.status ) {
        warn('  - Description: Fail');
    }

    if ( meta.viewport.status ) {
        info('  - Viewport: ' + meta.viewport.content);
    } else {
        warn('  - Viewport: not specified');
    }
});


/* Favicon
--------------------------------------------------------------------------- */

casper.then( function () {
    var favicon = this.evaluate( function () {
        var _favicon = $('link[rel*="icon"]');

        if ( _favicon.length ) {
            return {
                'status': true,
                'content': _favicon.attr('href')
            };
        }

        return false;
    });

    title('Favicon');

    if ( favicon.status ) {
        info('  - Favicon is specified: ' + favicon.content);
    } else {
        warn('  - No favicon specified');
    }
});


/* ARIA Landmark
--------------------------------------------------------------------------- */

casper.then( function () {
    var Landmark = this.evaluate( function () {

        var role = {

            banner: function () {
                var _banner = $('[role="banner"]');

                if ( _banner.length ) return true;
                return false;
            },

            main: function () {
                var _main = $('[role="main"]');

                if ( _main.length ) return true;
                return false;
            },

            contentinfo: function () {
                var _contentinfo = $('[role="contentinfo"]');

                if ( _contentinfo.length ) return true;
                return false;
            },

            navigation: function () {
                var _navigation = $('[role="navigation"]');

                if ( _navigation.length ) return true;
                return false;
            },

            search: function () {
                var _search = $('[role="search"]');

                if ( _search.length ) return true;
                return false;
            }

        };

        return {
            'banner': role.banner(),
            'main': role.main(),
            'contentinfo': role.contentinfo(),
            'navigation': role.navigation(),
            'search': role.search()
        };


    });

    title('ARIA Landmark');
    
    if ( Landmark.banner ) {
        info('  - Banner');
    } else {
        warn('  - Banner');
    }
    
    if ( Landmark.main ) {
        info('  - Main');
    } else {
        warn('  - Main');
    }
    
    if ( Landmark.contentinfo ) {
        info('  - Contentinfo');
    } else {
        warn('  - Contentinfo');
    }
    
    if ( Landmark.navigation ) {
        info('  - Navigation');
    } else {
        warn('  - Navigation');
    }
    
    if ( Landmark.search ) {
        info('  - Search');
    } else {
        warn('  - Search');
    }
});


/* i18n
--------------------------------------------------------------------------- */

casper.then( function () {
    var i18n = this.evaluate( function () {

        var check = {

            encode: function () {
                var meta1 = $('meta[charset]');
                var meta2 = $('meta[content*="charset"]');

                if ( meta1.length ) {
                    return {
                        'status': true,
                        'content': meta1.attr('charset')
                    };
                } else if ( meta2.length ) {
                    return {
                        'status': true,
                        'content': meta2.attr('content')
                    };
                } else {
                    return {
                        'status': false
                    };
                }

            },

            language: function () {
                var lang = $('html[lang]');

                if ( lang.length ) {
                    return {
                        'status': true,
                        'content': lang.attr('lang')
                    };
                }

                return false;
            }

        };

        return {
            'encode': check.encode(),
            'language': check.language()
        };
    });

    title('Internationalization');

    if ( i18n.encode.status ) {
        info('  - Character encoding is specified: ' + i18n.encode.content);
    } else {
        warn('  - Character encoding is not specified');
    }

    if ( i18n.language.status ) {
        info('  - Language is specified: ' + i18n.language.content);
    } else {
        warn('  - Language is not specified');
    }
});


/* Images with alt
--------------------------------------------------------------------------- */

casper.then( function () {
    var images = this.evaluate( function () {
        var img              = $('img'),
            img_length       = img.length,

            img_alt         = [],
            img_href        = [],

            img_alt_count   = 0;

        for (var i = img_length - 1; i >= 0; i--) {
            var _this = img.eq(i);

            if ( _this.attr('alt') ) {
                img_alt.push(_this.attr('alt'));
                img_alt_count++;
            } else {
                img_href.push(_this.attr('src'));
            }
        };

        return {
            'length'    : img_length,
            'altCount'  : img_alt_count,
            'noAltCount': img_length - img_alt_count,
            'noAltSrc'  : img_href
        };
    });

    title('Images');

    info('  - Total images: ' + images.length);
    warn('  - Images with no alt text: ' + images.noAltCount);
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
                };

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
                };

                return {
                    'js_array': _js_arr,
                    'js_source': _js_arr_name
                };
            }

        };

        return {
            'css': _asset.css(),
            'js': _asset.js()
        }
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