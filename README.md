baze-test
=========

> Automated testing tools

## Requirements

* [PhantomJS](http://phantomjs.org/)
* [CasperJS](http://casperjs.org/)
* [Gulp](http://gulpjs.com/)

## How to use

1. Make sure PhantomJS and CasperJS are installed
2. Clone the repository `git clone git@github.com:Suitmedia/baze-test.git`
3. Install project dependencies with `npm install` and `bower install`
4. Start testing remote URL by doing `casperjs check.js --url=http://example.com`
5. Sit back and you got pretty report

### CSSLint and JSHint

`gulp lint` to run CSSLint and JSHint test after running `casperjs check.js --url=http://example.com`

## Result example

> casperjs check.js --url=http://suitmedia.com

![result](http://bobby.suitmedia.net/assets/img/baze-test-1.jpg)

## Test coverage

* Meta tags
* Favicon
* Aria landmark
* i18n
* Images validation
* [CSSLint](https://github.com/CSSLint/csslint)
* [jshint](https://github.com/jshint/jshint/)
* more to come
