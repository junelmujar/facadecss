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
		duration : 250,
		animated : false // Requires Velocity
    },

    init: function() {
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        this.setup();
        return this;
    },

	// Slide animation function
	slide: function( obj, speed ) {
		obj.velocity({
			'opacity': 100,
			'padding-top': 10,
			'padding-bottom': 10,
			'height': this.origHeight
		}, speed, function() {
			obj.
				css('border-bottom', '1px solid lightgray').
				css('height', 'auto !important');
			this.origHeight = obj.height();
		} );
	},

	hide: function(obj, speed) {
		obj.velocity({
			'opacity': 0,
			'height': 0,
			'padding-top': 0,
			'padding-bottom': 0
		}, speed, function() {
			obj.css('border-bottom', 0);
		} );
	},

    setup: function() {

        var that = this;

        if (!this.origHeight) this.origHeight = this.$elem.children('.drawers-content').height();

        this.$elem.children('.drawers-title').on('click', function(event) {
        	
        	event.preventDefault();

            var content = that.$elem.children('.drawers-content');

            // Perform animation if true
            if (that.config.animated) {
	            if (that.config.open) {
	            	that.hide(content, that.config.duration);
	            } else {
	            	that.slide(content, that.config.duration);
	            }            
	        } else {
	        	content.toggle();
	        }

	        // Update origHeight & state
			that.origHeight = $(this).siblings().height();
			that.config.open= !that.config.open;

			// Emit an event
            that.$elem.trigger('toggle.drawer', [that.config.open]);
			
        });

        if (this.config.open) {
            that.$elem.children('.drawers-content').show();
        }

        // Open drawer
        this.$elem.on('open.drawer', function(event) {
        	event.preventDefault();
        	if (that.config.animated) {
        		that.show(that.$elem.children('.drawers-content'), that.config.duration);
        	} else {
            	that.$elem.children('.drawers-content').show();
            }
        	that.config.open = true;
        });

        // Hide drawer
        this.$elem.on('close.drawer', function(event) {
        	event.preventDefault();
        	if (that.config.animated) {
        		that.hide(that.$elem.children('.drawers-content'), that.config.duration);
        	} else {
            	that.$elem.children('.drawers-content').hide();
            }
        	that.config.open = false;
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