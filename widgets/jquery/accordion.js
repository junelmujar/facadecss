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
        this.elem        = elem;
        this.$elem       = $(elem);
        this.options     = options;
        this.metadata    = this.$elem.data( "plugin-options" );
    };

    // the plugin prototype
    PluginAccordion.prototype = {
        defaults: {
            defaultActive : 'none',
            groupToggle   : true,
            collapsed     : true,
            duration      : 150,
            open          : false,
            animated      : true // Requires Velocity
        },

        init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            this.setup();
            return this;
        },

        // Slide animation function
        slide: function( obj, speed ) {
            var height; 
            height = obj.children('.accordion-title').outerHeight() + obj.children('.accordion-content').outerHeight();
            obj.velocity({
                'height' : height
            }, speed, function() {
                obj.removeAttr('style');
            });
        },

        // Hide animation function
        hide: function(obj, speed) {
            obj.velocity({
                'height' : obj.children('.accordion-title').outerHeight(),
            }, speed);
        },

        // Setup our plugin
        setup: function() {

            var that, items;

            that  = this;
            items = this.$elem.children('.accordion-item');
            
            // Toggle event
            this.$elem
                .children('.accordion-item')
                .children('.accordion-title').on('click', function(event) {

                event.preventDefault();
                
                var content, index, title;
                item = $(this).parent();

                // Perform animation if true
                if (!that.config.animated) that.config.duration = 0;

                // Toggle accordion
                if (that.config.groupToggle) {
                    if (index != that._active) {
                        that.$elem.children().each(function() {
                            if ($(this).hasClass('open')) {
                                $(this).removeClass('open');
                                that.hide($(this), that.config.duration);
                            }
                        });  
                        that.slide(item, that.config.duration);
                        item.addClass('open');                                      
                    }
                    // track active item
                    that._active = item.parent().index();
                } else {
                    if (item.hasClass('open')) {
                        item.removeClass('open');
                        that.hide(item, that.config.duration);
                    } else {
                        item.addClass('open');
                        that.slide(item, that.config.duration);    
                    }
                }    

            });

            // Toggle an item or open all accordion items on load 
            if (this.config.collapsed) {
                items.css({ height: items.children('.accordion-title').outerHeight() });
            }

            // Show an item on render
            if (this.config.defaultActive != 'none' || this.config.defaultActive >= 0) {

                $(items[this.config.defaultActive]).
                    removeAttr('style');

                $(items[this.config.defaultActive]).
                    addClass('open');

                this._active = this.config.defaultActive;
            }

            // Open accordion item
            this.$elem.on('open.accordion', function(event, index) {
                event.preventDefault();
                $(items[index]).children('.accordion-content').show().addClass('open');
            });

            // Hide accordion item
            this.$elem.on('close.accordion', function(event, index) {
                event.preventDefault();
                $(items[index]).children('.accordion-content').hide().removeClass('close');
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