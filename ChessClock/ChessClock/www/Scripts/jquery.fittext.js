/*global jQuery */
/*!	
* FitText.js 1.1
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/





(function ($) {
    $.fn.fitText = function (kompressor, options) {

        // Setup options
        var compressor = kompressor || 1,
            settings = $.extend({
                'minFontSize': Number.NEGATIVE_INFINITY,
                'maxFontSize': Number.POSITIVE_INFINITY,
                'basedon': '', //resize this based on another items height / width
                'dir': 'b' //Can be h or w or b 
            }, options);

        return this.each(function () {

            // Store the object
            var $this = $(this);

            // Resizer() resizes items based on the object width divided by the compressor * 10
            var resizer = function () {
                //CUSTOMCODE
                //check if it is visible if not. Just return since no point in resizing: 
                if (!$this.is(":visible"))
                    return;

                var height = $this.height();
                var width = $this.width();
                if (settings.basedon) {
                    var height = $(settings.basedon).height();
                    var width = $(settings.basedon).width();
                }

                var sizew = Math.max(Math.min(width / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize));
                //use height as well 
                var sizeh = Math.max(Math.min(height, parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize));

                //console.log(height, width, sizeh, sizew);//For Debugging

                //If no width or height is set. Ignore that dimension:
                if ((height == 0) || (settings.dir == 'w')) {
                    sizeh = Number.POSITIVE_INFINITY;
                }
                if ((width == 0) || (settings.dir == 'h')) {
                    sizew = Number.POSITIVE_INFINITY;

                }
                //Take the min of both dimension calculations
                var size = Math.min(sizew, sizeh);



                $this.css('font-size', size);
                //Setup line-height as well required because of bootstrap: 
                //NOTE We set it to height as assumed by sizeh :) 
                // This reaquires that we have overflow hidden on the parent element 
                // otherwise text becomes selectable outside the parent div.
                $this.css('line-height', sizeh + 'px');
                //CUSTOMCODE
            };

            // Call once to set.
            resizer();

            // Call on resize. Opera debounces their resize by default. 
            //CUSTOMCODE Removed since custom logic is required 
            //$(window).on('resize', resizer);

            ////CUSTOMCODE
            //setInterval(function () { resizer() }, 1000);
            ////CUSTOMCODE

        });

    };

})(jQuery);