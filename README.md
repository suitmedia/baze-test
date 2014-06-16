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
6. run `gulp clean` to conduct new test

### CSSLint and JSHint

`gulp lint` to run CSSLint and JSHint test after running `casperjs check.js --url=http://example.com`

### PageSpeed Insights

Baze Test offer `psi` task to run PageSpeed Insights test for both **desktop** and **mobile** strategy. Run `gulp psi-[strategy] --url [url to be tested]` to conduct test.

example:
`gulp psi-desktop --url http://suitmedia.com`
`gulp psi-mobile --url http://suitmedia.com`

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
* [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) (plugin by [Addy Osmani](https://github.com/addyosmani/psi-gulp-sample/blob/master/gulpfile.js))
* more to come
