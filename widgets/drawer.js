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
        //'click a.drawer-toggle' : 'toggle'
        'click a.drawer-toggle' : '_toggle'
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

    _show: function() {
        this.target.attr('data-state', 'open');
        this.content.parent().css({'padding': 20});
        this.content.css({ display: 'block', height: 0}).
            animate({ opacity:100, height: this.target.attr('data-drawer-height') }, 100);   
        this.content.css({'pointer-events':'auto'}); 
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

    show: function(drawer) {
        alert(drawer);
    }

}

// Bind to elements with [data-widget=notice] attributes
var drawer = new drawerWidget('[data-widget=drawer]');

// drawer.show('test');