#!/bin/bash
set -e

NODE_VERSION="$(node --version)"
if [[ "$NODE_VERSION" != "v10"* ]]; then
  echo "Alpaca uses Gulp 3, which only supports Node <= 10." >&2
  echo "Your Node version is: $NODE_VERSION" >&2
  echo "Switch to a different version with NVM." >&2
  exit 1
fi

gulp default
cp build/alpaca/bootstrap/alpaca.js ../docspring/vendor/assets/javascripts/alpaca.js
cp build/alpaca/bootstrap/alpaca.css ../docspring/vendor/assets/stylesheets/alpaca.css
