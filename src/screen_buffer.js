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

	var doubleBuffer = createDoubleBuffer(settings);
	carousel.appendChild(doubleBuffer);
	this.scratch = doubleBuffer.getContext('2d');

}

valrus.ScreenBuffer.prototype.renderNavigateLeft = function(state) {
	if (state.showLeftNavigation()) {
		this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
		this.context.beginPath();
		this.context.rect(0, 0, this.settings.width/6.0, this.settings.height);
		this.context.fill();
	}
};

valrus.ScreenBuffer.prototype.renderNavigateRight = function(state) {
	if (state.showRightNavigation()) {
		this.context.fillStyle = "rgba(0, 0, 0, 0.3)";
		this.context.beginPath();
		this.context.rect(settings.width*(1-1/6.0), 0, this.settings.width, this.settings.height);
		this.context.fill();
	}
};