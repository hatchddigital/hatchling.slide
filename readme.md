# SLIDE

*A hatchdling jQuery plugin for carousel like functionality*

The Slide Hatchdling allows for simple carousel functionality aimed specifically towards Responsive Web Design. We've taken a look at the requirements for a standard slider to deal with a change in width as much as possible, with as little JavaScript as required.

## USAGE

Installation required somewhat specific HTML markup + a simple JS call.

## HTML

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

## JavaScript

All you are required to do is attach the jQuery plugin $('.slide').slide(); to the parent element of your markup.
