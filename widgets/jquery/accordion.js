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

      this.itemHeights = [];
      this.itemStates  = [];

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
        animated      : false // Requires Velocity
    },

    init: function() {
        // Introduce defaults that can be extended either
        // globally or using an object literal.
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        this.setup();

        return this;
    },

    // Slide animation function
    slide: function( obj, speed ) {
        var index = $(obj).parent().index();
        var that  = this;
        obj.velocity({
            'opacity'        : 100,
            'padding-top'    : 10,
            'padding-bottom' : 10,
            'height'         : this.itemHeights[index]
        }, speed, function() {
            obj.
                css('border-bottom', '1px solid lightgray').
                css('height', 'auto !important');
                console.log('done');
            that.itemHeights[index] = obj.height();
        } );
    },

    // Hide animation function
    hide: function(obj, speed) {
        obj.velocity({
            'opacity'        : 0,
            'height'         : 0,
            'padding-top'    : 0,
            'padding-bottom' : 0
        }, speed, function() {
            obj.css('border-bottom', 0);
        } );
    },

    setup: function() {

        var that, items;

        that  = this;
        items = this.$elem.children('.accordion-item');
        
        this.$elem.children('.accordion-item').each(function() {
            that.itemHeights.push($(this).children('.accordion-content').height());
        });
        
        // Toggle event
        this.$elem
            .children('.accordion-item')
            .children('.accordion-title').on('click', function(event) {

                event.preventDefault();
   
                var content, index, title;

                title   = $(this); 
                content = title.siblings('.accordion-content');
                index   = content.parent().index();

                title.addClass('active');

                if (that.config.groupToggle) {

                    if (index != that._active) {

                        // Hide previous active item and remove classes 
                        $(this).closest('.accordion').children().each(function() {
                            var sibling_content = $(this).children('.accordion-content');
                            var sibling_title   = $(this).children('.accordion-title');
                            if (sibling_content.hasClass('open')) {
                                sibling_content.removeClass('open');
                                sibling_title.removeClass('active');
                                that.hide(sibling_content, that.config.duration);
                            }
                        });
                        
                        // Show item and add .open class
                        that.slide(content, that.config.duration);
                        content.addClass('open');
                    }   

                    // track active item
                    that._active = content.parent().index();
                    
                } else {
            
                    if (content.hasClass('open')) {
                        that.hide(content, that.config.duration);
                        content.removeClass('open');
                        title.removeClass('active');
                    } else {
                        that.slide(content, that.config.duration);
                        content.addClass('open');
                        title.addClass('active');
                    }     

                }
        });

        // Toggle an item or open all accordion items on load 
        if (this.config.collapsed) {
            items.children('.accordion-content').css({ height: 0, padding:'0 10px', border: 0 });
        }

        // Show an item on render
        if (this.config.defaultActive != 'none' || this.config.defaultActive >= 0) {

            $(items[this.config.defaultActive]).
                children('.accordion-content').
                removeAttr('style').
                addClass('open');

            $(items[this.config.defaultActive]).
                children('.accordion-title').                
                addClass('active');

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

        var _unique_id;
        // $(window).resize(function() {
        //     clearTimeout(_unique_id);
        //     _unique_id = setTimeout(doneResizing, 100);
        // });

        function doneResizing() {

            that.itemHeights = [];
            that.$elem.children('.accordion-item').each(function() {
                var content;
                content = $(this).children('.accordion-content').clone(true);
                content.css({
                    position   : "fixed",
                    left       : "0px",
                    height     : "auto important",
                    visibility : "hidden"
                }).appendTo("body");
                that.itemHeights.push(content.outerHeight());
                content.remove();
            });
        }
    }

  }

  PluginAccordion.defaults = PluginAccordion.prototype.defaults;

  $.fn.accordion = function(options) {
    return this.each(function() {
      new PluginAccordion(this, options).init();
    });
  };

})( jQuery, window , document );