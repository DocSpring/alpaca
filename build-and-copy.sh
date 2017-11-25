#!/bin/bash
set -e
gulp default
cp build/alpaca/bootstrap/alpaca.js ../form_api/vendor/assets/javascripts/alpaca.js
cp build/alpaca/bootstrap/alpaca.css ../form_api/vendor/assets/stylesheets/alpaca.css
