baze-test
=========

> Automated testing tools

## Requirements

* [PhantomJS](http://phantomjs.org/)
* [CasperJS](http://casperjs.org/)

## How to use

1. Make sure PhantomJS and CasperJS are installed
2. Clone the repository `git clone git@github.com:Suitmedia/baze-test.git`
3. Install project dependencies with `npm install` and `bower install`
4. Start testing remote URL by doing `casperjs check.js --url=http://example.com`
5. Sit back and you got pretty report

## Result example

> casperjs check.js --url=http://example.com

![result](http://bobby.suitmedia.net/assets/img/baze-test-1.jpg)

## Test coverage

* Meta viewport declaration
* Favicon
* Aria landmark
* i18n
* more to come
