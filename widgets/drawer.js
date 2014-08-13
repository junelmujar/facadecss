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
        'resize window'        : '_update_height',
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

            $(this).css({ padding: 3 });
            
            toggler.attr('data-drawer-height', content.outerHeight());
            
            // Show drawers with data-state=open
            // Default is all drawers are hidden
            if ($(this).attr('data-state') == 'open') {
                toggler.attr('data-state', 'open');
                content.css({ opacity:100, display:'block' });
                content.parent().css({'padding': 20});
            }
        });

    },

    _update_height: function() {

        this.$elem.each(function() {
            var toggler = $(this).find('.drawer-toggle');
            var content = $(this).find('.drawer-content');
            if (toggler.attr('data-state') == 'open') { 
                content.css({ height: 'auto' });
                toggler.attr('data-drawer-height', content.outerHeight());
            } else {
                var clone = content.clone();          
                clone.appendTo('body');
                clone.css({ height: 'auto', display: 'block', opacity: 0 });
                toggler.attr('data-drawer-height', clone.outerHeight());
                clone.remove();
            }
        });
    },

    _show: function() {
        var that = this;
        this.target.attr('data-state', 'open');
        this.content.parent().css({'padding': 20});
        this.content.css({ display: 'block', height: 0}).
            velocity({ height: this.target.attr('data-drawer-height') }, 300, function() {
                that.content.css({'pointer-events':'auto',opacity:100});         
            });   
        
    },

    _hide: function() {
        var that = this;
        this.target.attr('data-state', 'close');
        this.content.velocity({ height: 0, opacity: 0 }, 250, function() {
            $(this).parent().css({'padding': 3});
            that.content.css({'pointer-events':'none'});
        });            
    },

    _toggle: function(event) {

        event.preventDefault();

        this.target  = $(event.target);
        this.content = this.target.parent().find('.drawer-content');

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
