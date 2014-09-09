/* ------------------------------------------------------------------------- */
/* Widget: Drawer                                                            */
/* Author: Junel Mujar                                                       */
/* ------------------------------------------------------------------------- */

;(function( $, window, document, undefined ){

  // our plugin constructor
  var PluginDrawer = function( elem, options ){

      this.elem     = elem;
      this.$elem    = $(elem);
      this.options  = options;
      this.metadata = this.$elem.data( "plugin-options" );
    };

  // the plugin prototype
  PluginDrawer.prototype = {

    defaults: {
		open     : false,
		animated : false // Requires Velocity
    },

    init: function() {
        // Introduce defaults that can be extended either
        // globally or using an object literal.
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        this.setup();

        return this;
    },

    setup: function() {

        var that = this;
        this.$elem.children('.drawer-title').on('click', function(e) {
            that.config.open = !that.config.open;
            that.$elem.children('.drawer-content').toggle();
            that.$elem.trigger('toggle.facade', [that.config.open]);
        });

        if (this.config.open) {
            that.$elem.children('.drawer-content').show();
        }
    }
  }

  PluginDrawer.defaults = PluginDrawer.prototype.defaults;

  $.fn.drawer = function(options) {
    return this.each(function() {
      new PluginDrawer(this, options).init();
    });
  };

})( jQuery, window , document );