"use strict";
var valrus = valrus || {};

valrus.initCarousel = function(carousel, settings) {
	carousel.style.width = "" + settings.frameWidth + "px";
	carousel.style.height = "" + settings.frameHeight + "px";
	
	var images = carousel.getElementsByTagName("img");
	for (var i = 0; i < images.length; ++i) {
		var image = images[i];
		image.style.display = "none";
	}


	var screenBuffer = new valrus.ScreenBuffer(carousel, settings);
	var state = new valrus.State(carousel, settings);

	
	screenBuffer.context.drawImage(state.images[0], 0, 0, settings.width, settings.height);		
	screenBuffer.scratch.drawImage(state.images[0], 0, 0, settings.width, settings.height);		
	valrus.animate(settings, state, screenBuffer);
};

valrus.init = function() {
	window.requestAnimationFrame = (function(callback) {
    	return window.requestAnimationFrame || 
    		window.webkitRequestAnimationFrame || 
    		window.mozRequestAnimationFrame || 
    		window.oRequestAnimationFrame || 
    		window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	var carousels = document.getElementsByClassName('valrus-carousel');
	for (var i = 0; i < carousels.length; ++i) {
		var carousel = carousels[i];
		carousel.id = "carousel" + i;
		console.log("Found carousel [" + i + "/" + carousels.length + "]: " + carousel.id);
		var settings = new valrus.Settings(carousel);
		valrus.initCarousel(carousel, settings);
	}
};

if (window.onload !== null && window.onload !== undefined) {
	var oldOnLoad = window.onload;
	window.onload = function() {
		valrus.init();
		oldOnLoad();
	};
} else {
	window.onload = valrus.init;
}
