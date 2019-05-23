#!/bin/bash
set -e
gulp default
cp build/alpaca/bootstrap/alpaca.js ../docspring/vendor/assets/javascripts/alpaca.js
cp build/alpaca/bootstrap/alpaca.css ../docspring/vendor/assets/stylesheets/alpaca.css
