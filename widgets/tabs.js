// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
//  
//  Widget: Widget Template
//  
// -------------------------------------

// Define our widget object
var tabWidget = function( element ){
    this.init(element);
}

// Define widget functionality
tabWidget.prototype = {

    // Event definitions
    events: {
      'click a' : 'toggle',
    },

    // Initialize
    init: function(elem){
        // Bind our events, context, namespace;
        this.$elem = $(elem).eventralize(this.events, this, 'facade');
        this.$elem.find('li').each(function() {
            if ($(this).hasClass('active')) {
                var target = $(this).find('a').attr('data-target');
                if (target) $(target).show();
            }
        });
    },

    toggle: function(event) {
        event.preventDefault();
        if (event) {
            var tab = $(event.target);
            tab.parent().siblings().removeClass('active');
            tab.parent().addClass('active');
            tab.parent().parent().siblings().hide();
            tab.parent().parent().siblings().each(function() {
                if ($(this).is(tab.attr('data-target'))) $(tab.attr('data-target')).fadeIn();
            });
        }
    }
}

// Bind to elements with [data-widget=notice] attributes
var tabs = new tabWidget('[data-widget=tabs]');