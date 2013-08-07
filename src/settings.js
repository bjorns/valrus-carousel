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
		speed: 8, // pixels/16 millisecs
		blend: valrus.blend.scroll
	};

	function stringSetting(carousel, name, defaultValue) {
		element = carousel.getElementsByClassName(name)[0];
		if (element != undefined) {
			value = element.innerHTML;
			return value.toString();
		} else {
			console.log("error: Failed to locate settings div with class '" + name + 
				"', returning default value " + defaultValue);
			return defaultValue.toString();
		}
	}

	function intSetting(carousel, name, defaultValue) {
		value = stringSetting(carousel, name, defaultValue);
		ret = parseInt(value, 10);
		if (ret == NaN) {
			console.log("error: Expected parameter " + name + 
            	" to be a number, using default value: " + defaultValue);
			return defaultValue;
		}
		return ret;
	}

	function blendFunction(name) {
		for (f in valrus.blend) {
			if (f === name) {
				console.log("Using blend function " + f);
				return window['valrus']['blend'][f];
			}
		}
		console.log("Missing defined blend function, defaulting to scroll");
		return defaults.blend;
	}

	this.width = intSetting(carousel, 'width', defaults.width);
	this.height = intSetting(carousel, 'height', defaults.height);
	this.switchPause = intSetting(carousel, 'switchPause', defaults.switchPause);
	this.speed = intSetting(carousel, 'speed', defaults.speed);
	this.blend = blendFunction(stringSetting(carousel, 'blend', 'unknown'));
};
