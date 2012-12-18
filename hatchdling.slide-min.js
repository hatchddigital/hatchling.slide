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
 */(function(){var e="hl-slide",t="state-current",n="state-inactive",r="hide",i="hls-link",s="hls-item",o="hls-next",u="hls-prev",a=function(e,n,o){var u=this;this.$element=$(e);this.visible=n||!1;this.items=this.$element.find("."+s);this.links=this.$element.find("."+i);this.panel_width=this.$element.outerWidth();this.itemwrap=this.$element.find(".hls-items");this.options=$.extend({loop:!1},o);var a=this.items.length*this.locs().width,f=this.visible*this.locs().width,l={},c={position:"absolute",top:0,left:0,display:"block",width:a+"px",background:"blue"};if(!(this.current=this.items.find(t)).length){this.current=this.items.first();this.current.addClass(t)}this.items.not("."+t).addClass(r);this.refresh_state();return this};a.prototype.locs=function(){var e=this;return{before:function(){return 0}(),after:function(){return 0},width:function(){var t=e.items.first().outerWidth();return t}()}};a.prototype.prev=function(e){var t=parseInt(this.itemwrap[0].style.marginLeft,10);isNaN(t)&&(t=0);var n=t+100;this.itemwrap.animate({"margin-left":n+"%"})};a.prototype.next=function(e){var t=parseInt(this.itemwrap[0].style.marginLeft,10);isNaN(t)&&(t=0);var n=t-100;this.itemwrap.animate({"margin-left":n+"%"})};a.prototype.swap=function(e,t){var n=this,r=1;t=t?-1:1;if(n.current[0]===e[0])return!1;for(var i=n.items.length-1;i;i--){if(n.items[i]==n.current[0])break;if(n.items[i]==e[0]){r=-1;break}}r*=t};a.prototype.refresh_state=function(){var e=this.$element.find("."+u),r=this.$element.find("."+o);this.current.next("."+s).length?r.removeClass(n):r.addClass(n);this.current.prev("."+s).length?e.removeClass(n):e.addClass(n);this.links.parent().removeClass(t);var i=this.$element.find('a[href="#'+this.current.attr("id")+'"]');i.parent().addClass(t)};$.fn.slide=function(t){t=t||{};this.each(function(){var n=$(this),r=!1;r||n.data(e,r=new a(this,t.visible||3,t));n.find("."+o).click(function(e){e.preventDefault();r.next()});n.find("."+u).click(function(e){e.preventDefault();r.prev()});r.links.each(function(){$(this).click(function(e){e.preventDefault();r.swap($($(this).attr("href")))})})});if(this.length===1)return $(this).data(e)}})(window.jQuery);