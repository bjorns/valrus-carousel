"use strict";

var valrus = valrus || {};

/**
 * ScreenBuffer represents canvas object and it's scratch buffer.
 * 
 */
valrus.ScreenBuffer = function(carousel, settings) {
	function invisible(e) {
		e.style.display = 'none';
		return e;
	}

	function createCanvas(settings) {
		var canvas = document.createElement('canvas');
		canvas.width = settings.width;
		canvas.height = settings.height;
		return canvas;
	}

	function highDef(canvas, context) {
		if (window.devicePixelRatio) {
			var defaultWidth = canvas.width;
			var defaultHeight = canvas.height;
			var cssWidth = defaultWidth;
			var cssHeight = defaultHeight;

			canvas.style.width = cssWidth.toString() + "px";
			canvas.style.height = cssHeight.toString() + "px";

			canvas.width = defaultWidth * window.devicePixelRatio;
			canvas.height = defaultHeight * window.devicePixelRatio;
			context.scale(window.devicePixelRatio, window.devicePixelRatio);             
		}
	}

	this.width = settings.width;
	this.height = settings.height;

	this.canvas = createCanvas(settings);
	this.id = "canvas_" + carousel.id;
	this.canvas.id = this.id;
	this.canvas.className = 'blend';
	carousel.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
	highDef(this.canvas, this.context);

	this.overlayCanvas = createCanvas(settings);
	this.overlayCanvas.className = 'overlay';
	carousel.appendChild(this.overlayCanvas);
	this.overlay = this.overlayCanvas.getContext('2d');
	highDef(this.overlayCanvas, this.overlay);
	/**
	 * TODO: Try to remove...
	 */
	this.scratchCanvas = invisible(createCanvas(settings));
	carousel.appendChild(this.scratchCanvas);
	this.scratch = this.scratchCanvas.getContext('2d');
	highDef(this.scratchCanvas, this.scratch);
};

/**
 * Render all gui elements on an overlay canvas not to mess up the
 * blend functions.
 */
valrus.ScreenBuffer.prototype.shade = function(x0,y0,x1,y1, p) {
	this.overlay.fillStyle = "rgba(0, 0, 0, 0.5)";
	this.overlay.beginPath();
	this.overlay.rect(x0,y0, x1, y1);
	this.overlay.fill();
};

valrus.ScreenBuffer.prototype.clear = function(x0,y0,x1,y1, p) {
	this.overlay.clearRect(x0,y0, x1, y1);
};

valrus.ScreenBuffer.prototype.renderNavigateLeft = function(state) {
	this.clear(0, 0, this.width/5.9, this.height);
	if (state.showLeftNavigation()) {
		this.shade(0, 0, this.width/6.0, this.height);
	}
};

valrus.ScreenBuffer.prototype.renderNavigateRight = function(state) {
	this.clear(this.width*(1-1/5.9), 0, this.width, this.height);
	if (state.showRightNavigation()) {
		this.shade(this.width*(1-1/6.0), 0, this.width, this.height);
	}
};

/**
 * TODO: This can be cached bu uncertain of need and potential 
 *       gains.
 */
valrus.ScreenBuffer.prototype.imageData = function(image) {
	this.scratch.drawImage(image, 0, 0, this.width, this.height);
	return this.scratch.getImageData(0, 0, this.width, this.height);
};

valrus.ScreenBuffer.prototype.screenBuffer = function() {
	return this.context.getImageData(0,0, this.width, this.height);
};

valrus.ScreenBuffer.prototype.screenImage = function() {
	var image = new Image();
	image.src = this.canvas.toDataURL("image/png");
	return image;
};

