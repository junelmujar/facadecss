// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
// 
//  Widget: Tooltip Widget
//  
// -------------------------------------

// Define our widget object
var tooltipWidget = function( element ){
    this.init(element);
}

// Define widget functionality
tooltipWidget.prototype = {
    
    // Event definitions
    events: {
        'mouseenter': 'show',
        'mouseleave': 'hide',
    },

    // Initialize
    init: function(elem){

        // Temporary placeholder for title text
        this.tip     = '';

        // Bind our events, context, namespace
        this.$elem   = $(elem).eventralize(this.events, this, 'facade');

        // Html fragment
        this.tooltip = $( '<div id="tooltip"></div>' );
        
        // Append tooltip fragment and hide it;
        this.tooltip.html('Tooltip Title').appendTo( 'body' );        
       
    },

    // Main functionality
    show: function(event) {

        event.preventDefault();
        
        var target= $(event.target);
        this.tip  = target.attr( 'title' );

        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( this.tooltip.outerWidth() / 2 ),
            pos_top  = target.offset().top - this.tooltip.outerHeight() - 10;

        this.tooltip.addClass('bottom');
        this.tooltip.css({ 
            top : pos_top, 
            left: pos_left
        });

        target.removeAttr( 'title' );
        this.tooltip.html(this.tip).addClass('show');

    },   

    hide: function(event) {

        event.preventDefault();
        var target= $(event.target);
   
        target.attr( 'title', this.tip );
        this.tooltip.removeClass('show');

    }         
}

// Bind to elements with [data-widget=notice] attributes
var tooltips = new tooltipWidget('[rel~=tooltip]');