var valrus = valrus || {};

/**
 * ScreenBuffer represents canvas object and it's scratch buffer.
 * 
 */
valrus.ScreenBuffer = function(carousel, settings) {
	function createCanvas(settings) {
		canvas = document.createElement('canvas');
		canvas.width = settings.width;
		canvas.height = settings.height;
		return canvas;
	}

	function createDoubleBuffer(settings) {
		canvas = createCanvas(settings);
		canvas.style.display = 'none';
		return canvas;
	}

	this.settings = settings;
	this.canvas = createCanvas(settings);
	this.id = "canvas_" + carousel.id;
	this.canvas.id = this.id;
	carousel.appendChild(this.canvas);
	this.context = canvas.getContext("2d");

	this.doubleBuffer = createDoubleBuffer(settings);
	carousel.appendChild(this.doubleBuffer);
	this.scratch = this.doubleBuffer.getContext('2d');

}

valrus.ScreenBuffer.prototype.shade = function(x0,y0,x1,y1, p) {
	this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
	this.context.beginPath();
	this.context.rect(x0,y0, x1, y1);
	this.context.fill();
}

valrus.ScreenBuffer.prototype.renderNavigateLeft = function(state) {
	if (state.showLeftNavigation()) {
		this.shade(0, 0, this.settings.width/6.0, this.settings.height)
	}
};

valrus.ScreenBuffer.prototype.renderNavigateRight = function(state) {
	if (state.showRightNavigation()) {
		this.shade(settings.width*(1-1/6.0), 0, this.settings.width, this.settings.height);
	}
};

/**
 * TODO: This can be cached bu uncertain of need and potential 
 *       gains.
 */
valrus.ScreenBuffer.prototype.imageData = function(image) {
	this.scratch.drawImage(image, 0, 0, this.settings.width, this.settings.height);
	return this.scratch.getImageData(0, 0, this.settings.width, this.settings.height);
}
