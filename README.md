baze-test
=========

> Automated testing tools with Gulp

## Requirements

* [Gulp](http://gulpjs.com/)
* [PhantomJS](http://phantomjs.org/) v1.9.8
* [CasperJS](http://casperjs.org/)

## How to use

1. Make sure requirements are installed
2. Clone the repository `git clone git@github.com:Suitmedia/baze-test.git`
3. Install project dependencies with `npm install` and `bower install`

## Available tasks

|Tasks 									|Purpose   	                                                        |
|---                                    |---			                                                    |
|`gulp w3 --url [url]`                  |Test given URL using W3C Validator                                 |
|`gulp test --url [url]`                |Test given URL with Casperjs                                       |
|`gulp lint`                            |Lint CSS and JS assets                                             |
|`gulp psi-desktop --url [url]`         |Run Google PageSpeed Insights with Desktop strategy   			    |
|`gulp psi-mobile --url [url]`          |Run Google PageSpeed Insights with Mobile strategy                 |
|`gulp clean`                           |Remove downloaded CSS and JS files from previous test.     	    |
**NOTES**
- Running `gulp test` will automatically download CSS and JS file which contains 'main' in the filename. Downloaded CSS file will be stored into `css/` dan JS file into `js/` directory.
- CSS Lint and JSHint will generate report located at `results/`.
- Running `gulp clean` will remove `results/`, `css/`, and `js/` directory.


example test:
> gulp test --url http://suitmedia.com
>
> gulp lint
>
> gulp psi-desktop --url http://suitmedia.com
>
> gulp psi-mobile --url http://suitmedia.com

## Result example

![result](http://bobby.suitmedia.net/assets/img/baze-test-1.jpg)

## Test coverage

* [W3C Validator](http://validator.w3.org/)
* Meta tags
* Favicon
* Aria landmark
* i18n
* Images validation
* [CSSLint](https://github.com/CSSLint/csslint)
* [jshint](https://github.com/jshint/jshint/)
* [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) (plugin by [Addy Osmani](https://github.com/addyosmani/psi-gulp-sample/blob/master/gulpfile.js))
* more to come
