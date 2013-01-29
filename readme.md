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

    .slide
            ul.items
                    li.hls-item.state-current
                            img
                    li.hls-item
                            img
                    li.hls-item
                            img
            ul.controls
                    li.hls-prev Previous!
                    li.hls-next Next!

Special classes: state-current can be used to set the showing row when the page is initially loaded. By default the first row will be set to state-current, when nothing is provided.

### JavaScript

All you are required to do is attach the jQuery plugin `$('.hatchling-slide').slide();` to the parent element of your markup.

## Release History
- v1.1 Responsive rewrite with Grunt JS support for development workflow.
- v1.0 Initial release with working navigation. No responsive support.
