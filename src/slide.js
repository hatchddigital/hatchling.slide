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
            'onInit': null
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
        if (!this._current.length) {
            this._current = this._items.first();
            this._current.addClass('state-current');
        }

        // Set init state on controls
        this._updateControls();

        // Initialize sizes for each slide for responsive nature
        this._element.find('.slide-items').css(
            'width', (100 * this._items.length).toString() + '%');
        this._items.css('width', (100 / this._items.length).toString() + '%');

        // Bind all events for next/previous/specific
        this._bind();

        // Trigger that we are built and ready to roll
        this._element.trigger('init', this._current);

        return this;
    };

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
            this.setCurrent(this._current.prev());
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
            this.setCurrent(this._current.next());
        }
        else if (this.options.loop === true) {
            this.setCurrent(this._items.first());
        }
    };

    /**
     * Sets the new current element and runs any required transition
     * animation as required.
     *
     * @param {selector} new_slide New element to  be visible & current
     * @return Slide
     */
    Slide.prototype.setCurrent = function (new_slide) {
        var $new_slide = $(new_slide);
        var index = this._items.index(new_slide);
        var current_index = this._items.index(this._current);
        var no_longer_current = this._current;
        // No item found
        if (index === -1 || index === current_index) {
            return;
        }
        // The item is after the current
        else if (index > current_index) {
            this._translate = this._translate - ((index - current_index) * 100);
        }
        // The item is before the current
        else {
            this._translate = this._translate + ((current_index - index) * 100);
        }
        // For browsers with tranform support we shuffle all slides across
        // by the current translate positioning
        if (this.supportsTransform) {
            this._items.css('transform',
                            'translateX(' + this._translate.toString() + '%)');
        }
        // The no animation version just shows the current slide and hides
        // all others
        else {
            this._current.hide();
            $new_slide.show();
        }
        this._updateControls();
        this._current = this._current.removeClass('state-current');
        this._current = $new_slide.addClass('state-current');
        this._element.trigger('change', [this._current, no_longer_current]);
    };

    /**
     * Return true if there are more photos (to the "right") to use with
     * Slide.next
     *
     * @return bool
     */
    Slide.prototype.hasMore = function () {
        if (this._translate === (-100 * (this._items.length - 1))) {
            return false;
        }
        return true;
    };

    /**
     * Return true if there are more photos (to the "left") to use with
     * Slide.prev
     *
     * @return bool
     */
    Slide.prototype.hasLess = function () {
        if (this._translate === 0) {
            return false;
        }
        return true;
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
        if (this.options.loop) {
            return;
        }
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
    };

    /**
     * jQuery plugin function to initialize any Slide interface provided.
     *
     * @param {object} options User options for new slide interface
     * @return {selector}
     */
    $.fn.slide = function (options) {

        options = options || {};

        return this.each(function () {
            var slide = $(this).data('slide');
            if (!slide) {
                slide = new Slide(this, options);
                $(this).data('slide', slide);
            }

        });

    };

    return Slide;

}));
