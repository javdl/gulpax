I would recommend making some minor adjustments in the Laravel repo by adding node_modules to .gitignore and then creating a package.json so it’s just a simple npm install after cloning but otherwise it looks great.

# Installation
Create a package.json where gulp dependencies are saved
	npm init

	npm install

## GLOBAL install:
	npm install gulp -g &&
	npm install bower -g &&

## Then in assets folder:
	npm install gulp --save-dev &&    #sudo for linux
	npm install bower --save-dev &&

## Install needed plugin:
	npm install gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-rimraf gulp-notify gulp-rename gulp-livereload tiny-lr gulp-cache gulp-less gulp-changed gulp-watch gulp-util gulp-filesize gulp-autoprefixer gulp-gzip --save-dev &&

# Run it!
	bower install &&
	gulp
(is a command, execute it in git bash)

## To update
	npm update