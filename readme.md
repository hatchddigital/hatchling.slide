# Slide

A responsive slide user interface for carousel and gallery like navigation.

This *hatchling* slide allows for functionality aimed specifically at
Responsive Web Design (RWD) websites. We've taken a look at the requirements
for a standard slider and built this tool to support changing responsive wrapper
widths with as little JavaScript as required.

We're using modern CSS3 transform tools with fallbacks for all browsers back
to IE7 (with degration).

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/hatchddigital/hatchling.slide/master/dist/slide.min.js
[min]: https://raw.github.com/hatchddigital/hatchling.slide/master/src/slide.js

In your web page:

```html
<script src="libs/jquery/jquery.js"></script>
<script src="dist/slide.min.js"></script>
<script src="dist/slide.css"></script>
<script>
$(document).ready(function() {
    $('.slide').slide({ 'loop': true });
});
</script>
```

## Usage

To have this work on your site we require specific CSS and markup requirements
to get all the pieces in place. We don't want you to be forced to use our
setup so this is a guide, we just need to you to have the same classes
somewhere in your code.

### HTML

The markup requires that everything is wrapped within a parent element so
that we can find the correct slides and controls for this specific tool. This
ensures we can have multiple slides on any given page.

Each item can be made up of any element you'd like. Images, lists, videos
or all of the above.

The controls are completely optional, though it would be strange to have a
slider with no controls!

```html
<div class="slide">
    <ul class="slide-items">
        <li id="slide=-1" class="slide-item state-current">
            <img src="image.jpg" />
        </li>
        <li id="slide=-2" class="slide-item">
            <img src="image-2.jpg" />
        </li>
        <li id="slide=-3" class="slide-item">
            <img src="image-2.jpg" />
        </li>
    </ul>
    <ul class="controls">
        <li class="slide-control slide-prev">
            Previous Slide
        </li>
        <li class="slide-control">
            <a href="#slide-1" class="slide-select">First</a>
        </li>
        <li class="slide-control">
            <a href="#slide-2" class="slide-select">Second</a>
        </li>
        <li class="slide-control">
            <a href="#slide-3" class="slide-select">Third</a>
        </li>
        <li class="slide-control slide-next">
            Next Slide
        </li>
    </ul>
</div>
```

Special classes: state-current can be used to set the showing row when the
page is initially loaded. By default the first row will be set to
`state-current`, when nothing is provided.

### JavaScript

All you are required to do is attach the jQuery plugin
`$('.slide').slide();` to the parent element of your markup.

## Release History
- v0.2.4 Fix bug relating to default behaviour for responsive breakpoints.
- v0.2.3 Fix bug relating to the state of pagination after slide events
- v0.2.1 Added support for grouping (manually or through pixel/breakpoint sizes)
- v0.2.0 Added transform support, removing all jQuery animation with fallbacks
- v0.1.1 Added new package support and updated documentation
- v0.1.0 Responsive rewrite with Grunt JS support for development workflow.
- v0.0.0 Initial release with working navigation. No responsive support.
