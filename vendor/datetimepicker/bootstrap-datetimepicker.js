﻿/**
 * Datetime Picker v1.5
 * 
 * Copyright by Javis V. Perez
 * http://www.javisperez.com
 * 
 * For example and more info:
 * https://github.com/javisperez/datetimepicker
 *
 */
(function ($) {

    $.fn.datetimepicker = function(options) {
        
        var defaults = {
            minDate   : 24,
            maxDate   : 24,
            startDate    : null,
            onChange     : null,
            element      : this,
            daysLabel    : ['S','M','T','W','T','F','S'],
            monthsLabel  : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dec'],
            timerFormat  : 12 // or 24
        }

        options = $.extend({}, defaults, options);
        
        var that = this;

        // Each selector
        this.each(function(i){
            /**
             * Variables
             */
            var $self = $(this);

            var defaultTime = '8:00';

            // If there's a start date in the dataset property
            if(/^(\d{4})-(\d{1,2})-(\d{1,2})/.test($self.attr('data-start-date'))) {
                var splitted      = $self.attr('data-start-date').split(' ');
                options.startDate = splitted[0];
                defaultTime       = splitted[1];
            }

            var d          = document;
            var ce         = function($element) {
                                return d.createElement.call(d, $element);
                             };
            var date       = !options.startDate ? new Date() : new Date(options.startDate);
            var isMouseDown= false;
            var navTimer   = null;
            var today         = new Date();
            var currentHour   = parseInt(defaultTime.substr(0, defaultTime.indexOf(':')));
            var currentMinute = parseInt(defaultTime.substr(defaultTime.indexOf(':')+1, 2));
            var altField      = null;
            var selectedDate  = new Date(date);
            
            $self.data({
                dateContainer: ce('div'),
                timeContainer: ce('div'),
                datepickerContainer: ce('div')
            });

            if (options.minDate == 'today') {
                options.minDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            } else {
                if(!/^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(options.minDate)) {
                    var tmpDate = new Date(today);

                    if (typeof options.minDate == 'number') {
                        tmpDate.setMonth( today.getMonth() - options.minDate );
                    } else {
                        tmpDate.setMonth( today.getMonth() - defaults.minDate );
                    }

                    options.minDate = tmpDate.getFullYear()+'-'+(tmpDate.getMonth()+1)+'-'+tmpDate.getDate();
                }
            }

            if (options.maxDate == 'today') {
                options.maxDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            } else {
                if(!/^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(options.maxDate)) {
                    var tmpDate = new Date(today);

                    if (typeof options.maxDate == 'number') {
                        tmpDate.setMonth( today.getMonth() + options.maxDate );
                    } else {
                        tmpDate.setMonth( today.getMonth() + defaults.maxDate );
                    }
                    options.maxDate = tmpDate.getFullYear()+'-'+(tmpDate.getMonth()+1)+'-'+tmpDate.getDate();
                }
            }

            var minLimits = options.minDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
            var maxLimits = options.maxDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

            $self.data('dateContainer').className       = 'date-container';
            $self.data('timeContainer').className       = 'time-container';
            $self.data('datepickerContainer').className = 'datepicker-container';

            // extending the date
            date.daysInMonth = function() {
                                            var tmp = new Date(date);
                                            tmp.setDate(32);
                                            return 32 - tmp.getDate();
            }

            date.firstDayInMonth = function() {
                                            var tmp = new Date(date);
                                            tmp.setDate(1);
                                            return tmp.getDay();
            }


            // Clear the mouse up event
            document.onmouseup = function() {
                     stopSeek();
            }

            // Private methods
            // Fast seek when mouse button is hold down
            function fastSeek(index) {
                isMouseDown = true;

                navTimer = setTimeout(function() {
                    gotoMonth(index, true);
                }, 500);
            }

            // Stop seeking if the mouse is up    
            function stopSeek() {
                isMouseDown = false;

                clearTimeout(navTimer);
            }

            // Go to a relative month (-1 = previous, 1 = next)
            function gotoMonth(index, recursive) {
                if (index == -1 && (+date.getMonth()+1 == minLimits[2] && date.getFullYear() == minLimits[1])) {
                    return;
                } else
                if (index == 1 && (+date.getMonth()+1 == maxLimits[2] && date.getFullYear() == maxLimits[1])) {
                    return;
                }

                date.setDate(1);
                date.setMonth(date.getMonth()+index);
                date.setFullYear(date.getFullYear());

                build();

                options.onChange && options.onChange.call(Datepicker, date);

                if(recursive && isMouseDown) {
                    setTimeout(function() {
                        gotoMonth(index, recursive);
                    }, 50);
                }
            }

            // Build the html    
            function build() {
                var columns     = 7; // 7 days, so 7 cells
                var rows        = Math.ceil((date.daysInMonth() + date.firstDayInMonth()) / columns ); // How many rows of cells depending on the month days
                var currentDate = 1; // Days counter

                // Create all empty elements to reference later        
                var table  = ce('table');
                var tr     = ce('tr');
                var tdPrev = ce('td');
                var tdYear = ce('td');
                var tdNext = ce('td');

                // Properties
                table.cellSpacing = 0;
                table.cellPadding = 0;

                tdYear.colSpan = 5;
                tdYear.align = 'center';
                tdYear.className = 'year';
                tdYear.innerHTML = options.monthsLabel[date.getMonth()] +' '+ date.getFullYear();

                tdPrev.innerHTML = '&#9664;';
                tdNext.innerHTML = '&#9654;';

                // Events on those elements
                tdPrev.onclick = function(){
                    gotoMonth(-1);
                }
                tdPrev.onmousedown = function() {
                    fastSeek(-1);
                }

                tdNext.onclick = function() {
                    gotoMonth(1);
                }
                tdNext.onmousedown = function() {
                    fastSeek(1);
                }

                // Attach all td's to the first row
                tr.appendChild(tdPrev);
                tr.appendChild(tdYear);
                tr.appendChild(tdNext);

                // And the row to the table
                table.appendChild(tr);

                for(var i=0; i<=rows; i++) { // Note the condition <= instead of <, this is to use the "days" label in the first row
                    // Create the row that will hold the next 7 days
                    var tr = ce('tr');

                    for(var j=0; j<columns; j++) {
                        // Create each day cell
                        var td = ce('td');

                        td.align = 'center';

                        if(i==0) { // if we're in the first row, attach the days label
                            td.innerHTML = options.daysLabel[j];
                            tr.appendChild(td);
                            continue;
                        }

                        // If the current day cell is less than the first day of the current month, leave the empty cell (at beginning of the month)
                        if((j < date.firstDayInMonth() && i == 1)  || currentDate > date.daysInMonth()) {
                            td.className = 'emptyDay';
                        } else {
                            isToday = today.getDate() == currentDate;
                            isToday = isToday && today.getMonth()    == date.getMonth();
                            isToday = isToday && today.getFullYear() == date.getFullYear();

                            var isInMinLimit = date.getFullYear() == minLimits[1] && date.getMonth()+1  == minLimits[2];
                            var isInMaxLimit = date.getFullYear() == maxLimits[1] && date.getMonth()+1  == maxLimits[2];

                            if(isToday) {
                                td.className = 'today';
                            }

                            td.className += ' date';

                            $(td).attr('data-date-year-value', date.getFullYear());

                            $(td).attr('data-date-month-value', date.getMonth());

                            $(td).attr('data-date-day-value', currentDate);

                            if ((isInMinLimit && currentDate < minLimits[3]) || (isInMaxLimit && currentDate > maxLimits[3])) {
                                    td.className += ' disabled';
                            }

                            if (date.getFullYear() == selectedDate.getFullYear() && date.getMonth() == selectedDate.getMonth() && currentDate == selectedDate.getDate()){
                                td.className += ' selected';
                            }

                            td.innerHTML = currentDate++;

                            // When clicking on each date td, deselect any previous one, and select the clicked one
                            td.onclick = function() {
                                if ($(this).hasClass('disabled')) {
                                    return;
                                }
                                selectDate($(this));
                            }
                        }

                        // Add each day to its row                
                        tr.appendChild(td);
                    }

                    // And each row to the table
                    table.appendChild(tr);
                }

                empty($self.data('dateContainer'));
                empty($self.data('timeContainer'));

                $self.data('dateContainer').appendChild(table);      
                $self.data('timeContainer').appendChild(buildTime());

                $self.data('datepickerContainer').appendChild($self.data('dateContainer'));
                $self.data('datepickerContainer').appendChild($self.data('timeContainer'));

                return $self.data('datepickerContainer');        
            }

            // Select a date
            function selectDate(clickedCell) {
                $($self.data('dateContainer')).find('td.selected').removeClass('selected');

                selectedDate = new Date(clickedCell.attr('data-date-year-value')+'-'+clickedCell.attr('data-date-month-value')+'-'+clickedCell.attr('data-date-day-value'));

                $(clickedCell).addClass('selected');
            }

            // Empty an element
            function empty(element) {
                while (element.lastChild) {
                  element.removeChild(element.lastChild);
                }
            }

            // Add heading zeros if less than 10
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }

            // Build the html for the time selector
            function buildTime() {
                var table = ce('table');
                var tr    = ce('tr');
                var tdPlus = ce('td');
                var tdMinus = ce('td');
                var tdPlusMinutes = ce('td');
                var tdMinusMinutes = ce('td');
                var td = ce('td');
                var hours = ce('input');
                var minutes = hours.cloneNode(true);
                var currentDown = null;

                function fastSeekTime() {
                    isMouseDown = true;

                    navTimer = setTimeout(updateTimeNav, 500);
                }

                function updateTimeNav() {
                    switch (currentDown) {
                        case tdPlus:
                            updateHours(1);
                        break;

                        case tdMinus:
                            updateHours(-1);
                        break;

                        case tdPlusMinutes:
                            updateMinutes(1);
                        break;

                        case tdMinusMinutes:
                            updateMinutes(-1);
                        break;
                    }

                    navTimer = setTimeout(updateTimeNav, 50);
                }

                function updateMinutes(index) {
                    if(index > 0) {
                        var currentMinute = minutes.value == 59 ? 0 : +minutes.value + index;
                    } else {
                        var currentMinute = minutes.value == 0 ? 59 : +minutes.value + index;
                    }
                    minutes.value = pad(currentMinute);
                }

                function updateHours(index) {
                    var currentHour = hours.value;

                    if((currentHour == 11 && index > 0 || currentHour == 12 && index < 0) && options.timerFormat != 24) {
                        var $amPm = $($self.data('timeContainer')).find('.amPm');
                        var currentAmPm = $amPm.text();

                        if(currentAmPm == 'am') {
                            currentAmPm = 'pm';
                        } else {
                            currentAmPm = 'am';
                        }

                        $amPm.text(currentAmPm);
                    }

                    if(options.timerFormat != 24) {
                        if(index > 0) {
                            currentHour = currentHour == 12 ? 1 : +hours.value + index;
                        } else {
                            currentHour = currentHour == 1 ? 12 : +hours.value + index;
                        }
                    } else {
                        if(index > 0) {
                            currentHour = currentHour == 23 ? 0 : +hours.value + index;
                        } else {
                            currentHour = currentHour == 0 ? 23 : +hours.value + index;
                        }
                    }

                    hours.value = pad(currentHour);
                }

                table.cellSpacing = 0;
                table.cellPadding = 0;

                tdPlus.innerHTML  = '&#9650;';
                tdMinus.innerHTML = '&#9660;';
                tdPlusMinutes.innerHTML  = '&#9650;';
                tdMinusMinutes.innerHTML = '&#9660;';

                tdPlus.className = 'stepper';
                tdMinus.className = 'stepper';
                tdPlusMinutes.className = 'stepper';
                tdMinusMinutes.className = 'stepper';

                hours.type = 'text';
                hours.name = 'hours';
                hours.value = pad(currentHour);

                minutes.type = 'text';
                minutes.name = 'minutes';
                minutes.value = pad(currentMinute);

                tdPlus.onmousedown = function() {
                    currentDown = this;
                    fastSeekTime();
                }

                tdMinus.onmousedown = function() {
                    currentDown = this;
                    fastSeekTime();
                }

                tdPlusMinutes.onmousedown = function() {
                    currentDown = this;
                    fastSeekTime();
                }

                tdMinusMinutes.onmousedown = function() {
                    currentDown = this;
                    fastSeekTime();
                }

                tdPlus.onclick = function() {
                    updateHours(1);
                }

                tdMinus.onclick = function() {
                    updateHours(-1);
                }

                tdPlusMinutes.onclick = function() {
                    updateMinutes(1);
                }

                tdMinusMinutes.onclick = function() {
                    updateMinutes(-1);
                }

                tr.appendChild(tdPlus);
                tr.appendChild(td.cloneNode(false));
                tr.appendChild(tdPlusMinutes);

                table.appendChild(tr);

                tr = tr.cloneNode();

                td.appendChild(hours);

                tr.appendChild(td); // hours input
                tr.appendChild(td.cloneNode(false));

                var td2 = td.cloneNode(false);
                td2.className = 'minutes-container ' + (options.timerFormat == 24 ? 'military-format' : '');
                td2.appendChild(minutes);

                var span = ce('span');

                if(options.timerFormat != 24) {
                    span.innerHTML = 'pm';
                    span.className = 'amPm';
                }

                td2.appendChild(span);
                tr.appendChild(td2); // minutes input

                table.appendChild(tr);

                tr = tr.cloneNode(false);

                td = ce('td');

                tr.appendChild(tdMinus); // hours minus
                tr.appendChild(td.cloneNode(false));
                tr.appendChild(tdMinusMinutes); // minutes minus

                table.appendChild(tr);

                tr = tr.cloneNode(false);

                var tdColspan = td.cloneNode(false);

                tdColspan.colSpan = 4;

                var setButton = ce('button');

                setButton.innerHTML = 'SET';

                setButton.onclick = function() {

                                        var selectedTd = $($self.data('dateContainer')).find('td.selected');

                                        if(selectedTd.length == 0) {
                                            hide();
                                            return;
                                        }

                                        var selectedDate    = selectedTd.get(0);
                                        var $timeContainer  = $($self.data('timeContainer'));
                                        var selectedTime    = $timeContainer.find('input');

                                        var amOrPm       = $timeContainer.find('.amPm').text();
                                        var minutesValue = selectedTime.filter('[name=minutes]').val();
                                        var hoursValue   = selectedTime.filter('[name=hours]').val();

                                        var d = selectedDate.dataset;

                                        var valueString  = d.dateDayValue +' ';
                                            valueString += options.monthsLabel[d.dateMonthValue] +', ';
                                            valueString += d.dateYearValue +' @ ';
                                            valueString += hoursValue +':'+ minutesValue+' ';

                                        if(options.timerFormat != 24) {
                                            valueString += amOrPm.toUpperCase();
                                        }

                                        $self.val( valueString );

                                        if(options.timerFormat != 24) {
                                            altField.val(d.dateYearValue+'-'+(+d.dateMonthValue+1)+'-'+d.dateDayValue +' '+ (+hoursValue + (amOrPm == 'pm' ? 12 : 0)) +':'+ minutesValue+':00' );
                                        } else {
                                            altField.val(d.dateYearValue+'-'+(+d.dateMonthValue+1)+'-'+d.dateDayValue +' '+ hoursValue +':'+ minutesValue+':00' );
                                        }

                                        hide();
                }

                tdColspan.appendChild(setButton);

                tr.appendChild(tdColspan);

                table.appendChild(tr);

                return table;
            }

            // Show the datepicker
            function show() {
                $($self.data('datepickerContainer')).fadeIn('fast');
            }

            // Hide the datepicker
            function hide() {
                $($self.data('datepickerContainer')).fadeOut('fast');
            }

            document.body.appendChild( build() );

            // On focus display the calendar
            $self.on('focus click', function(){
                show();
            });

            // Get the element position, to place the calendar below
            var offset = $self.offset();

            $($self.data('datepickerContainer')).css({
                top: offset.top + $self.outerHeight(),
                left:offset.left
            });


            var defaultDateValue = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+pad(currentHour)+':'+pad(currentMinute)+':00';

            // Create the alt field to send the date format to
            altField = $('<input type="hidden" name="'+$self.attr('name')+'" value="'+defaultDateValue+'" id="datepickerAltField" />').insertAfter($self);

            $self.attr('name', $self.attr('name')+'-original');

            // assign hide / show events

            $self.on('dt:hide', hide);
            $self.on('dt:show', show);
        });
        
        
        document.onmousedown = function(e) {
                            var target = e.target || e.srcElement;

                            that.each(function(i) {
                                var $self = $(this);

                                if(target !== $self.get(0) && !$($self.data('datepickerContainer')).find(target).length) {
                                    $self.trigger('dt:hide');
                                }
                            });

        }
    }
    
})(jQuery);