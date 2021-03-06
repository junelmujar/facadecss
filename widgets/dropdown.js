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
var dropdownWidget = function( element ){
    this.init(element);
}

// Define widget functionality
dropdownWidget.prototype = {
    
    // Event definitions
    events: {
      'click a'                               : 'toggle',
      //'click .dropdown.dropdown-panel'        : 'stop_event',
      'keydown(esc) document, click document' : 'hide',
    },

    // Initialize
    init: function(elem){
        // Bind our events, context, namespace
        this.$elem = $(elem);

        // Add data-action attribute if there's none
        var that = this;
        this.$elem.each(function() {
            $(this).eventralize(that.events, that, 'facade');
            $(this).children('a').each(function() {
                if (!$(this).attr('data-action')) {
                    $(this).attr('data-action', 'trigger');
                }
            });
        });

        this.widget_clicked   = $.Event( "facade.widget-clicked" );
        this.dropdown_clicked = $.Event( "dropdown-clicked" );
        this.dropdown_opened  = $.Event( "dropdown-opened" );
        this.dropdown_closed  = $.Event( "dropdown-closed" );

        this.$document = $(document);
    

    },

    // Stop event from propagating to top;
    // For dropdown-panels, this effectively
    // make them stick unless Esc or a document click is met
    // stop_event: function(event) {
    //     event.stopPropagation();
    // }, 

    // Hide all dropdowns
    hide: function(event) {

        var target, parent_found;
        
        if (event) target = $(event.target);
        if (target) parent_found = target.closest('.dropdown-panel').length;

        if (!target || !parent_found) {

            $('body').removeAttr('has-dropdown-active');

            // Find active popup and remove state and active class
            this.$elem.find('a.active').
                attr('data-popup-state', false).
                removeClass('active');

            // Find active dropdown and remove show class
            this.$elem.find('.dropdown[last-active=true]').
                attr('last-active', false).
                removeClass('show');   
        } 

    },

    hide_popovers: function() {
        if ($('.popover-container').attr('data-popover-state') == 'true') {
            $('.popover-container').attr('data-popover-state', false).removeClass('show');
            $('[data-widget=popover]').find('a[last-active=true]').removeClass('active');
            $('body').attr('data-popover-active', '');
        }
    },

    // Toggle dropdown state and visibility
    toggle: function(event) {

        event.preventDefault();
        event.stopPropagation();

        this.hide_popovers();

        var trigger  = $(event.target);
        var parent   = trigger.parent();
        var dropdown = trigger.siblings('.dropdown');
        var state    = trigger.attr('data-popup-state');

        this.pos_y = trigger.outerHeight() + 5;

        this.hide();

        if (!state || state == "false") {
            
            $('body').attr('data-popup-active', trigger.attr('target')).attr('has-dropdown-active', true);
            
            dropdown.
                css({ top: this.pos_y }).
                addClass('show').
                attr('last-active', true);
            trigger.attr('data-popup-state', true)
                .addClass('active');
            
            $( document ).trigger( this.dropdown_opened, parent );

        } else {
            
            dropdown.
                removeClass('show').
                attr('last-active', false);
            
            trigger.
                attr('data-popup-state', false).
                removeClass('active');

            $( document ).trigger( this.dropdown_closed, parent );
        }

        $( document ).trigger( this.widget_clicked );
    } 
}

// Bind to elements with [data-widget=notice] attributes
var facadeNotice = new dropdownWidget('[data-widget=dropdown]');