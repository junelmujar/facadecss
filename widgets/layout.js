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
var layoutWidget = function( element ){
    this.init(element);
}

// Define widget functionality
layoutWidget.prototype = {

    // Event definitions
    events: {
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
var layout = new layoutWidget('[data-widget=layout]');