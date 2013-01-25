/*! Hatchling Slide - v0.2.0 - 2013-01-25
* https://github.com/hatchddigital/hatchling.slide
* Copyright (c) 2013 Jimmy Hillis; Licensed MIT */

;(function($) {

    var DATA_PROP = 'hl-slide'
      , ITEM = 'hls-item'
      , CURRENT = 'state-current'
      , HIDDEN = 'hide'
      , NEXT = 'hls-next'
      , PREV = 'hls-prev';

    /**
     * Base object for storing requried information about each Slide module
     * on any given page.
     */
    var Slide = function (element, visible, options)  {
        var slide = this;
        this.$element = $(element);
        this.visible = visible || false;
        this.items = this.$element.find('.'+ITEM);
        // Set and extend default options with user provided
        this.options = {
            'loop': false
        };
        this.options = $.extend(this.options, options);
        // Initialize default sizes and areas
        var gallery_width = this.items.length * this.locs().width
          , visible_width = this.visible * this.locs().width;
        // Current is manually provided else first
        if (!(this.current = this.items.find('.'+CURRENT)).length) {
            (this.current = this.items.first()).addClass(CURRENT);
        }
        // Hide all non-current elements
        this.items.slice(1).addClass(HIDDEN).hide();
        return this;
    };

    /**
     * Moves the slider to reveal the previous n elements.
     */
    Slide.prototype.prev = function (n) {

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
     * Moves the slider to reveal the next n elements.
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
     * Swaps the current showing slide with the element provided.
     * @param $HTMLElement new_slide: The new 'current' slide element which
     *                                should always be part of this.items
     *                                though isn't specifically required.
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
    };

    /**
     * jQuery plugin attaches map to a specific DOM elements.
     */
    $.fn.slide = function (options) {

        options = options || {};

        this.each(function () {
            var $this = $(this)
              , slide = false;
            // If we can't find an existing modal, create a new one
            if (!slide) {
                slide = new Slide(this, (options.visible || 3), options);
                $this.data(DATA_PROP, slide);
            }
            // Events
            $this.find('.'+NEXT).on('click', function () {
                slide.next();
            });
            $this.find('.'+PREV).on('click', function () {
                slide.prev();
            });
        });

        if (this.length === 1) {
            return $(this).data(DATA_PROP);
        }

    };

}(window.jQuery));
