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
var baseWidget = function( element ){
    this.init(element);
}

// Define widget functionality
baseWidget.prototype = {

    // Event definitions
    events: {
      'click a, click a[data-state=closed]' : 'show',
      'click a[data-state=open]' : 'hide',
    },

    // Initialize
    init: function(elem){
        // Bind our events, context, namespace;
        this.$elem = $(elem).eventralize(this.events, this, 'facade');
    },

    hide: function(event) {
        event.preventDefault();
    },    

    show: function(event) {
        event.preventDefault();
    }    
}

// Bind to elements with [data-widget=notice] attributes
var widget = new baseWidget('[widget]');