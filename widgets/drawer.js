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
        'click a.drawer-toggle, click .drawer-title': '_toggle',
        'keydown(esc) document': '_hide'
    },

    registry: [],

    // Initialize
    init: function(elem){

        // Bind our events, context, namespace;
        this.$elem = $(elem).eventralize(this.events, this, 'facade');

        var that = this;
        this.$elem.each(function() {
            
            var toggler     = $(this).find('.drawer-toggle');
            var content     = $(this).find('.drawer-content');
            var title       = $(this).find('.drawer-title');
            var drawer_name = $(this).attr('data-widget-name');

            // If drawer's initial state is open; show it!
            if ($(this).attr('data-state') == 'open') {
                toggler.attr('data-state', 'open');
                content.show();
                if (title) title.removeClass('close')
                            .addClass('open')
                            .css('cursor', 'pointer')
                            .attr('title', 'Click to Toggle');

            } else {
                if (title) title.removeClass('open')
                            .addClass('close')
                            .css('cursor', 'pointer')
                            .attr('title', 'Click to Toggle');
            }

            // Save it to our registry
            if (drawer_name) {
                that.registry.push (drawer_name);
            }

        });
    },

    _show: function() {
        if (this.target) {
            if (this.title) this.title.removeClass('close').addClass('open');
            this.target.parent().attr('data-state', 'open');
            this.content.show();
        }
    },

    _hide: function() {
        if (this.target) {
            if (this.title) this.title.removeClass('open').addClass('close');
            this.target.parent().attr('data-state', 'close');
            this.content.hide();
        }
    },

    _toggle: function(event) {

        event.preventDefault();

        this.target  = $(event.target);
        this.content = this.target.parent().find('.drawer-content');
        this.title   = this.target.parent().find('.drawer-title');

        var current_state = this.target.parent().attr('data-state'); 

        if (!current_state || current_state == 'close') {
            this._show();
        } else {
            this._hide();
            
        }
    },

    _find_drawer: function(name) {
        var drawer_exists = false;
        if (name) {
            if ($.inArray(name, this.registry) != -1) {
                drawer_exists = true;
            }
        }
        return drawer_exists;
    },

    _show_drawer: function(name) {

        var drawer      = $('[data-widget-name=' + name + ']');
        var toggler     = drawer.find('.drawer-toggle');
        var content     = drawer.find('.drawer-content');
        var title       = drawer.find('.drawer-title');

        drawer.attr('data-state', 'open')
        toggler.attr('data-state', 'open');
        if (title) title.removeClass('close').addClass('open');
        content.show();
    },

    show: function(name) {
        if (this._find_drawer(name)) {
            this._show_drawer(name);
        } else {
            alert('Facade CSS: Drawer does not exist!')
        }
    }
}

// Bind to elements with [data-widget=notice] attributes
var drawer = new drawerWidget('[data-widget=drawer]');