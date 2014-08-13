// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
// 
// -------------------------------------

// -------------------------------------
//  
//  Widget: Accordion Widget
//  
//  Purpose: Convert a predefined set of 
//  elements to act as an accordion widget
//  
//  Basic Feature: Toggle accordion 
//  as group; toggle an accordion item;
//  
//  Todo: Toggle individual accordion 
//  items via data-attributes & other
//  features
//  
// -------------------------------------

// Define our widget object
var accordionWidget = function( element ){
    this.init(element);
}

// Define widget functionality
accordionWidget.prototype = {
    
    // Event definitions
    events: {
      'click .accordion-item > a' : 'show', 
      'click .accordion-item > a[data-accordion-mode=open]' : 'hide' 
    },

    // Initialize
    init: function(elem){
        // Bind our events, context, namespace
        this.$elem = $(elem).eventralize(this.events, this, 'facade');
    },

    clear: function(event) {
    	this.$elem.find('.accordion-item > a').each(function() {
    		if ($(this).attr('data-accordion-mode') == 'open') {
    			$(this).removeAttr('data-accordion-mode');
    			$(this).siblings('.accordion-body').velocity("slideUp", { delay: 50, duration: 150 });	
    		}
    	});
    },

    show: function(event) {
        
        event.preventDefault();
		
		var mode   = $(event.target).attr('data-accordion-mode');
		var target = $(event.target);

        this.clear();
		if (!mode) {
	        target.attr('data-accordion-mode','open');
	        target.siblings('.accordion-body').velocity("slideDown", { delay: 50, duration: 150 });	
        }       
    },    

    hide: function(event) {
        
        event.preventDefault();
        
        var mode = $(event.target).attr('data-accordion-mode');
        var target = $(event.target);
		
		if (mode == 'open') {
        	target.siblings('.accordion-body').velocity("slideDown", { delay: 50, duration: 150 });	
        	target.removeAttr('data-accordion-mode');
    	}
        
    }    

}

// Bind to elements with [data-widget=notice] attributes
var accordion = new accordionWidget('[data-widget=accordion]');