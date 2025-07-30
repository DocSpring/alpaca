# DocSpring Modifications to Alpaca.js

This document tracks all custom modifications made by DocSpring to the alpaca.js library. These changes need to be ported when updating to the latest upstream version.

## Custom Commits (in chronological order)

### 1. Initial Fork Changes - Multiple Features (726788de)

**Author**: Nathan Broadbent  
**Date**: Apr 13, 2020  
**Description**: Large initial commit with multiple enhancements and fixes

- Added `build-and-copy.sh` script for DocSpring integration
- Modified gulpfile.js for build process
- Added Bootstrap 4 styling improvements to `alpaca-bootstrap.css`
- Added support for AddressAutocompleteField
- Added SignatureField implementation with signature_pad.js
- Enhanced CountryField, CurrencyField, DateField functionality
- Improved ArrayField behavior
- Enhanced RadioField and SelectField with better option handling
- Added third-party libraries: jquery.priceformat.js, pluralize.js, signature_pad.js
- Various i18n improvements
- Template improvements for date, radio, select, and signature controls

### 2. Handle Nullable Schema Types (5a3a5fab)

**Author**: Nathan Broadbent  
**Date**: Apr 13, 2020  
**Description**: Support for schemas with array types like `["string", "null"]`

- Modified Alpaca.js to handle array type definitions
- When type is an array, uses the first non-null type

### 3. Bug Fixes for SelectField and Bootstrap (7e6ec9fd)

**Author**: Nathan Broadbent  
**Date**: Apr 13, 2020  
**Description**: Fixed various bugs in SelectField and bootstrap view

### 4. Checkbox Submission Fix (255e4b6e)

**Author**: Nathan Broadbent  
**Date**: Apr 17, 2020  
**Description**: Fixed issue preventing form submission when required checkbox is unchecked

- Added proper handling for unchecked required checkboxes in validation

### 5. Checkbox Title Positioning (1e8d1dc5)

**Author**: Nathan Broadbent  
**Date**: Apr 17, 2020  
**Description**: Fixed checkbox title positioning (moved to the right)

- UI improvement for better checkbox label alignment

### 6. Extended Array Type Support (2e02f0fc)

**Author**: Nathan Broadbent  
**Date**: Apr 13, 2020  
**Description**: Comprehensive support for `type: ["string", "null"]` schemas

- Enhanced Alpaca.js type resolution logic
- Improved ListField handling for nullable types

### 7. Image Schema Heuristic Fix (bf586a25)

**Author**: Nathan Broadbent  
**Date**: Apr 21, 2020  
**Description**: Fixed image field detection for optional images

- Handles schemas with `oneOf: [..., { type: 'null' }]`
- Improved schema pattern matching for image fields

### 8. Radio Group Array Fix (0afff285)

**Author**: Nathan Broadbent  
**Date**: May 2, 2020  
**Description**: Fixed optional radio groups inside arrays

- Handles radio fields with `type: ["string", "null"]` and `enum: ["a", null]`
- Improved null value handling in ListField

### 9. Bootstrap 4 Date Field Update (3a468ea0)

**Author**: Nathan Broadbent  
**Date**: May 12, 2020  
**Description**: Updated date fields for Bootstrap 4 compatibility

- Integrated with TempusDominus Bootstrap 4 DateTime Picker
- Updated DateField.js and control-date.html template
- Modernized date picker UI

### 10. XSS Protection Implementation (5fbe440d)

**Author**: AdrianManteza  
**Date**: Feb 21, 2021  
**Description**: Applied XSS protection patch

- Added `sanitizeHtml` and `sanitizeHtmlTrimAttributes` functions to base.js
- Registered `sanitizeHtml` Handlebars helper
- Applied sanitization to text and textarea display templates
- Prevents JavaScript injection through field values

### 11. Refactor sanitizeHtml Helper (ee39c62e)

**Author**: AdrianManteza  
**Date**: Feb 24, 2021  
**Description**: Moved sanitizeHtml to HandlebarsTemplateEngine

- Relocated sanitization logic from base.js to HandlebarsTemplateEngine.js
- Applied sanitization to more templates (bootstrap display/edit containers and controls)
- Cleaner architecture for HTML sanitization

### 12. Placeholder Option Support (f0d2371d)

**Author**: nguyenntph  
**Date**: Dec 12, 2021  
**Description**: Added placeholder option for form fields

- Added support for `x-placeholder` schema property
- Automatically sets placeholder option from schema definition
- Improves form UX with placeholder text hints

## Summary of Key Changes

1. **Security**: XSS protection through HTML sanitization
2. **Bootstrap 4**: Updated date picker and various UI improvements
3. **Schema Enhancements**: Support for nullable types and array type definitions
4. **New Fields**: AddressAutocompleteField, SignatureField
5. **UI/UX**: Placeholder support, checkbox positioning, improved validation
6. **Bug Fixes**: Form submission with unchecked required checkboxes, radio/select field improvements

## Integration Notes

- DocSpring uses the Bootstrap build of alpaca.js
- Build process requires Node v10 due to Gulp 3 dependency
- Built files are copied to DocSpring's vendor/assets directory
- Handlebars.js is also copied as a dependency
