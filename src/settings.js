var valrus = valrus || {};

/**
 * Settings object contain static settings for a particular 
 * carousel, speed, size etc.
 *
 * carousel :: A div node with class 'valrus-carousel'
 *
 * progress :: float between 0 and 100.0 indicating blend 
 *             between current frame and next.
 */
valrus.Settings = function(carousel) {
	var defaults = {
		switchPause: 5000, // millisecs between switch
		width: 512, // pixels
		height: 255, // pixels
		speed: 8 // pixels/16 millisecs
	};

	function setting(carousel, name, defaultValue) {
		// TODO: Check for settings div as well.
		element = carousel.getElementsByClassName(name)[0];
		if (element != undefined) {
			value = element.innerHTML;
			ret = parseInt(value, 10);
			if (ret == NaN) {
				console.log("error: Expected parameter " + name + 
					" to be a number, using default value: " + defaultValue);
				return defaultValue;
			}
		} else {
			console.log("error: Failed to locate settings div with class '" + name + 
				"', returning default value " + defaultValue);
			return defaultValue;
		}
		return ret;
	}

	this.width = setting(carousel, 'width', defaults.width);
	this.height = setting(carousel, 'height', defaults.height);
	this.switchPause = setting(carousel, 'switchPause', defaults.switchPause);
	this.speed = setting(carousel, 'speed', defaults.speed);
};
