"use strict";
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
		switchInterval: 5000, // millisecs between switch
		width: 512, // pixels
		height: 255, // pixels
		speed: 8, // pixels/16 millisecs
		blend: valrus.blend.scroll
	};

	function stringSetting(carousel, name, defaultValue) {
		var value = carousel.dataset[name];
		if (value != undefined) {
			return value;
		} else {
			console.log("warning: Failed to locate data attribute 'data-" + name + 
				"', returning default value " + defaultValue);
			return defaultValue.toString();
		}
	}

	function intSetting(carousel, name, defaultValue) {
		var value = stringSetting(carousel, name, defaultValue);
		var ret = parseInt(value, 10);
		if (ret == NaN) {
			console.log("error: Expected parameter " + name + 
            	" to be a number, using default value: " + defaultValue);
			return defaultValue;
		}
		return ret;
	}

	function blendFunction(name) {
		for (var f in valrus.blend) {
			if (f === name) {
				console.log("Using blend function " + f);
				return window['valrus']['blend'][f];
			}
		}
		console.log("warning: Missing defined blend function, defaulting to scroll");
		return defaults.blend;
	}

	var requestedWidth = intSetting(carousel, 'width', defaults.width)
	var requestedHeight = intSetting(carousel, 'height', defaults.height);

	var ratio = requestedHeight / requestedWidth;

	this.width = Math.min(requestedWidth, carousel.parentNode.clientWidth);
	this.height = this.width * ratio;
	this.switchInterval = intSetting(carousel, 'switchInterval', defaults.switchInterval);
	this.speed = intSetting(carousel, 'speed', defaults.speed);
	this.blend = blendFunction(stringSetting(carousel, 'blend', 'unknown'));
};
