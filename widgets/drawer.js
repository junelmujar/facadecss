// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
//  
//  Widget: Drawer Widget
//  
// -------------------------------------

// Define our widget object
var drawerWidget = function( element ){
    this.init(element);
}

// Define widget functionality
drawerWidget.prototype = {

    // Event definitions
    events: {
        //'resize window'        : '_update_height',
        'click a.drawer-toggle': '_toggle'
    },

    // Initialize
    init: function(elem){

        // Bind our events, context, namespace;
        this.$elem = $(elem).eventralize(this.events, this, 'facade');

        var that = this;
        this.$elem.each(function() {
            var toggler = $(this).find('.drawer-toggle');
            var content = $(this).find('.drawer-content');
            var title   = $(this).find('.drawer-title');
            if ($(this).attr('data-state') == 'open') {
                toggler.attr('data-state', 'open');
                content.show();
            } else {
                if (title) title.removeClass('open').addClass('close');
            }
        });

    },

    _show: function() {
        if (this.title) this.title.removeClass('close').addClass('open');
        this.target.attr('data-state', 'open');
        this.content.show();
    },

    _hide: function() {
        if (this.title) this.title.removeClass('open').addClass('close');
        this.target.attr('data-state', 'close');
        this.content.hide();
    },

    _toggle: function(event) {

        event.preventDefault();

        this.target  = $(event.target);
        this.content = this.target.parent().find('.drawer-content');
        this.title   = this.target.parent().find('.drawer-title');

        var current_state = this.target.attr('data-state'); 

        if (!current_state || current_state == 'close') {
            this._show();
        } else {
            this._hide();
            
        }
    },
}

// Bind to elements with [data-widget=notice] attributes
var drawer = new drawerWidget('[data-widget=drawer]');