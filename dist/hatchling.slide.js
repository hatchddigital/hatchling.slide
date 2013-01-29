/*! Hatchling Slide - v0.2.0 - 2013-01-29
* https://github.com/hatchddigital/hatchling.slide
* Copyright (c) 2013 Jimmy Hillis; Licensed MIT */

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
    var Slide = function Slide(element, options)  {

        var slide = this
          , item_count;

        // Set and extend default options with user provided
        this.options = $.extend({
            'loop': false
        }, options);

        this.$element = $(element);
        this.items = this.$element.find('.' + ITEM);

        // Force first element to be set to current only when it doesn't exist
        if (!(this.current = this.items.find('.'+CURRENT)).length) {
            (this.current = this.items.first()).addClass(CURRENT);
        }

        // Hide all non-current elements
        this.items.slice(1).addClass(HIDDEN).hide();

        // Initialize sizes for each slide for responsive nature
        item_count = this.items.length;
        this.$element.find('.'+ITEM_LIST).css('width', (item_count * 100) + '%');
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
            $next.on('click', function () {
                slide.next();
            });
            $prev.on('click', function () {
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
