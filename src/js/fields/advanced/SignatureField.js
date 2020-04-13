(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SignatureField = Alpaca.ControlField.extend(
    /**
     * @lends Alpaca.Fields.SignatureField.prototype
     */
    {
        /**
         * @see Alpaca.Field#getFieldType
         */
        getFieldType: function() {
            return "signature";
        },

        resizeCanvas: function() {
          if (this.schema['x-input-aspect-ratio'] != null) {
            var $container = $(this.control).filter('.alpaca-signature-body')
            // Set the signature pad height to match the field's aspect ratio in the template editor.
            // Minimum aspect ratio is 5, otherwise it's too hard to sign.
            $container.height(
              $container.width() / Math.min(5, this.schema['x-input-aspect-ratio']));
          }

          var ratio = Math.max(window.devicePixelRatio || 1, 1);
          this.canvas.width = this.canvas.offsetWidth * ratio;
          this.canvas.height = this.canvas.offsetHeight * ratio;
          this.canvas.getContext("2d").scale(ratio, ratio);
          this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;
            var el = this.control;

            this.base(model, function() {
              self.off("ready");
              self.on("ready", function() {
                // Still have to do this.
                requestAnimationFrame(function() {
                  self.canvas = $(el).find('canvas')[0];
                  self.signaturePad = new SignaturePad(self.canvas, {
                    onBegin: function() {
                        if (Alpaca.onSignaturePadBegin) {
                            Alpaca.onSignaturePadBegin();
                        }
                    },
                    onEnd: function() {
                        if (Alpaca.onSignaturePadEnd) {
                            Alpaca.onSignaturePadEnd();
                        }

                      // This string just passes the validation check for required signatures.
                      // self.setValue(
                      //   self.signaturePad.isEmpty() ? null : { base64: 'HAS_SIGNATURE' });
                      self.onChange();
                    },
                  });

                  window.addEventListener("resize", self.resizeCanvas.bind(self));
                  self.resizeCanvas();

                  $(el).on('click', 'a.alpaca-signature-clear', function(e) {
                      if (self.signaturePad) {
                          e.preventDefault();
                          self.setValue(null);
                      }
                  });
                });
              });

              callback();
            });
        },

        /**
         * Returns the value of this field.
         *
         * @returns {Any} value Field value.
         */
        getValue: function()
        {
            var self = this;
            if (!self.signaturePad) return null;
            if (self.signaturePad.isEmpty()) return null;
            return {
              base64: self.signaturePad.toDataURL().split(',')[1]
            }
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value)
        {
            if (!this.signaturePad) return;
            var self = this;

            if (!value) {
                self.signaturePad.clear();
            } else if (value.base64 instanceof Array) {
                // This is a fake signature sent from our 'random data' feature. It's not actually base64.
                self.signaturePad.fromData(value.base64);
                self.onChange();
            }
        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function()
        {
            this.base();
            this.refreshValidationState();
        }

        /* builder_helpers */
        ,

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Signature Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Signature pad where you can draw your signature using the mouse.";
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("signature", Alpaca.Fields.SignatureField);

})(jQuery);
