$( function()
{
	// TODO: If a checkbox is pre-checked make the toggle switch the actual state;

    var targets 	= $( '[data-widget~=select]' );
    var template	= '<div class="select-widget"><a class="select-toggle"></a><div class="select-values"></div></div>';

    targets.each(function() {
    
    	$(this).append(template);

		var placeholder = $(this).attr('data-placeholder') ? $(this).attr('data-placeholder') : 'Select...';
		var select      = $(this).find('select');
		var toggle      = $(this).find('.select-widget .select-toggle');

    	toggle.html(placeholder);
		//select.addClass('hidden');

		var opts = '<div class="select-search" style="margin: 5px;"><input type="text" placeholder="Search..." style="width: 100%" /></div>';
 
    	select.find('option').each(function() {
    		var value = $(this).val() ? $(this).val() : '_null_';
		 	opts = opts + '<a data-select-value="' + value + '">' + $(this).text() + '</a>';
    	});

    	$(this).children('.select-widget').find('.select-values').html(opts);

    	$(this).children('.select-widget').find('.select-values a').each(function() {

    		$(this).bind('click', function(event) {
    			event.preventDefault();
    			$(this).siblings().removeClass('selected');
    			$(this).addClass('selected');
    			$(this).parent().siblings('.select-toggle').html($(this).text());
    			$(this).parent().removeClass('opened');
    			$(this).parent().siblings('.select-toggle').attr('data-select-state', 'closed');;
                $(this).parent().parent().siblings('select');
            
    		});
    	});

    	$(this).children('.select-widget').find('.select-toggle').bind('click', function(event) {
    		
    		event.preventDefault();

			var widget_state = $(this).attr('data-select-state');

    		if (!widget_state) {
    			$(this).siblings('.select-values').addClass('opened');
    			$(this).attr('data-select-state', 'open');
    		} else {
    			if (widget_state == 'open') {
    				$(this).siblings('.select-values').removeClass('opened');
    				$(this).attr('data-select-state', 'closed');
    			} else {
    				$(this).siblings('.select-values').addClass('opened');		
    				$(this).attr('data-select-state', 'open');
    			}
    		}

            select.focus();
    		
    	});

    })

});