/**
 * HATCHD DIGITAL SLIDE
 *
 * The slide hatchdling allows for simple carousel action in your browser in
 * a way that works for RWD. We've taken a look at the requirements for the
 * slider to change depending on the width of the page as possible.
 *
 * This code has been developed in house at HATCHD DIGITAL.
 * @see http://hatchd.com.au/
 *
 * FOR DEVELOPERS:
 *
 * The code in this file should always be well formatted and never be
 * used in production systems. Your site should always use disc/*-.min.js
 * which contains a packed and minified version of the script
 * prepended with all dependencies.
 *
 * REQUIRED FRAMEWORKS
 *
 * @required jquery (v1.8.0+)
 * -- (http://jquery.com)
 *
 * VALIDATION
 *
 * All code must validate with JSHint (http://www.jshint.com/) before
 * commiting this repo. NO debug code should remain in your final
 * versions. Ensure to remove every reference to console.log.
 *
 * STYLE
 *
 * All code should be within 79 characters WIDE to meet standard Hatchd
 * protocol. Reformat code cleanly to fit within this tool.
 *
 * CONTRIBUTORS
 *
 * @author Jimmy Hillis <jimmy@hatchd.com.au>
 * @author Niaal Holder <niaal@hatchd.com.au>
 *
 */

/* global define */

