#!/bin/bash
set -e

# Build with Gulp 5 (works with modern Node versions)
./node_modules/.bin/gulp default
cp build/alpaca/bootstrap/alpaca.js \
  ../docspring/vendor/assets/javascripts/alpaca.js
cp build/alpaca/bootstrap/alpaca.css \
  ../docspring/vendor/assets/stylesheets/alpaca.css
cp ./node_modules/handlebars/dist/handlebars.min.js \
  ../docspring/vendor/assets/javascripts/handlebars.min.js
