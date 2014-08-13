// -------------------------------------
// 
//  Author  : Junel Mujar
//  Email   : junelmujar@gmail.com
//  Company : http://cheekybebeshop.com
// 
// -------------------------------------

// -------------------------------------
//  
//  Widget: Notice Widget
//  
//  Purpose: Add functionality to close 
//  notices (or alerts);
//  
// -------------------------------------

// Define our widget object
var noticeWidget = function( element ){
    this.init(element);
}

// Define widget functionality
noticeWidget.prototype = {
    
    // Event definitions
    events: {
      'click a.notice-remove' : 'close' // Close notice 
    },

    // Initialize
    init: function(elem){

        // Bind our events, context, namespace
        this.$elem = $(elem).eventralize(this.events, this, 'facade');

        // Setup each matching element
        this.$elem.each(function() {
            var html    = $(this).html();
            var trigger = '<a href="#" class="notice-remove"><i class="fa fa-times"></i></a>';
            html = trigger + html;
            $(this).html(html);
        });
    },

    // Main functionality
    close: function(event) {
        event.preventDefault();
        $(event.target).parent().velocity('fadeOut', { delay: 200, duration: 400 });
    }    
}

// Bind to elements with [data-widget=notice] attributes
var notice = new noticeWidget('[data-widget=notice]');