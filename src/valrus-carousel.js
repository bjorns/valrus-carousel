(function() {
	/**
	 * State is the current state of the animation of the carousel.
	 */
	function State(carousel) {
		this.progress = 0;
		this.currentFrame = 0;
		this.frameSwitchId = -1;
	}

	/**
	 * Settings object contain static settings for a particular 
	 * carousel, speed, size etc.
	 */
	function Settings(carousel) {
		var defaults = {
			switchPause: 5000, // millisecs between switch
			frameWidth: 512, // pixels
			frameHeight: 255, // pixels
			speed: 12 // pixels/16 millisecs
		};

		function setting(carousel, name, defaultValue) {
			element = carousel.getElementsByClassName(name)[0];
			if (element != undefined) {
				value = element.innerHTML;
				ret = parseInt(value, 10);
				if (ret == NaN) {
					return defaultValue;
				}
			} else {
				return defaultValue;
			}
			return ret;
		}

		this.frameWidth = setting(carousel, 'frameWidth', defaults.frameWidth);
		this.frameHeight = setting(carousel, 'frameHeight', defaults.frameHeight);
		this.switchPause = setting(carousel, 'switchPause', defaults.switchPause);
		this.speed = setting(carousel, 'speed', defaults.speed);
	}

	/**
	 * In order to not have to animate back to the front we clone the first image
	 * to the back of the list. This way we can animate to the end and then 
	 * switch right back to the beginning.
	 */
	function cloneFirstImage(canvas, settings) {
		var images = canvas.getElementsByClassName('image');

		for (var i = 0; i < images.length; ++i) {
			image = images[i];
			image.id = "image" + i;
			image.getElementsByTagName('img')[0].height = settings.frameHeight;
			image.getElementsByTagName('img')[0].width = settings.frameWidth;
			
			image.style.height = "" + settings.frameHeight + "px";
			image.style.left = "" + i*settings.frameWidth + "px";
		}


		// Copy first node to back
		if (images.length > 0) {
			clone = images[0].cloneNode(true);
			clone.style.left = "" + (images.length*settings.frameWidth) + "px";	
			canvas.style.width = "" + settings.frameWidth * (images.length + 1) + "px";
			canvas.appendChild(clone);
		}
	}

	/**
	 * Starts the carousel timers.
	 * 
	 * carousel :: Dom node, div.valrus-carusel.
	 * state    :: CarouselState
	 * settings :: Settings
	 */
	function animate(canvas, state, settings) {

		function shouldStopAnimation(state) {
			return state.progress == (state.currentFrame + 1)*settings.frameWidth;
		}

		function switchFrame() {
			state.progress = Math.min(state.progress + settings.speed, (state.currentFrame + 1)*settings.frameWidth);
			canvas.style.marginLeft = "-" + state.progress + "px";


			if (shouldStopAnimation(state)) {
				window.clearInterval(state.frameSwitchId);
				
				size = canvas.getElementsByClassName('image').length;
				++state.currentFrame;
				if (state.currentFrame == size - 1) {
					state.currentFrame = 0;
					state.progress = 0;
				}
			}
		}
		
		function startSwitchFrame() {
			interval = 1000 / 60;
			state.frameSwitchId = window.setInterval(switchFrame, interval);
		}

		
		window.setInterval(startSwitchFrame, settings.switchPause);
		console.log("Started animation for " + carousel.id);
	}


	/**
	 * Starts the carousel.
	 * 
	 * carousel :: Dom node, div.valrus-carusel.
	 * settings :: Settings
	 */
	function bootCarousel(carousel, settings) {
		carousel.style.width = "" + settings.frameWidth + "px";
		carousel.style.height = "" + settings.frameHeight + "px";

		canvas = carousel.getElementsByClassName('canvas')[0];
		canvas.style.marginLeft = "0px";
		canvas.style.height = "" + settings.frameHeight + "px";

		cloneFirstImage(canvas, settings);

		var state = new State(carousel);
		animate(canvas, state, settings);
	}

	function main() {
		carousels =	document.getElementsByClassName('valrus-carousel');
		for (var i = 0; i < carousels.length; ++i) {
			carousel = carousels[i];
			carousel.id = "carousel" + i;
			console.log("Found carousel [" + i + "/" + carousels.length + "]: " + carousel.id);
			settings = new Settings(carousel);
			bootCarousel(carousel, settings);
		}
	}

	main();
})();
