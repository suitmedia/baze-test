
var clearScreen = function () {
    for (var i = 10 - 1; i >= 0; i--) {
        console.log('\n');
    }
};

var drawLine = function () {
    console.log('-------------------------------------------------------');
};

var title = function (text) {
    return casper.echo('# ' + text, 'PARAMETER');
};

var param = function (text) {
    return casper.echo(text, 'PARAMETER');
};

var info = function (text) {
    return casper.echo(text, 'INFO');
};

var warn = function (text) {
    return casper.echo(text, 'WARNING');
};

var comment = function (text) {
    return casper.echo(text, 'COMMENT');
};

var exitCasper = function () {
    drawLine();
    casper.exit();
};

exports.clearScreen = clearScreen;
exports.drawLine    = drawLine;
exports.title       = title;
exports.param       = param;
exports.info        = info;
exports.warn        = warn;
exports.comment     = comment;
exports.exitCasper  = exitCasper;