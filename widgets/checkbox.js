// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
// 
// -------------------------------------

// -------------------------------------
//  
//  Widget: Switch Widget
//  
//  Purpose: Replace checkboxes with
//      better looking switches/toggles
//  
// -------------------------------------

// Define our widget object
var checkboxWidget = function( element ){
    this.init(element);
}

// Define widget functionality
checkboxWidget.prototype = {
    

    // Event definitions
    events: {
      'click .checkbox-toggle' : 'switch_on',
      'click .checkbox-toggle[data-switch-state=open]' : 'switch_off'
    },

    // Initialize
    init: function(elem){

        // Switch button template;
        this.switch_html = '<a href="#" class="checkbox-toggle"></a>';

        // Bind our events, context, namespace;
        this.$elem = $(elem).eventralize(this.events, this, 'facade');
        this.$elem.find('input[type=checkbox]').addClass('hidden');

        // Clone this into that for inner loop use;
        var that = this;

        // Cycle through matched element;
	    this.$elem.each(function() {

		    $(this).html(that.switch_html + $(this).html());

	    	var checkbox = $(this).find('input[type=checkbox]');
	    	if (checkbox.prop('checked') == true) {
			 	$(this).find('.checkbox-toggle').addClass('checked');
	    	}
	    });
	    
    },

    switch_on: function(event) {

        event.preventDefault();

        // Internal vars; check switch button state and switch on checkbox state accordingly
        var target 		= $(event.target);
        var checkbox 	= target.parent().parent().find('input[type=checkbox]');
        var state       = target.attr('data-switch-state');

		if (!state || state == 'closed') {
			checkbox.prop('checked', true);
		 	target.attr('data-switch-state', 'open').addClass('checked');
		}

    },    

    switch_off: function(event) {
        
        event.preventDefault();

        // Internal vars; check switch button state and switch off checkbox state accordingly
        var target 		= $(event.target);
        var checkbox 	= target.parent().parent().find('input[type=checkbox]');
        var state       = target.attr('data-switch-state');

		if (state == 'open') {
			checkbox.prop('checked', false);
		 	target.attr('data-switch-state', 'closed').removeClass('checked');
		}        

		this.$elem.uneventralize(this.events);
    }    
}

// Bind to elements with [data-widget=notice] attributes
var checkbox = new checkboxWidget('[data-widget=checkbox]');