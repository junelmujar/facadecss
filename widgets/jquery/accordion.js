/* Accordion Widget                                                         */
/* Author: Junel Mujar                                                      */
/* --------------------------------------------------------------------------
    defaultItem     - Open an accordion item based on index (starts at 0)
    groupToggle     - Hide all accordion item except the clicked item  
    collapsedState  - Collapse all accordion items on render
    animated        - If true, animate hide/show operations using Velocity
----------------------------------------------------------------------------*/

;(function( $, window, document, undefined ){

  // our plugin constructor
  var PluginAccordion = function( elem, options ){

      this.elem     = elem;
      this.$elem    = $(elem);
      this.options  = options;
      this.metadata = this.$elem.data( "plugin-options" );
    };

  // the plugin prototype
  PluginAccordion.prototype = {

    defaults: {
        defaultItem    : 'none',
        groupToggle    : true,
        collapsedState : true
        animated       : false // Requires Velocity
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
        
        // Toggle event
        this.$elem
            .children('.accordion-item')
            .children('.accordion-title').on('click', function(event) {
                event.preventDefault();
                if (that.config.groupToggle) {
                    $(this).closest('.accordion').children().each(function() {
                        $(this).children('.accordion-content').hide();
                    });
                } 
            
            $(this).siblings().toggle();
            that.$elem.trigger('toggle.facade', [$(this).parent().index()]);
        });

        // Toggle an item or open all accordion items on load 
        var items = this.$elem.children('.accordion-item');
        if (this.config.collapsedState) {
            if (this.config.defaultItem != 'none' || !this.config.defaultItem) {
                $(items[this.config.defaultItem]).children('.accordion-content').show();
            }
        } else {
            items.children('.accordion-content').show();
        }

        // Open accordion item
        this.$elem.on('open.facade', function(event, index) {
            $(items[index]).children('.accordion-content').show();
        });

        // Hide accordion item
        this.$elem.on('close.facade', function(event, index) {
            $(items[index]).children('.accordion-content').hide();
        });
    }

  }

  PluginAccordion.defaults = PluginAccordion.prototype.defaults;

  $.fn.accordion = function(options) {
    return this.each(function() {
      new PluginAccordion(this, options).init();
    });
  };

})( jQuery, window , document );