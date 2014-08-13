// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
// 
// -------------------------------------
// 
//  Widget: Drodown Widget
//
// -------------------------------------

// Define our widget object
var popoverWidget = function( element ){
    this.init(element);
}

// Define widget functionality
popoverWidget.prototype = {
    
    // Event definitions
    events: {
      'click a[data-action=trigger]'                               : 'toggle',
      'click .popover.popover-panel'          : 'stop_event',
      'keydown(esc) document, click document' : 'hide',
    },

    // Initialize
    init: function(elem){
        // Bind our events, context, namespace
        this.$elem = $(elem).eventralize(this.events, this, 'facade');

        // Add data-action attribute if there's none
        this.$elem.each(function() {
            $(this).children('a').each(function() {
                if (!$(this).attr('data-action')) {
                    $(this).attr('data-action', 'trigger');
                }
            });
        });

    },

    // Stop event from propagating to top;
    // For dropdown-panels, this effectively
    // make them stick unless Esc or a document click is met
    stop_event: function(event) {
        event.stopPropagation();
    }, 

    // Hide all dropdowns
    hide: function(event) {

        if (!event || !$(event.target).attr('data-action')) {
            this.$elem.each(function() {
                $(this).children('a').each(function() {
                    var dropdown = $(this).siblings('.popover');
                    $(this).attr('data-popover-state', false).removeClass('active');
                    dropdown.removeClass('show');
                    dropdown.children().removeClass('active');
                });
            });
        }
    },

    // Toggle dropdown state and visibility
    toggle: function(event) {

        event.preventDefault();
        event.stopPropagation();

        var trigger  = $(event.target);
        var dropdown = trigger.siblings('.popover');
        var state    = trigger.attr('data-popover-state');

        this.pos_y = trigger.outerHeight() + 5;

        this.hide();
        
        if (!state || state == "false") {
            $('body').attr('data-popup-active', trigger.attr('target'));
            dropdown.css({ top: this.pos_y }).addClass('show');
            trigger.attr('data-popover-state', true).addClass('active');
        } else {
            dropdown.removeClass('show');
            trigger.attr('data-popover-state', false).removeClass('active');
        }
    }    
}

// Bind to elements with [data-widget=notice] attributes
var popover = new popoverWidget('[data-widget=popover]');

