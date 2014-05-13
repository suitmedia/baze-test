
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

function info(text) {
    return casper.echo(text, 'INFO');
}

function warn(text) {
    return casper.echo(text, 'WARNING');
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
    var meta_vp = this.evaluate( function () {
        var vp = $('meta[name="viewport"]');

        if ( vp.length ) {
            return {
                'status': true,
                'content': vp.attr('content')
            };
        } else {
            return {
                'status': false
            };
        }

    });

    title('Meta viewport');

    if ( meta_vp.status ) {
        info('  - is specified: ' + meta_vp.content);
    } else if ( !meta_vp.status ) {
        warn('  - is not specified');
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


/* Testing end
--------------------------------------------------------------------------- */

casper.then( function () {
    drawLine();
});


/* Run test
--------------------------------------------------------------------------- */

casper.run();