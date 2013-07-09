/*global QUnit:false, module:false, test:false, asyncTest:false*/
/*global expect:false, start:false, stop:false ok:false, equal:false*/
/*global notEqual:false, deepEqual:false, notDeepEqual:false*/
/*global strictEqual:false, notStrictEqual:false, raises:false*/

(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

    module('jQuery#hatchling-slide', {
        setup: function() {
            this.elems = $('.hatchling-slide');
        }
    });

    test('Setup up test', function () {
        ok($.fn.slide, 'Slide plugin exists');
        ok(window.Slide, 'Slide wrapper exists');
    });

    test('Ensure settings are working', function () {
        var slider = new window.Slide(this.elems.first(), {
                'loop': false
            });
        equal(slider.options.loop, false, 'Loop set');
    });

    // @TODO add test
    // test('Ensure correct sizes of responsive elements', function () {
    //     var slider = new window.Slide(this.elems.first(), {
    //             'loop': false
    //         });
    //     var $element_list = this.elems.first().find('hls-items');
    //     var $single_slide = $element_list.first().find('hls-item').first();
    //     window.console.log($element_list);
    //     equal($element_list.css('width'), '300%', 'Width list sized correctly');
    //     equal($single_slide.css('width'), '33.333%', 'Element list correctly');
    // });

    test('Ensure new slide provided has correct class', function () {
        var slider = new window.Slide({
                'onchange': function () { return 'Changed'; }
            });
        var new_current = $('#slide2');
        var other_slides = $('.hls-item:not(#slide2)');
        slider.setCurrent(new_current);
        equal(new_current.hasClass('state-current'), true,
              'Current state has been added');
        equal(new_current.hasClass('state-hide'), false,
              'Current state has been added');
        // Check for current class on any others
        // @TODO fix this
        // for (var i = other_slides.length - 1; i >= 0; i--) {
        //     var slide = $(other_slides[i]);
        //     equal(slide.hasClass('state-current'), false,
        //           'Current state has been added');
        // }
    });

}(jQuery));
