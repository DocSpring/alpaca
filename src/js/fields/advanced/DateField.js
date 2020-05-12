(function($) {

    // NOTE: this requires tempusdominus/bootstrap-4
    // NOTE: this requires moment.js

    var Alpaca = $.alpaca;

    Alpaca.Fields.DateField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.DateField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "date";
        },

        getDefaultFormat: function() {
            return Alpaca.defaultDateFormat;
        },

        getDefaultSerializeFormat: function() {
            return Alpaca.defaultSerializeDateFormat;
        },

        getDefaultExtraFormats: function() {
            return [];
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            var self = this;

            // default html5 input type = "date";
            //this.inputType = "date";

            this.base();

            if (!self.options.picker)
            {
                self.options.picker = {};
            }

            if (typeof(self.options.picker.useCurrent) === "undefined") {
                self.options.picker.useCurrent = false;
            }
            if (typeof(self.options.picker.sideBySide) === "undefined") {
                self.options.picker.sideBySide = false;
            }
            if (typeof(self.options.picker.showTodayButton) === "undefined") {
                self.options.picker.showTodayButton = true;
            }
            if (typeof(self.options.picker.showClear) === "undefined") {
                self.options.picker.showClear = true;
            }
            if (typeof(self.options.picker.showClose) === "undefined") {
                self.options.picker.showClose = true;
            }


            // date format

            if (self.options.picker.format) {
                self.options.dateFormat = self.options.picker.format;
            }
            if (!self.options.dateFormat) {
                self.options.dateFormat = self.getDefaultFormat();
            }
            if (!self.options.picker.format) {
                self.options.picker.format = self.options.dateFormat;
            }

            if (!self.options.picker.locale) {
                self.options.picker.locale = Alpaca.defaultLocale;
            }

            if (!self.options.picker.dayViewHeaderFormat) {
                self.options.picker.dayViewHeaderFormat = "MMMM YYYY";
            }

            if (self.options.picker.allowInputToggle == null) {
                self.options.picker.allowInputToggle = true;
            }

            if (!self.options.placeholder) {
                self.options.placeholder = self.options.dateFormat;
            }


            // extra formats
            if (!self.options.picker.extraFormats) {
                var extraFormats = self.getDefaultExtraFormats();
                if (extraFormats) {
                    self.options.picker.extraFormats = extraFormats;
                }
            }

            if (typeof(self.options.manualEntry) === "undefined")
            {
                self.options.manualEntry = false;
            }
        },

        onKeyPress: function(e)
        {
            if (this.options.manualEntry)
            {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            else
            {
                this.base(e);
                return;
            }
        },

        onKeyDown: function(e)
        {
            if (this.options.manualEntry)
            {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            else
            {
                this.base(e);
                return;
            }
        },

        beforeRenderControl: function(model, callback)
        {
            this.field.css("position", "relative");

            callback();
        },

        /**
         * @see Alpaca.Fields.TextField#afterRenderControl
         */
        afterRenderControl: function(model, callback) {
            var self = this;

            this.base(model, function() {

                if (self.view.type !== "display")
                {
                    if ($.fn.datetimepicker)
                    {
                        var controlEl = self.getControlEl();
                        controlEl.datetimepicker(self.options.picker);
                        self.picker = controlEl.data("datetimepicker");

                        // After setting up the datepicker, change control to the input,
                        // so we can get the value.
                        self.control = self.control.find('> input');

                        if (self.picker && self.options.dateFormat)
                        {
                            self.picker.format(self.options.dateFormat);
                        }
                        if (self.picker)
                        {
                            self.options.dateFormat = self.picker.format();
                        }
                        // with date-time picker, trigger change using plugin
                        self.getFieldEl().on("dp.change", function(e) {

                            // we use a timeout here because we want this to run AFTER control click handlers
                            setTimeout(function() {
                                self.onChange.call(self, e);
                                self.triggerWithPropagation("change", e);
                            }, 250);

                        });

                        // set value if provided
                        if (self.data) {
                            self.picker.date(self.data);
                        }
                    }
                }

                callback();

            });
        },

        /**
         * Allows manual entry mode to be toggled on and off.
         *
         * @param manualEntry
         */
        setManualEntry: function(manualEntry)
        {
            this.options.manualEntry = manualEntry;
        },

        /**
         * Returns field value as a JavaScript Date.
         *
         * @returns {Date} Field value.
         */
        getDate: function()
        {
            var self = this;

            var date = null;
            try
            {
                if (self.picker)
                {
                    date = (self.picker.date() ? self.picker.date()._d: null);
                }
                else
                {
                    date = new Date(this.getUnserializedValue());
                }
            }
            catch (e)
            {
                console.error(e);
            }

            return date;
        },

        /**
         * Returns field value as a JavaScript Date.
         *
         * @returns {Date} Field value.
         */
        date: function()
        {
            return this.getDate();
        },

        getUnserializedValue: function() {
            var self = this;
            var value = this.data;

            if (!this.isDisplayOnly())
            {
                value = self.getControlValue();
            }

            value = self.ensureProperType(value);
            return value;
        },

        /**
         * Returns the value of this field.
         *
         * @returns {Any} value Field value.
         */
        getValue: function()
        {
            var self = this;
            var value = self.getUnserializedValue();

            var serializeFormat = self.getDefaultSerializeFormat();
            if (value && serializeFormat) {
                value = Alpaca.moment(value, self.options.dateFormat).format(serializeFormat);
            }

            // some correction for type
            value = self.ensureProperType(value);
            return value;
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e)
        {
            this.base();

            this.refreshValidationState();
        },

        isAutoFocusable: function()
        {
            return false;
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateDateFormat();
            valInfo["invalidDate"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidDate"), [this.options.dateFormat]),
                "status": status
            };

            return baseStatus && valInfo["invalidDate"]["status"];
        },

        /**
         * Validates date format.
         *
         * @returns {Boolean} True if it is a valid date, false otherwise.
         */
        _validateDateFormat: function()
        {
            var self = this;

            var isValid = true;

            if (self.options.dateFormat)
            {
                var value = self.getUnserializedValue();
                if (value || self.isRequired())
                {
                    // collect all formats
                    var dateFormats = [];
                    dateFormats.push(self.options.dateFormat);
                    if (self.options.picker && self.options.picker.extraFormats)
                    {
                        for (var i = 0; i < self.options.picker.extraFormats.length; i++)
                        {
                            dateFormats.push(self.options.picker.extraFormats[i]);
                        }
                    }

                    for (var i = 0; i < dateFormats.length; i++)
                    {
                        isValid = isValid || Alpaca.moment(value, self.options.dateFormat, true).isValid();
                    }
                }
            }

            return isValid;
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value)
        {
            var self = this;

            this.base(value);

            if (this.picker)
            {
                var parsedDate = Alpaca.moment(value, self.options.dateFormat, true);
                if (!parsedDate.isValid()) {
                    // Try parsing date with no fixed format (e.g. YYYY-MM-DD)
                    parsedDate = Alpaca.moment(value);
                }

                if (parsedDate.isValid())
                {
                    this.picker.date(parsedDate.format(self.options.dateFormat));
                }
            }
        },

        destroy: function()
        {
            this.base();

            this.picker = null;
        }


        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Date Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Date Field";
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"date",
                        "enum" : ["date"],
                        "readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dateFormat": {
                        "title": "Date Format",
                        "description": "Date format (using moment.js format)",
                        "type": "string"
                    },
                    "picker": {
                        "title": "DatetimePicker options",
                        "description": "Options that are supported by the <a href='https://github.com/tempusdominus/bootstrap-4'>TempusDominus Bootstrap 4 DateTime Picker</a>.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "dateFormat": {
                        "type": "text"
                    },
                    "picker": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerMessages({
        "invalidDate": "Invalid date for format {0}"
    });
    Alpaca.registerFieldClass("date", Alpaca.Fields.DateField);
    Alpaca.registerDefaultFormatFieldMapping("date", "date");

})(jQuery);
