# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is DocSpring's fork of alpaca.js (https://github.com/gitana/alpaca), a JSON forms library for jQuery and Bootstrap. DocSpring uses this library for their 'simple web forms' feature.

## Build Commands

**Important**: This project uses Node v10 and Gulp 3. The build script explicitly checks for Node v10.

```bash
# Install dependencies
npm install

# Build the project (uses gulp)
npm run build
# or
gulp default

# Build and copy to DocSpring vendor folder
./build-and-copy.sh

# Clean build artifacts
npm run clean

# Run local development server
npm run server

# Build documentation site
npm run site
```

## DocSpring Build Process

The `build-and-copy.sh` script:
1. Builds alpaca using gulp
2. Copies built files to the DocSpring main repository:
   - `build/alpaca/bootstrap/alpaca.js` → `../docspring/vendor/assets/javascripts/alpaca.js`
   - `build/alpaca/bootstrap/alpaca.css` → `../docspring/vendor/assets/stylesheets/alpaca.css`
   - `node_modules/handlebars/dist/handlebars.min.js` → `../docspring/vendor/assets/javascripts/handlebars.min.js`

## Architecture Overview

### Core Components

- **Field System**: Base classes in `src/js/` (Field.js, ControlField.js, ContainerField.js)
- **Field Types**: 
  - Basic fields: `src/js/fields/basic/` (Text, Number, Hidden, etc.)
  - Advanced fields: `src/js/fields/advanced/` (Date, Currency, Address, etc.)
  - List fields: `src/js/fields/list/` (Select, Radio, Checkbox, etc.)
- **Template Engines**: Handlebars-based templating with view-specific templates
- **Views**: Different UI frameworks supported:
  - Bootstrap (`src/js/views/bootstrap.js`, `src/templates/bootstrap-*/`)
  - jQuery UI (`src/js/views/jqueryui.js`)
  - jQuery Mobile (`src/js/views/jquerymobile.js`)
  - Web/vanilla (`src/js/views/web.js`)

### Build System

- Uses Gulp 3 with various tasks defined in `gulpfile.js`
- Outputs to `build/alpaca/` with separate builds for each UI framework
- UMD wrapper for AMD/CommonJS compatibility

### DocSpring Customizations

DocSpring has made several modifications to the upstream alpaca.js:
1. XSS protection with sanitizeHtml helper
2. Placeholder option support for fields
3. Bootstrap 4 compatibility updates
4. Support for nullable schema types (e.g., `type: ["string", "null"]`)
5. Various bug fixes for checkboxes, radio buttons, and form submission
6. Babel transpilation for IE11 compatibility

See `DOCSPRING_MODIFICATIONS.md` for detailed list of changes.