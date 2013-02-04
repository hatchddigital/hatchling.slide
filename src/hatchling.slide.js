/**
 * HATCHD DIGITAL SLIDE jQUERY PLUGIN
 *
 * ATTRIBUTION-NONCOMMERCIAL-SHAREALIKE 3.0 UNPORTED
 *
 * THE WORK (AS DEFINED BELOW) IS PROVIDED UNDER THE TERMS OF THIS CREATIVE
 * COMMONS PUBLIC LICENSE ("CCPL" OR "LICENSE"). THE WORK IS PROTECTED BY
 * COPYRIGHT AND/OR OTHER APPLICABLE LAW. ANY USE OF THE WORK OTHER THAN AS
 * AUTHORIZED UNDER THIS LICENSE OR COPYRIGHT LAW IS PROHIBITED.
 *
 * BY EXERCISING ANY RIGHTS TO THE WORK PROVIDED HERE, YOU ACCEPT AND AGREE
 * TO BE BOUND BY THE TERMS OF THIS LICENSE. TO THE EXTENT THIS LICENSE MAY
 * BE CONSIDERED TO BE A CONTRACT, THE LICENSOR GRANTS YOU THE RIGHTS
 * CONTAINED HERE IN CONSIDERATION OF YOUR ACCEPTANCE OF SUCH TERMS AND
 * CONDITIONS.
 *
 * This code has been developed in house at HATCHD DIGITAL.
 * @see http://hatchd.com.au
 *
 * DEVELOPER USAGE:
 *
 * ALL external libraries and should be imported here, using a buildout
 * application e.g. CodeKit. This vesion of the file should be pretty,
 * well formatted, and only contain code that is unique to your OWN app.
 * Your site should always use /app-min.js when loading, which contains
 * a minified version of this script prepended with all external scripts.
 *
 * REQUIRED
 * @required jquery (v1.7.0+)
 *
 * VALIDATION
 * All code must validate with JSHint (http://www.jshint.com/) to be launched
 * within a LIVE web application. NO debug code should remain in your final
 * versions e.g. remove EVERY reference to window.console.log().
 *
 * STYLE
 * All code should be within 79 characters WIDE to meet standard Hatchd
 * protocol. Reformat code cleanly to fit within this tool.
 *
 * jshint = { "laxcomma": true, "laxbreak": true, "browser": true }
 *
 * HATCHDLING SLIDE MODULE
 * FULL DOCUMENTATION: http://github.com/hatchddigital/jquery.slide
 *
 * This code builds a "sliding" bar for use on desktop and touch devices
 * when hiding content and sliding through it. See documentation
 *
 * @company Hatchd Digital <hello@hatchd.com.au>
 * @author Jimmy Hillis <jimmy@hatchd.com.au>
 * @see http://hatchd.com.au/
 *
 */

;(function($) {

    var DATA_PROP = 'hatchling-slide'
      , ITEM_LIST = 'hls-items'
      , ITEM = 'hls-item'
      , CURRENT = 'state-current'
      , HIDDEN = 'hide'
      , NEXT = 'hls-next'
      , PREV = 'hls-prev';

    /**
     * Base object for storing requried information about each Slide module
     * on any given page.
     */
    var Slide = function Slide(element, options) {

        var slide = this
          , item_count;

        // Set and extend default options with user provided
        this.options = $.extend({
            'loop': false
        }, options);

        this.$element = $(element);
        this.items = this.$element.find('.' + ITEM);
        this.item_list = this.$element.find('.' + ITEM_LIST);

        // Force first element to be set to current only when it doesn't exist
        if (!(this.current = $(this.item_list.find('.'+CURRENT))).length) {
            (this.current = this.items.first()).addClass(CURRENT);
        }
        // Hide all elements, which aren't current
        this.items.not(this.current).addClass(HIDDEN).hide();

        // Initialize sizes for each slide for responsive nature
        item_count = this.items.length;
        this.$element.find('.'+ITEM_LIST).css('width',
                                              (item_count * 100) + '%');
        this.items.css('width', (100 / item_count) + '%');

        return this;
    };

    /**
     * Animation to previous element in the item list. Looping
     * to last slide is possible when the user has reached the end,
     * depending on object options.
     * @return {HTMLDOMElement}   New current element
     * @todo support to slide N elements (function parameter) at once
     */
    Slide.prototype.prev = function () {

        var prev = this.current.prev('.'+ITEM);

        if (!prev.length && this.options.loop) {
            prev = this.items.last();
        }
        if (!prev.length) {
            return false;
        }
        this.setCurrent(prev);

        return prev;
    };

    /**
     * Animation to next element in the item list. Looping
     * to first slide is possible when the user has reached the end,
     * depending on object options.
     * @return {HTMLDOMElement}   New current element
     * @todo support to slide N elements (function parameter) at once
     */
    Slide.prototype.next = function (n) {

        var next = this.current.next('.'+ITEM);

        if (!next.length && this.options.loop) {
            next = this.items.first();
        }
        if (!next.length) {
            return false;
        }
        this.setCurrent(next);

        return next;
    };

    /**
     * Sets the new current element and runs any required transition
     * animation as required.
     * @param {HTMLDOMElement} new_slide New element to  be visible & current
     */
    Slide.prototype.setCurrent = function (new_slide) {

        var current_slide = this.current;

        new_slide.removeClass(HIDDEN).addClass(CURRENT).show();
        this.current.removeClass(CURRENT).addClass(HIDDEN).hide();
        this.current = new_slide;

        // if provided, callback to user function
        if (typeof this.options.onchange === 'function') {
            this.options.onchange.call(this, new_slide, current_slide);
        }

        return this;
    };

    /**
     * jQuery plugin function to initialize any Slide interface provided.
     * @param  {object} options User options for new slide interface
     * @return {array}          Current slide, if one exist else a list of
     *                          all slide elements.
     */
    $.fn.slide = function (options) {

        var page_slides = [];
        options = options || {};

        this.each(function () {

            var $this = $(this)
              , slide = false
              , $next = $this.find('.'+NEXT)
              , $prev = $this.find('.'+PREV);

            // Initialize Slide object, if required
            if (!slide) {
                slide = new Slide(this, options);
                $this.data(DATA_PROP, slide);
                page_slides.push(slide);
            }

            // Attach events
            $next.on('click', function (e) {
                e.preventDefault();
                window.console.log('Yeah!');
                slide.next();
            });
            $prev.on('click', function (e) {
                e.preventDefault();
                slide.prev();
            });

        });

        if (this.length === 1) {
            return $(this).data(DATA_PROP);
        }
        else {
            return page_slides;
        }
    };

}(window.jQuery));
