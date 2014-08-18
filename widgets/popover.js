// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
// 
// -------------------------------------
// 
//  Widget: Popover Widget
//
// -------------------------------------

jQuery.fn.extend({
    getPath: function () {
        var path, node = this;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) { 
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});

// Define our widget object
var popoverWidget = function( element ){
    this.init(element);
}

// Define widget functionality
popoverWidget.prototype = {
    
    // Event definitions
    events: {
      'click a[data-action=trigger]'            : 'toggle',
      'resize window, scroll window'            : 'reposition',
      'keydown(esc) document, click document'   : 'hide',
    },

    overlay_events: {
        'click': 'hide'
    },

    container_events: {
        'click .popover-close': 'hide'
    },

    // Initialize
    init: function(elem){
        
        this.popover       = '<div class="popover-overlay"></div><div class="popover-container"></div>';
        this.popover_close = '<a href="#" class="popover-close" title="Close"><i class="fa fa-times"></i></a>';

        // Bind our events, context, namespace
        this.$elem         = $(elem).eventralize(this.events, this, 'facade');
        
        // Prepend to <body>
        $( 'body' ).prepend(this.popover);
        
        // Plugin attributes
        this.trigger             = '';
        this.overlay             = '';
        this.window_height       = 0;
        this.window_width        = 0;
        this.popover_right_edge  = 0;
        this.popover_bottom_edge = 0;        
        this.popover_mode        = 'panel'; // default mode
        this.container           = $('.popover-container');
        this.popover_overlay     = $('.popover-overlay');

        // Bind events to popover overlay
        this.popover_overlay.eventralize(this.overlay_events, this, 'facade');
    },

    // Hide all popups
    hide: function(event) {
        
        var target = event.target || event.srcElement || event.originalTarget;

        event.preventDefault();
        event.stopPropagation();
        
        if (!this.overlay_persistent || this.overlay_persistent == "false" || $(target).hasClass('popover-close')) {
            if ($(target).attr('data-action') != "trigger") {

                var that = this;
                $('body').removeAttr('data-popover-active');

                if (this.overlay == 'show') {
                    this.popover_overlay.removeClass('show');
                }            

                $('[data-widget=popover]').each(function() {
                    $(this).find('a').attr('data-popover-state', false).removeClass('active');
                    that.container.removeClass('show').empty();
                });
            }
        }
    },

    clear_tips: function() {
        this.container
            .removeClass('tooltip-top-right')
            .removeClass('tooltip-bottom-right')
            .removeClass('tooltip-bottom-left');       
    },

    reposition: function(event) {

        var state = this.container.attr('data-popover-state');
        
        this.clear_tips();

        if (state) {
            if (state == 'true') {

                this.window_height       = $( window ).height();
                this.window_width        = $( window ).width();        

                this.popover_right_edge  = this.container.outerWidth() + this.trigger.offset().left;
                this.popover_bottom_edge = this.container.outerHeight() + this.trigger.offset().top;
                
                this.pos_y               = this.trigger.offset().top + this.trigger.outerHeight() + 10;
                this.pos_x               = this.trigger.offset().left;

                // Check if popover is out of bounds horizontally
                if (this.popover_right_edge > this.window_width) {
                    this.pos_x = (this.pos_x - this.container.outerWidth()) + this.trigger.outerWidth();
                    this.container.addClass('tooltip-top-right');

                    // Check if popover is out of bounds vertically
                    if (this.popover_bottom_edge > this.window_height) {
                        this.pos_y = this.trigger.offset().top - (this.container.outerHeight() + 10);
                        this.container.addClass('tooltip-bottom-right');
                    } else {
                        this.container.addClass('tooltip-top-right');
                    }
                } 

                this.container.css({ left: this.pos_x, top: this.pos_y });    
            }
        }
    },

    hide_dropdowns: function() {

        // Check if a dropdown is active; close it before showing popover;
        if ($('body').attr('has-dropdown-active') == "true") {
            var dropdowns = $('[data-widget~=dropdown]');
            dropdowns.each(function() {
                $(this).children('a').each(function() {
                    var dropdown = $(this).siblings('.dropdown');
                    $(this).attr('data-popup-state', false).removeClass('active');
                    dropdown.removeClass('show');
                });
            });
            $('body').attr('has-dropdown-active', false);
        }
    },

    // Toggle dropdown state and visibility
    toggle: function(event) {
        
        event.preventDefault();
        event.stopPropagation();

        this.hide_dropdowns();
        this.clear_tips();

        // Local variables
        var trigger              = $(event.target);
        var target               = trigger.attr('data-target');
        var state                = this.container.attr('data-popover-state');
        var content              = this.popover_close + $(target).html();
        var mode                 = trigger.attr('data-mode') == "menu" ? "menu" : "panel";

        if (mode == "menu") {
            this.container.addClass('menu');
        } else {
            this.container.removeClass('menu');
        }

        // Get window dimensions;        
        this.window_height       = $( window ).height();
        this.window_width        = $( window ).width();
        
        // Get popover edge
        this.popover_right_edge  = this.container.outerWidth() + trigger.offset().left;
        this.popover_bottom_edge = this.container.outerHeight() + trigger.offset().top;
        
        // Get/set overlay mode [show/hide]
        this.overlay             = trigger.attr('data-overlay');
        this.overlay_persistent  = trigger.attr('data-overlay-persistent');
        
        // Get initial x & y position;
        this.pos_y               = trigger.offset().top + trigger.outerHeight() + 10;
        this.pos_x               = trigger.offset().left;

        // Assign class attribute value for trigger;
        this.trigger             = trigger;

        // Get active popover & create unique hash of trigger
        var active = $('body').attr('data-popover-active');

        // Create a unique hash for the current clicked trigger
        // to be used to hiding active popovers
        var hash   = $.md5(this.trigger.getPath());

        // Show popover overlay if mode == show;
        if (this.overlay == 'show') {
            $('.popover-overlay').addClass('show');
        }

        // Remove active class & data attribute on
        // last clicked popover trigger;
        this.$elem.find('a[last-active=true]').
            removeClass('active').
            removeAttr('last-active');

        // Add active class to latest clicked trigger &
        // set data attribute last-active to true;
        this.trigger.addClass('active').attr('last-active', true);

        // Bind container events;
        this.container.eventralize(this.container_events, this, 'facade');                

        // Check if popover is the active one
        if (active == hash) {
            if (!state || state == "false") {
                this.container.html(content).addClass('show');
                this.container.attr('data-popover-state', true);
            } else {
                $('body').removeAttr('data-popover-active');
                this.trigger.removeClass('active');
                this.container.attr('data-popover-state', false).removeClass('show').empty();
            }
        } else {
            this.container.html(content).addClass('show');
            this.container.attr('data-popover-state', true);
        }
       
        // Close button if in menu mode; 
        if (mode == "menu") {
            $('.popover-close').addClass('hidden');
        } else {
            $('.popover-close').removeClass('hidden');
        }

        // Check if popover is out of bounds horizontally
        if (this.popover_right_edge > this.window_width) {

            this.pos_x = (this.pos_x - this.container.outerWidth()) + trigger.outerWidth();
            this.container.addClass('tooltip-top-right');

            // Check if popover is out of bounds vertically
            if (this.popover_bottom_edge > this.window_height) {
                this.clear_tips();
                this.container.addClass('tooltip-bottom-right');
                this.pos_y = trigger.offset().top - (this.container.outerHeight() + 10);
            } else {
                this.clear_tips();
                this.container.addClass('tooltip-top-right');
            }
        }
        
        $('.popover-close i.fa').css('pointer-events', 'none');

        
        // Set popover position
        this.container.css({ left: this.pos_x, top: this.pos_y });

        // Set active popover
        $('body').attr('data-popover-active', hash);
    }    
}

$(document).ready(function() {
    // Bind to elements with [data-widget=notice] attributes
    var popover = new popoverWidget('[data-widget=popover]');
});