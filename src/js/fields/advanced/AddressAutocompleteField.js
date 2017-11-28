(function($) {

    var Alpaca = $.alpaca;

  Alpaca.Fields.AddressAutocompleteField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.AddressAutocompleteField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "addressautocomplete";
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {
              self.off("ready");
              self.on("ready", function() {
                var options = {
                  types: ['address']
                };
                this.autocomplete = new google.maps.places.Autocomplete(self.control[0], options);

                this.autocomplete.addListener('place_changed', function () {
                  console.log('address changed');
                  // Trigger localStorage hook
                  self.control.trigger('alpaca-change');
                });
              });

              callback();
            });
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Address Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
          return "Address autocompletion field.";
        }

        /* end_builder_helpers */
    });

  Alpaca.registerFieldClass("addressautocomplete", Alpaca.Fields.AddressAutocompleteField);
  Alpaca.registerDefaultFormatFieldMapping("address", "addressautocomplete");

})(jQuery);