(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else {
        // Browser globals
        window.Slide = factory(window.jQuery);
    }

}(function ($) {
    'use strict';

    /**
     * Helper methods.
     */
    var getTime = (Date.now || function() {
        return new Date().getTime();
    });

    $.fn.reverse = [].reverse;

    /**
     * Base object for storing requried information about each Slide module
     * on any given page.
     *
     * @param {selector} The element wrapping the Slide
     * @param {object} Default initialization options
     * @return Slide
     */
    var Slide = function Slide(element, options) {

        var item_count;

        // Set and extend default options with user provided
        this.options = $.extend({
            'loop': false,
            'onChange': null,
            'onInit': null,
            'grouping': 1,
            'breakpoints': null
        }, options);

        // Set event listeners
        this.onChange = this.options.onChange;
        this.onInit = this.options.onInit;

        // Set local private variables for managing the current state
        this._element = $(element);
        this._items = this._element.find('.slide-item');
        this._translate = 0;

        // Find the initial current image
        this._current = $(this._items.filter('.state-current'));
        // If HTML configuration is not right, set the initial ones automatically
        if (!this._current.length || this._current_length != this.options.grouping) {
            this._current = this._items.slice(0, this.options.grouping);
            this._current.addClass('state-current');
        }

        // Initialize correct setCurrent method
        this.setCurrent = this.supportsTransform() ? this._setCurrent : this._setCurrentSansTransition;

        // Initialize grouping based on breakpoint or provided grouping
        if (this.options.breakpoints !== null) {
            // Ensure breakpoints are ordered correctly and bind the
            // to a listner event
            this._bindBreakpoints(this.options.breakpoints.sort(function (a, b) {
                return a.width > b.width;
            }));
            this.setGrouping(1);
            $(window).trigger('resize'); // This is async
        }
        else {
            this.setGrouping(this.options.grouping);
        }

        // Bind all events for next/previous/specific
        this._bind();

        // Draw the slideshow
        this._draw();

        // Trigger that we are built and ready to roll
        this._element.trigger('init', this._current);

        return this;
    };

    /**
     * Draw the current slideshow. Generate the correct sizing and widths
     * for each element to respond correctly at the current breakpoint.
     * Also updates the controller state based on any changes.
     *
     * @return {Slide}
     */
    Slide.prototype._draw = function () {
        // Set correct state on controls
        this._updateControls();
        // Initialize sizes for each slide for responsive nature
        this._element.find('.slide-items').css(
            'width', (100 * (this._items.length / this._grouping)).toString() + '%');
        this._items.css('width', (100 / this._items.length).toString() + '%');
        return this;
    };

    /**
     * Return next slide(s) based on the current provided slides. If grouping
     * this will return the next "grouping" of slides.
     *
     * @param {Array} slide Slide to find next grouping of
     * @return {Array} New list of slides
     */
    Slide.prototype._nextSlide = function (slide) {
        if (this._grouping > 0) {
            return slide.first().nextAll().andSelf().slice(this._grouping, this._grouping * 2);
        }
        return slide.next();
    };

    /**
     * Return previous slide(s) based on the current provided slides. If
     * grouping this will return the next "grouping" of slides.
     *
     * @param {Array} slide Slide to find next grouping of
     * @return {Array} New list of slides
     */
    Slide.prototype._prevSlide = function (slide) {
        if (this._grouping > 0) {
            return slide.first().prevAll().slice(0, this._grouping).reverse();
        }
        return slide.prev();
    };

    /**
     * Setup breakpoint support for the slider. This will only be called
     * if breakpoints are provided to the slider. Polling function to
     * update the current draw state on browser width changes.
     *
     * Notice that the default grouping (effectively a 0 width breakpoint)
     * is 1. To customize this behaviour pass an initial width 0 breakpoint
     * to the configuration.
     *
     * @return void
     */
    Slide.prototype._bindBreakpoints = function (breakpoints) {
        var self = this;
        $(window).on('resize', function () {
            if (self.resizeWaitEvent) {
                window.clearTimeout(self.resizeWaitEvent);
            }
            self.resizeWaitEvent = window.setTimeout(function() {
                var breakpoint;
                var width = self._windowWidth();
                for (var i = breakpoints.length - 1; i >= 0; i--) {
                    breakpoint = breakpoints[i];
                    if (breakpoint.width < width) {
                        self.setGrouping(breakpoint.grouping);
                        self.setCurrent(self._current);
                        return;
                    }
                }
                self.setGrouping(self.options.grouping);
                self.setCurrent(self._current);
            }, 1000);
            return;
        });
    };

    /**
     * Determine window width.
     * This works for any 'sane' device that reports orientation 0 as portrait.
     */
    Slide.prototype._windowWidth = function() {
        if (window.orientation === null) return $(window).width();
        var width = $(window).width();
        var height = $(window).height();
        switch(window.orientation)
        {
            // Landscape
            // Pick biggest dimension to cater for devices that don't
            // update width/height after a rotation event.
            case -90:
            case 90:
                return width > height ? width : height;

            // Portrait
            // Pick smallest dimension to cater for devices that don't
            // update width/height after a rotation event.
            default:
                return width < height ? width : height;
        }
    };

    /**
     * Update the current "grouping" of list items within the slideshow.
     * Will force a redraw to match the new grouping.
     *
     * @param void
     */
    Slide.prototype.setGrouping = function (grouping) {
        this._grouping = grouping;
        this._draw();
    };

    /**
     * Return the current item grouping.
     *
     * @param int
     */
    Slide.prototype.getGrouping = function () {
        return this._grouping;
    };

    /**
     * Return true if current browser supports CSS3 transforms.
     *
     * @param bool
     */
    Slide.prototype.supportsTransform = function () {
        var prefixes = [
            'transform', 'WebkitTransform', 'MozTransform',
            'OTransform', 'msTransform'
        ];
        var i;
        for(i = 0; i < prefixes.length; i++) {
            if (document.createElement('div').style[prefixes[i]] !== undefined) {
                return true;
            }
        }
        return false;
    };

    /**
     * Attach click events for next/previous and moving to a specific
     * slide element from the required classes.
     *
     * @return {Slide}
     */
    Slide.prototype._bind = function () {
        var that = this;
        // Element actions
        this._element.find('.slide-next').on('click', function (e) {
            that.next();
            e.preventDefault();
        });
        this._element.find('.slide-prev').on('click', function (e) {
            that.prev();
            e.preventDefault();
        });
        this._element.find('.slide-select').on('click', function (e) {
            var $this = $(this);
            var new_slide = that._element.find($this.attr('href'));
            that.setCurrent(new_slide);
            e.preventDefault();
        });
        // Event listeners
        this._element.on('change', function (e, newslide, oldslide) {
            if (typeof that.onChange === 'function') {
                that.onChange.call(this, e, newslide, oldslide);
            }
        });
        this._element.on('init', function (e, newslide) {
            if (typeof that.onInit === 'function') {
                that.onInit.call(this, e, newslide);
            }
            that.first();
        });
        this._element.find('.slide-bullets .slide-bullet').on('click', function (e) {
            that.nth($(this).index());
            e.preventDefault();
        });
        return this;
    };

    /**
     * Animation to previous element in the item list. Looping
     * to last slide is possible when the user has reached the end,
     * depending on object options.
     *
     * @return {selector}  New current element
     */
    Slide.prototype.prev = function () {
        if (this.hasLess()) {
            this.setCurrent(this._prevSlide(this._current));
        }
        else if (this.options.loop === true) {
            this.setCurrent(this._items.last());
        }
    };

    /**
     * Animation to next element in the item list. Looping
     * to first slide is possible when the user has reached the end,
     * depending on object options.
     *
     * @return {selector}   New current element
     */
    Slide.prototype.next = function () {
        if (this.hasMore()) {
            this.setCurrent(this._nextSlide(this._current));
        }
        else if (this.options.loop === true) {
            this.setCurrent(this._items.first());
        }
    };

    /**
     * Trigger the 'first' element on this list.
     */
    Slide.prototype.first = function () {
        this.setCurrent(this._items.first());
    };

    /**
     * Trigger the nth element on this list
     */
    Slide.prototype.nth = function (offset) {
        if ((offset >= 0) && (offset < this._items.length)) {
            this.setCurrent(this._items[offset]);
        }
    };

    /**
     * setCurrent for browsers that do not support CSS3 translate. Uses
     * show/hide on each grouped elements.
     *
     * @param {selector} new_slide New element to  be visible & current
     * @return Slide
     */
    Slide.prototype._setCurrentSansTransition = function (new_slide) {
        var $new_slide = $(new_slide);
        var $previous_slide = this._current;
        var new_index = this._items.index($new_slide.first());
        var stop_index = new_index + (this._grouping - 1);
        for (var i = 0; i < this._items.length; ++i) {
            if (i < new_index) {
                $(this._items[i]).hide().removeClass('state-current');
            }
            else if ((i >= new_index) && (i <= stop_index)) {
                $(this._items[i]).show().addClass('state-current');
            }
            else {
                $(this._items[i]).hide().removeClass('state-current');
            }
        }
        this._current = $new_slide;
        this._element.trigger('change', [this._current, $previous_slide]);

        // Redraw controls
        this._updateControls();
    };

    /**
     * Sets the new current element and runs any required transition
     * animation as required.
     *
     * @param {selector} new_slide New element to  be visible & current
     * @return Slide
     */
    Slide.prototype._setCurrent = function (new_slide) {
        var $new_slide = $(new_slide);
        var $previous_slide = this._current;
        var new_index = this._items.index($new_slide.first());
        var previous_index = this._items.index($previous_slide.first());
        var new_translate_position;
        var max_translate_position;
        // No item found
        if (new_index === -1) {
            return;
        }
        // The item is after the current
        else if (new_index >= previous_index) {
            max_translate_position = -100 * (this._items.length - this._grouping);
            new_translate_position = this._translate - ((new_index - previous_index) * 100);
            this._translate = Math.max(max_translate_position, new_translate_position);
        }
        // The item is before the current
        else {
            new_translate_position = this._translate + ((previous_index - new_index) * 100);
            this._translate = Math.min(0, new_translate_position);
        }
        // Move each element across the screen the same distance
        this._items.css('transform',
                        'translateX(' + this._translate.toString() + '%)');

        // Update class states
        $previous_slide.removeClass('state-current');
        this._current = $new_slide.addClass('state-current');
        this._element.trigger('change', [this._current, $previous_slide]);

        // If this element has a high resolution image attached, swap to that on load
        var $img = $(this._current).find('img');
        var hires = $img.attr('data-src');
        if (hires && (hires != $img.attr('src'))) {
            var image = new window.Image();
            image.src = hires;
            if (image.complete || (image.width+image.height) > 0) {
                $img.attr('src', hires);
            }
            else {
                image.onload = function() {
                    $img.attr('src', hires);
                };
            }
        }

        // Redraw controls
        this._updateControls();
    };

    /**
     * Return true if there are more photos (to the "right") to use with
     * Slide.next
     *
     * @return bool
     */
    Slide.prototype.hasMore = function () {
        return (this._items.index(this._current) + this._grouping) < this._items.length;
    };

    /**
     * Return true if there are more photos (to the "left") to use with
     * Slide.prev
     *
     * @return bool
     */
    Slide.prototype.hasLess = function () {
        return (this._items.index(this._current) > 0);
    };

    /**
     * Update the next/previous buttons with a class if it's not able
     * to be used (as there are no images left)
     *
     * @return void
     */
    Slide.prototype._updateControls = function () {
        var $prev = this._element.find('.slide-prev');
        var $next = this._element.find('.slide-next');
        var $bullets = this._element.find('.slide-bullets .slide-bullet');

        if ($bullets.length) {
            $bullets.removeClass('state--active');
            $bullets.eq(this._items.index(this._current)).addClass('state--active');
        }
        if (!this.options.loop) {
            if (!this.hasLess()) {
                $prev.addClass('state-inactive');
            }
            else {
                $prev.removeClass('state-inactive');
            }
            if (this.hasMore()) {
                $next.removeClass('state-inactive');
            }
            else {
                $next.addClass('state-inactive');
            }
        }
    };

    /**
     * jQuery plugin function to initialize any Slide interface provided.
     *
     * @param {object} options User options for new slide interface
     * @param {boolean} force True to allow slide to reload elements
     * @return {selector}
     */
    $.fn.slide = function (options, force) {

        options = options || {};

        return this.each(function () {
            var slide = $(this).data('slide');
            if (!slide || force) {
                slide = new Slide(this, options);
                $(this).data('slide', slide);
            }
        });
    };

    return Slide;
}));
