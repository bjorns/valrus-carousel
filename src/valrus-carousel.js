(function() {
	settings = {
		switchPause: 1000, // millisecs between switch
		frameWidth: 512, // pixels
		frameHeight: 255, // pixels
		speed: 12, // pixels/16 millisecs
	};

	function cloneFirstImage(carousel, canvas) {
		images = carousel.getElementsByClassName('image');

		for (i=0; i < images.length; ++i) {
			image = images[i];
			image.id = "image" + i;
			image.img.height = "" + settings.frameHeight;
			image.img.width = "" + settings.frameWidth;
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

	function animate(carousel, canvas) {
		currentFrame = 0;
		progress = 0;
		frameSwitchId = -1;

		var shouldStopAnimation = function() {
			return progress == (currentFrame + 1)*settings.frameWidth;
		}

		var switchFrame = function() {
			progress = Math.min(progress + settings.speed, (currentFrame + 1)*settings.frameWidth);
			canvas.style.marginLeft = "-" + progress + "px";


			if (shouldStopAnimation()) {
				window.clearInterval(frameSwitchId);
				
				size = canvas.getElementsByClassName('image').length;
				++currentFrame;
				if (currentFrame == size - 1) {
					currentFrame = 0;
					progress = 0;
				}

				waitForAnimation();
			}
		}
		
		var startSwitchFrame = function() {
			interval = 1000 / 60;
			frameSwitchId = window.setInterval(switchFrame, interval);
		}

		var waitForAnimation = function() {
			console.log("Current frame: " + currentFrame);
			window.setTimeout(startSwitchFrame, settings.switchPause);
		}

		console.log("Starting animation for " + carousel);
		waitForAnimation(carousel);
	}

	function setting(carousel, name, defaultValue) {
		element = carousel.getElementsByClassName(name)[0];
		if (element != undefined) {
			value = element.innerHTML;
			ret = parseInt(value);
			if (ret == NaN) {
				return defaultValue;
			}
		} else {
			return defaultValue;
		}
		return ret;
	}

	function readSettings(carousel) {
		settings.frameWidth = setting(carousel, 'frameWidth', settings.frameWidth);
		settings.frameHeight = setting(carousel, 'frameHeight', settings.frameHeight);
		settings.switchPause = setting(carousel, 'switchPause', settings.switchPause);
		settings.speed = setting(carousel, 'speed', settings.speed);

		return settings;
	}

	function bootCarousel(carousel) {
		settings = readSettings(carousel);
		carousel.style.width = "" + settings.frameWidth + "px";
		carousel.style.height = "" + settings.frameHeight + "px";

		canvas = carousel.getElementsByClassName('canvas')[0];
		canvas.style.marginLeft = "0px";
		canvas.style.height = "" + settings.frameHeight + "px";

		cloneFirstImage(carousel, canvas);

		animate(carousel, canvas);
	}

	function main() {
		carousels =	document.getElementsByClassName('valrus-carousel')
		for (i = 0; i < carousels.length; ++i) {
			carousel = carousels[i];
			carousel.id = "carousel" + i;
			console.log("Found carousel: " + carousel);
			bootCarousel(carousel);
		}
	}

	main();
})();
