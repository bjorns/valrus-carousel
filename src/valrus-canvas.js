var valrus = valrus || {};

valrus.initCarousel = function(carousel, settings) {
	carousel.style.width = "" + settings.frameWidth + "px";
	carousel.style.height = "" + settings.frameHeight + "px";
	carousel.getElementsByClassName("images")[0].style.display = "none";


	var screenBuffer = new valrus.ScreenBuffer(carousel, settings);
	var state = new valrus.State(carousel, settings);

	state.images[0].onload = function() {
		screenBuffer.context.drawImage(state.currentImage(), 0, 0, settings.width, settings.height);		
	}

	valrus.animate(settings, state, screenBuffer);
}

valrus.init = function() {
	carousels =	document.getElementsByClassName('valrus-carousel');
	for (var i = 0; i < carousels.length; ++i) {
		carousel = carousels[i];
		carousel.id = "carousel" + i;
		console.log("Found carousel [" + i + "/" + carousels.length + "]: " + carousel.id);
		settings = new valrus.Settings(carousel);
		valrus.initCarousel(carousel, settings);
	}
}

valrus.init();