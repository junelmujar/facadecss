// -------------------------------------
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
// -------------------------------------
//  Widget: Widget Template
// -------------------------------------

// Define our widget object
var selectlistWidget = function( element ){
    this.init(element);
}

// Define widget functionality
selectlistWidget.prototype = {

    // Event definitions
    events: {
      'click a' : 'check',
      'click a.checked' : 'uncheck',
    },

    // Initialize
    init: function(elem){
        // Bind our events, context, namespace;
        this.$elem = $(elem).eventralize(this.events, this, 'facade');
    },

    uncheck: function(event) {
        event.preventDefault();
        var target = $(event.target);
        if (target.hasClass('checked')) $(event.target).removeClass('checked');
    },    

    check: function(event) {
        event.preventDefault();
        var target = $(event.target);
        if (!target.hasClass('checked')) $(event.target).addClass('checked');
    }    
}

// Bind to elements with [data-widget=notice] attributes
var facadeSelectList = new selectlistWidget('[data-widget=selectlist]');