(function() {
	/**
	 * Settings object contain static settings for a particular 
	 * carousel, speed, size etc.
	 *
	 * progress :: float between 0 and 100.0 indicating blend 
	 *             between current frame and next.
	 */
	function Settings(carousel) {
		var defaults = {
			switchPause: 5000, // millisecs between switch
			width: 512, // pixels
			height: 255, // pixels
			speed: 8 // pixels/16 millisecs
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

		function images(images) {
			ret = [];
			for (var i = 0; i < images.length; ++i) {
				imageDiv = images[i].getElementsByTagName('img')[0];
				// TODO: This might not be necessary.
				image = new Image();
				image.src = imageDiv.src;
				ret.push(image);
			}
			return ret;
		}

		this.width = setting(carousel, 'width', defaults.width);
		this.height = setting(carousel, 'height', defaults.height);
		this.switchPause = setting(carousel, 'switchPause', defaults.switchPause);
		this.speed = setting(carousel, 'speed', defaults.speed);
		this.images = images(carousel.getElementsByClassName('image'));

	}

	function State(carousel) {
		this.currentFrame = 0;
		this.progress = 0.0;
		this.i = 0; // frameIndex
		this.frameSwitchId = -1;
	}

	function Canvas(carousel, settings) {
		this.settings = settings;
		var canvas = document.createElement('canvas');
		this.id = "canvas_" + carousel.id;
		canvas.id = this.id;
		canvas.width = settings.width;
		canvas.height = settings.height;
		carousel.appendChild(canvas);
		this.context = canvas.getContext("2d");

		this.image = function(url) {
			var self = this;
			var imageObj = new Image();
		    imageObj.onload = function() {
    			self.context.drawImage(imageObj, 0, 0, settings.width, settings.height);
			};
			imageObj.src = url;
		}
	}

	function animate(canvas, state, settings) {
		var blend = scroll;

		function scroll(image0, image1, progress) {
			
			x = progress*settings.width/100.0;

			canvas.context.drawImage(image0, -x, 0, settings.width, settings.height);
			canvas.context.drawImage(image1, settings.width - x, 0, settings.width, settings.height);
		}

		function nextFrame(state, settings) {
			return (state.currentFrame + 1) % settings.images.length;
		}

		function updateProgress(state, settings) {
			g = settings.speed/300;

			M = 0.0012;
			drag = Math.max(M*(-85+state.progress), 0);
			acc = g - drag;
			speed = Math.min(settings.speed, acc*state.i);
			return Math.min(state.progress + speed, 100.0);

		}

		function switchFrame() {
			state.progress = updateProgress(state, settings);
			blend(settings.images[state.currentFrame], settings.images[nextFrame(state, settings)], state.progress)

			if (state.progress >= 100.0) {
				window.clearInterval(state.frameSwitchId);
				state.currentFrame  = nextFrame(state, settings);
				state.progress = 0.0;
			}
			++state.i;
		}

		function startSwitchFrame() {
			interval = 1000 / 60;
			state.i = 0;
			state.frameSwitchId = window.setInterval(switchFrame, interval);
		}

		window.setInterval(startSwitchFrame, settings.switchPause);
		console.log("Started animation for " + carousel.id);
	}

	function bootCarousel(carousel, settings) {
		carousel.style.width = "" + settings.frameWidth + "px";
		carousel.style.height = "" + settings.frameHeight + "px";
		carousel.getElementsByClassName("images")[0].style.display = "none";


		var canvas = new Canvas(carousel, settings);
		canvas.image(settings.images[0].src);

		var state = new State(carousel);

		animate(canvas, state, settings)
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