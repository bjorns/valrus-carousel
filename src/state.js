"use strict";
/**
 * State is the current state of the carousel. 
 * On instance is created for each carousel.
 *
 */
valrus.State = function(carousel, settings) {

	this.currentFrame = 0;
	this.progress = 0.0;
	this.i = 0;
	
	this.switchTimerId = -1;
	this.animationTimerId = -1;
	this.switchInProgress = false;
	this.direction = this.Direction.RIGHT;

	function images(images) {
		var ret = [];
		for (var i = 0; i < images.length; ++i) {
			var imageDiv = images[i].getElementsByTagName('img')[0];
			// TODO: This might not be necessary.
			ret.push(imageDiv);
		}
		return ret;
	}

	this.images = images(carousel.getElementsByClassName('image'));


	this.lastMouse = new valrus.geometry.Point(-1, -1);
	this.leftNavigationArea = new valrus.geometry.Rect(0, 0, settings.width/6.0, settings.height);
	this.rightNavigationArea = new valrus.geometry.Rect(settings.width - settings.width/6.0, 0, settings.width, settings.height);

	this.tempSource = null;
};

valrus.State.prototype.Direction = { LEFT: 0, RIGHT: 1 };

valrus.State.prototype.showLeftNavigation = function() {
	return this.leftNavigationArea.contains(this.lastMouse);
};

valrus.State.prototype.showRightNavigation = function() {
	return this.rightNavigationArea.contains(this.lastMouse);
};

/**
 * Returns true if the screen needs to be redrawn because a naviagtion area has changed.
 */
valrus.State.prototype.updateMouse = function(x, y) {
	var mouse = new valrus.geometry.Point(x, y);
	var leftNavChanged = this.leftNavigationArea.contains(mouse) != this.showLeftNavigation();
	var rightNavChanged = this.rightNavigationArea.contains(mouse) != this.showRightNavigation();
	var ret = (leftNavChanged || rightNavChanged) && !this.switchInProgress;
	this.lastMouse = mouse;
	return ret;
};

/**
 * Img element of the image currently displayed. 
 *
 * Returns the same object while fading out, until the next image is fully visible.
 */
valrus.State.prototype.currentImage = function () {
	return this.images[this.currentFrame];
};


valrus.State.prototype.incFrame = function (dir) {
	return (dir == this.Direction.RIGHT) ? 
		((this.currentFrame + 1) % this.images.length) : 
		((this.currentFrame + this.images.length - 1) % this.images.length);
};

/**
 * Integer indicating the index of the next image in the list.
 */
valrus.State.prototype.nextFrame = function () {
	return this.incFrame(this.direction);
};

valrus.State.prototype.previousFrame = function () {
	function reverse(dir) {
		return (dir + 1) % 2;
	}
	return this.incFrame(reverse(this.direction));
};

/**
 * img element of the next image to be displayed.
 */
valrus.State.prototype.nextImage = function () {
	return this.images[this.nextFrame()];
};

valrus.State.prototype.previousImage = function () {
	return this.images[this.previousFrame()];
};

valrus.State.prototype.sourceImage = function () {
	if (this.tempSource !== null) {
		return this.tempSource;
	}
	return this.previousImage();
};

valrus.State.prototype.setSourceImage = function(img) {
	this.tempSource = img;
};

valrus.State.prototype.targetImage = function () {
	return this.currentImage();
};