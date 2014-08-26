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
		this.$elem          = $(elem).eventralize(this.events, this, 'facade');
		this.mode           = this.$elem.attr('data-mode');
		this.widgetHeight   = this.$elem.attr('data-height');
		this.itemsList      = this.$elem.find('ul[role=list]');
		this.selectedValues = this.$elem.find('input[role=data-value]');

		// Default to single selection mode;
		if (!this.mode) this.mode = 'single';

		// Set height if data-height is not empty;
		if (this.widgetHeight) this.itemsList.css({height: this.widgetHeight});

		// If has preselected value(s), check them;
		if (this.selectedValues.val()) {
			// We expect a comma separated value;
			var values = this.selectedValues.val().split(',');
			if (values.length > 0) {
				this.checkSelectedValues(values);
				this.getSelectedValues();
			} else {
				console.log('a')
			}
		}
    },

    clear: function() {
    	this.itemsList.find('li').each( function() {
    		$(this).children('a').removeClass('checked');
    	});
    },

    checkSelectedValues: function(values) {

    	if (this.mode == 'single') values = values[0];

    	this.itemsList.find('li').each( function() {
			var link, value;
			link  = $(this).find('a');
			value = link.attr('data-value');
			if ($.inArray(value, values) > -1) link.addClass('checked');
    	});    		
    },

    getSelectedValues: function() {
    	var temp = [];
    	this.itemsList.find('li').each( function() {
    		var link, value;
    		link = $(this).find('a');
    		if (link.hasClass('checked')) {
    			value = link.attr('data-value');
    			if (value) {
    				temp.push(value);
    			}
    		};
    	});    		
    	this.selectedValues.val(temp);
    },

    uncheck: function(event) {
        event.preventDefault();
        var target = $(event.target);
        if (target.hasClass('checked')) $(event.target).removeClass('checked');
        this.getSelectedValues();
    },    

    check: function(event) {
        event.preventDefault();
        var target = $(event.target);
        if (this.mode == 'single') this.clear();
        if (!target.hasClass('checked')) {
        	$(event.target).addClass('checked');
        	this.getSelectedValues();
        }
    }    
}

// Bind to elements with [data-widget=notice] attributes
var facadeSelectList = new selectlistWidget('[data-widget=selectlist]');