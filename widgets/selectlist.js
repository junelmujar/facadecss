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

        var that = this;

        // Bind our events, context, namespace;
        //this.$elem = $(elem).eventralize(this.events, this, 'facadeSelectList');
        
        this.$elem = $(elem);

        this.$elem.each(function() {
            
            var name           = $(this).attr('data-widget-name');
            var mode           = $(this).attr('data-mode');
            var widgetHeight   = $(this).attr('data-height');
            var widgetWidth    = $(this).attr('data-width');       
            var itemsList      = $(this).find('ul[role=list]');

            $(this).eventralize(that.events, that, 'facadeSelectList');

            // Default to single selection mode;
            if (!mode) mode = 'single';

            if (mode == 'multi') {
                itemsList.find('li > a').addClass('multi');
            }

            // Set height if data-height is not empty;
            if (widgetHeight) itemsList.css({height: widgetHeight});
            
            // Set parent width if data-width is not empty;
            if (widgetWidth) $(this).css({width: widgetWidth});                 

            // If has preselected value(s), check them;
            that.checkSelectedValues($(this));

            // Update hidden field
            that.getSelectedValues($(this));

        });

    
    },

    clear: function(obj) {
    	obj.find('li > a').removeClass('checked');
    },

    checkSelectedValues: function(obj) {
        var checked, field;
        field  = obj.find('input[role=data-value]');
        checked = field.val().split(',');
    	if (obj.attr('data-mode') == 'single') checked = checked[0];
    	obj.find('li').each( function() {
			var link, val;
			link  = $(this).find('a');
			value = link.attr('data-value');
			if ($.inArray(value, checked) > -1) link.addClass('checked');
    	});    		
    },

    getSelectedValues: function(obj) {
        var temp, value, items, field;
        temp = [];
        items= obj.find('li > a');
        field= obj.find('input[role=data-value]');
        $.each(items, function(key, value) {
            if ($(this).hasClass('checked')) {
                value = $(this).attr('data-value');
                if (value) temp.push(value);
            };
        });
        field.val(temp);
    },

    uncheck: function(event) {
        event.preventDefault();
        var target, parent;

        target= $(event.target);
        parent= $(target.closest('[data-widget=selectlist]'));

        if (target.hasClass('checked')) $(event.target).removeClass('checked');
        this.getSelectedValues(parent);
    },    

    check: function(event) {
        event.preventDefault();
        var target, parent;
        
        target= $(event.target);
        parent= $(target.closest('[data-widget=selectlist]'));

        if (parent.attr('data-mode') == 'single') this.clear(parent);

        if (!target.hasClass('checked')) {
        	$(event.target).addClass('checked');
        	this.getSelectedValues(parent);
        }
    }    
}

// Bind to elements with [data-widget=notice] attributes
var facadeSelectList = new selectlistWidget('[data-widget=selectlist]');