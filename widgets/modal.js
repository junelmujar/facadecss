// -------------------------------------
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
// -------------------------------------
//  
//  Widget: Modal Widget
//  
//  Purpose: Enable an element to serve
//      a modal window for displaying
//      content and other things.
//  
// -------------------------------------

// Define our widget object
var modalWidget = function( element ){
    this.init(element);
}

// Define widget functionality
modalWidget.prototype = {
    
    // Event definitions
    events: {
		'click'                 : 'open',
		'keydown(esc) document' : 'close',
    },

    close_events: {
		'click a[data-widget-close], click .modal-widget-close' : 'close'
    },

    overlay_events: {
		'click' : 'close'
    },

    // Initialize
    init: function(elem){
        
        this.fadeSpeed     = 350; //ms
        this.modal_widget  = '';
        this.modal_overlay = '';
        this.overlay       = '';
        this.target        = '';
        this.content       = '';

    	// Bind our events, context, namespace
		this.$elem         = $(elem).eventralize(this.events, this, 'facade');

        // Modal html fragment
		this.modal_html    = '<div class="modal-widget-overlay"></div>' +
                             '<div class="modal-widget">'+
							 '<a href="#" class="modal-widget-close"><i class="fa fa-times"></i></a>' +
							 '<div class="modal-widget-content"></div>';


        // Add our html fragment if it does not exist!                             
		if (!this.modal_overlay.length) {
			$('body').prepend(this.modal_html); 
		}  

    },

    open: function(event) {

        event.preventDefault();

        // Get our target element
        var target = $(event.target);

        // Get data attributes and target content
        this.target  = target.attr('data-widget-modal-target');
        this.overlay = target.attr('data-widget-modal-overlay');
        this.content = $(this.target).html();

        // Build modal and modal widget objects
        this.modal_widget  = $('.modal-widget');
        this.modal_overlay = $('.modal-widget-overlay');

        if (this.overlay == 'show') {

        	this.modal_overlay.
        			css('visibility','visible').hide().fadeIn(this.fadeSpeed);

        	if (this.content) this.modal_widget.children('.modal-widget-content').html(this.content);

        	// Calculate top offset to center our modal vertically
  			var top_offset = (this.modal_widget.height() / 2) + 15;

  			// Show our modal window
  			this.modal_widget
                .css('margin-top', -top_offset)
                .css('visibility','visible').hide().fadeIn(this.fadeSpeed);   

            // Bind events to overlay
            this.modal_overlay.eventralize(this.overlay_events, this, 'facade');               

            this.modal_widget.eventralize(this.close_events, this, 'facade');           
        }
    },    

    close: function(event) {

        event.preventDefault();

        if (this.modal_widget) {
            this.modal_widget.fadeOut(this.fadeSpeed);

    		if (this.overlay == "show") {
    			this.modal_overlay.fadeOut(this.fadeSpeed);
    		}

    		this.destroy();
        }

    },    
	
	destroy: function() {
		this.modal_overlay.uneventralize(this.overlay_events);
		this.modal_widget.uneventralize(this.close_events);
      	this.$elem.uneventralize(this.events);
    },
}

// Bind to elements with [data-widget=notice] attributes
var facadeModal = new modalWidget('[data-widget=modal]');