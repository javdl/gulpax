'use strict';

/**
 * Dependencies
 */

var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    coffee = require('metalsmith-coffee'),
    sass = require('metalsmith-sass'),
    Handlebars = require('handlebars'),
    fs = require('fs');

// Joost Extra requirements
var
    ignore = require('metalsmith-ignore'),
    // This plugin provides a simple way to ensure that front matter values regarding SEO are valid.
    seo = require('metalsmith-seo-checker'),
    // A Metalsmith plugin that adds support for draft, private, and future-dated posts. Enables you to do multiple builds for production and development. Gives you a callback so you can automate rebuilding metalsmith with a cron job or node script when future-dated posts become published.
    publish = require('metalsmith-publish'),
    // A Metalsmith plugin that integrates the Lunr.js client side search engine.
    lunr = require('metalsmith-lunr'),
    // Highlight.js code highlighting in Markdown files (Include a highlight.js theme somewhere in your templates.)
    metallic = require('metalsmith-metallic'),
    // A Metalsmith plugin that extracts headings from HTML files and attaches them to the file's metadata.
    //       headings = require('metalsmith-headings'),
    collections = require('metalsmith-collections');

/**
 * Local config
 */

// useful file paths (can later be put for global use)
var path = {
    src: 'src',
    build: '../app/metalsmith-dist',
    // build: 'build',
    bower: 'bower_components',
    templates: 'templates',
    css: 'assets/styles',
    scripts: 'scripts',
    sass: 'scss'
};

var configtemplates = {};
configtemplates.engine = 'handlebars';
configtemplates.partials = {
    'header': 'partials/header',
    'footer': 'partials/footer',
    'navbar': 'partials/navbar',
    'offcanvas-scotchpanels': 'partials/offcanvas-scotchpanels'
};
configtemplates.directory = 'templates';

var findTemplate = function(config) {
    var pattern = new RegExp(config.pattern);

    return function(files, metalsmith, done) {
        for (var file in files) {
            if (pattern.test(file)) {
                var _f = files[file];
                if (!_f.template) {
                    _f.template = config.templateName;
                }
            }
        }
        done();
    };
};

Metalsmith(__dirname)
    .use(publish({
        draft: false
    }))
    .use(collections({
        pages: {
            pattern: 'content/pages/*.md'
        },
        posts: {
            pattern: 'content/posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(findTemplate({
        pattern: 'posts',
        templateName: 'post.hbt'
    }))
    .use(markdown())
    .use(permalinks({
        pattern: ':title'
    }))
    //.use(templates('handlebars'))
    .use(templates(configtemplates))
    .use(sass({
        outputStyle: 'compressed'
    }))
    .use(coffee())
    .use(ignore([
        path.templates + '/**/*',
        path.css + '/**/*',
        path.sass + '/**/*',
        path.scripts + '/**/*',
        path.bower + '/**/*'
    ]))
    .destination('./' + path.build)
    .build(function(err, files) {
        if (err) {
            throw err;
        }
    });
