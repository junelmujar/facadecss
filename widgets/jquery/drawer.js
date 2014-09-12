/* ------------------------------------------------------------------------- */
/* Widget: Drawer                                                            */
/* Author: Junel Mujar                                                       */
/* ------------------------------------------------------------------------- */
;(function( $, window, document, undefined ){

    // our plugin constructor
    var PluginDrawer = function( elem, options ) {

          this.elem     = elem;
          this.$elem    = $(elem);
          this.options  = options;
          this.metadata = this.$elem.data( "plugin-options" );
        };

    // the plugin prototype
    PluginDrawer.prototype = {

        defaults: {
            collapsed : false,
            duration  : 250,
            animated  : false // Requires Velocity
        },

        init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            this.setup();
            return this;
        },

    	// Slide animation function
    	slide: function( obj, speed ) {
            var height; 
            height = obj.children('.drawers-title').outerHeight() + obj.children('.drawers-content').outerHeight();        
    		obj.velocity({
                'height' : height
    		}, speed, function() {
    			obj.removeAttr('style');
    		} );
    	},

    	hide: function(obj, speed) {
    		obj.velocity({
                'height' : obj.children('.drawers-title').outerHeight(),
    		}, speed);
    	},

        setup: function() {

            var that = this;

            this.$elem.addClass('open');

            this.$elem.children('.drawers-title').on('click', function(event) {
            	
            	event.preventDefault();

                var item = $(this).parent();

                // Perform animation if true
                if (!that.config.animated) that.config.duration = 0;

                if (item.hasClass('open')) {
                    item.removeClass('open');
                    that.hide(item, that.config.duration);
                } else {
                    item.addClass('open');
                    that.slide(item, that.config.duration);
                }     

    			// Emit an event
                that.$elem.trigger('toggle.drawer', [that.config.collapsed]);
            });

            if (this.config.collapsed) {
                this.$elem.removeClass('open');
                this.$elem.hide();
            }

            // Open drawer
            this.$elem.on('open.drawer', function(event) {
            	event.preventDefault();
            });

            // Hide drawer
            this.$elem.on('close.drawer', function(event) {
            	event.preventDefault();
            });
        }
    }

    PluginDrawer.defaults = PluginDrawer.prototype.defaults;

    $.fn.drawer = function(options) {
        return this.each(function() {
            new PluginDrawer(this, options).init();
        });
    };

})( jQuery, window , document );