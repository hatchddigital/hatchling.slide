# Hatchling Slide

A responsive aware slide user interface for carousel and gallery like navigation.

Hatchling Slide allows for carousel functionality aimed specifically at
Responsive Web Design (RED) front end. We've taken a look at the requirements
for a standard slider and made changes to deal with a the support of
responsive wrapper widths and made our code require as little JavaScript as
required.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/hatchddigital/hatchling.slide/master/dist/hatchling.slide.min.js
[max]: https://raw.github.com/hatchddigital/hatchling.slide/master/dist/hatchling.slide.js

In your web page:

```html
<script src="libs/jquery/jquery.js"></script>
<script src="dist/hatchling.slide.min.js"></script>
<script>
$(document).ready(function() {
    $('.hatchling-slide').slide({'loop': true});
});
</script>
```

## Documentation

Installation required somewhat specific HTML markup + a simple JS call.

### HTML

The markup is made up of two simple pieces. Inside a parent wrapper you only require each slideable element to be given a class hls-item and your controls to have the classes hls-prev and hls-next for the next and previous buttons.

Each item can be any element such as an HTML block or an Image.

```html
<div class="hatchling-slide">
    <div class="hls-viewslit">
        <ul class="hls-items">
            <li class="hls-item state-current">
                <img src="image.jpg" />
            </li>
            <li class="hls-item">
                <img src="image-2.jpg" />
            </li>
            <li class="hls-item">
                <img src="image-2.jpg" />
            </li>
        <ul class="controls">
            <li class="hls-control hls-prev">
                Previous Slide
            </li>
            <li class="hls-control hls-next">
                Next Slide
            </li>
        </ul>
    </div>
</div>
```

Special classes: state-current can be used to set the showing row when the page is initially loaded. By default the first row will be set to state-current, when nothing is provided.

### JavaScript

All you are required to do is attach the jQuery plugin `$('.hatchling-slide').slide();` to the parent element of your markup.

## Release History
- v1.1.1 Added new package support and updated documentation
- v1.1 Responsive rewrite with Grunt JS support for development workflow.
- v1.0 Initial release with working navigation. No responsive support.
