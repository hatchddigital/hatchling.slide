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
 * IMPORTS
 * @import hatchdlings.module.js
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
 * HATCHDLING UNE CARTE MODULE
 *
 * This code builds a "sliding" bar for use on desktop and touch devices
 * when hiding content and sliding through it.
 *
 * @author Jimmy Hillis <jimmy@hatchd.com.au>
 * @see http://hatchd.com.au
 *
 */

;(function() {

    var DATA_PROP = 'hl-slide'
      , STATE_CURRENT = 'state-current'
      , STATE_INACTIVE = 'state-inactive'
      , STATE_HIDDEN = 'hide'
      , LINK = 'hls-link'
      , ITEM = 'hls-item'
      , NEXT = 'hls-next'
      , PREV = 'hls-prev';

    /**
     * Attaches our Facilities Google Map to an element in the DOM
     * and puts the default markers into the system ready for dealing
     * with moving around the page
     */
    var Slide = function (element, visible, options)  {

        var slide = this;

        this.$element = $(element);
        this.visible = visible || false;
        this.items = this.$element.find('.'+ITEM);
        this.links = this.$element.find('.'+LINK);
        this.panel_width = this.$element.outerWidth();

        // Set and override default options from user
        this.options = $.extend({
            'loop': false
        }, options);

        // Initialize default sizes and areas
        var gallery_width = this.items.length * this.locs().width
          , visible_width = this.visible * this.locs().width
          , default_wrap_styles = {

          }
          , default_inner_styles = {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'display': 'block',
                'width': gallery_width + 'px',
                'background': 'blue'
            };

        // Set all items to be hidden, if the markup doesn't and then
        // set a single visible one to be current.
        if (!(this.current = this.items.find(STATE_CURRENT)).length) {
            this.current = this.items.first();
            this.current.addClass(STATE_CURRENT);
        }
        this.items.not('.'+STATE_CURRENT).addClass(STATE_HIDDEN);

        this.refresh_state();

        return this;
    };

    Slide.prototype.locs = function () {
        var slide = this;
        return {
            'before': (function () {
                return 0;
            }()),
            'after': (function () {
                return 0;
            }),
            'width': (function () {
                var width = slide.items.first().outerWidth();
                return width;
            }())
        };
    };

    /**
     * Moves the slider to reveal the previous n element's
     */
    Slide.prototype.prev = function (n) {
        var item = this.locs()
          , prev = this.current.prev('.'+ITEM)
          , reverse = false;
        if (!prev.length && this.options.loop) {
            reverse = true;
            prev = this.items.last();
        }
        if (!prev.length) {
            return false;
        }
        this.swap(prev, reverse);
    };

    /**
     * Moves the slider to reveal the next n element's
     */
    Slide.prototype.next = function (n) {
        var item = this.locs()
          , next = this.current.next('.'+ITEM)
          , reverse = false;
        if (!next.length && this.options.loop) {
            reverse = true;
            next = this.items.first();
        }
        if (!next.length) {
            return false;
        }
        this.swap(next, reverse);
    };

    /**
     * Moves the slider to reveal the next n element's
     */
    Slide.prototype.swap = function (panel, reverse) {

        var slide = this
          , direction = 1;
        reverse = (reverse) ? -1 : 1;

        if (slide.current[0] === panel[0]) {
            return false;
        }

        // Direction
        for (var x = (slide.items.length - 1); x; x--) {
            if (slide.items[x] == slide.current[0]) {
                break;
            }
            if (slide.items[x] == panel[0]) {
                direction = -1;
                break;
            }
        }

        direction = direction * reverse;

        // Set the "new" slide to the right starting position
        panel.css({'left': slide.panel_width * (-direction)});

        // Slide the "current" slide out of the view
        slide.current.animate({'left': slide.panel_width * direction}, function () {
            $(slide).css('left', '');
        });

        // Slide the "new" slide into view
        panel.animate({'left': 0}, function () {
            $(slide).css({'left': ''});
            slide.current.removeClass(STATE_CURRENT).addClass(STATE_HIDDEN);
            panel.removeClass(STATE_HIDDEN).addClass(STATE_CURRENT);
        });

        slide.current = panel;
        slide.refresh_state();

    };

    /**
     * Refreshes the current state of the control buttons on the slider
     * allowing me to de/activate each control on each change depending on
     * how much slider room is left.
     */
    Slide.prototype.refresh_state = function () {
        var prev = this.$element.find('.'+PREV)
          , next = this.$element.find('.'+NEXT);
        // Set current state for next/previous buttons
        if (!this.current.next('.'+ITEM).length) {
            next.addClass(STATE_INACTIVE);
        }
        else {
            next.removeClass(STATE_INACTIVE);
        }
        if (!this.current.prev('.'+ITEM).length) {
            prev.addClass(STATE_INACTIVE);
        }
        else {
            prev.removeClass(STATE_INACTIVE);
        }
        // Set current link stat
        this.links.parent().removeClass(STATE_CURRENT);
        var current_link = this.$element.find('a[href="#' + this.current.attr('id') + '"]');
        current_link.parent().addClass(STATE_CURRENT);
    };

    /**
     * jQuery plugin attaches map to a specific DOM elements
     */
    $.fn.slide = function (options) {

        options = options || {};

        this.each(function () {
            var $this = $(this)
              , slide = false;

            // If we can't find an existing modal, create a new one
            if (!slide) {
                $this.data(DATA_PROP, (slide =
                    new Slide(this, (options.visible || 3), options)));
            }
            // Events for next, prev, and specific
            $this.find('.'+NEXT).click(function (e) {
                e.preventDefault();
                slide.next();
            });
            $this.find('.'+PREV).click(function (e) {
                e.preventDefault();
                slide.prev();
            });
            slide.links.each(function () {
                $(this).click(function (e) {
                    e.preventDefault();
                    slide.swap($($(this).attr('href')));
                });
            });
        });

        if (this.length === 1) {
            return $(this).data(DATA_PROP);
        }

    };

}(window.jQuery));
