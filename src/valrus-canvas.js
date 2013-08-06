(function() {
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	Point.prototype.toString = function() {
		return "[" + this.x + ":" + this.y + "]";
	};

	function Rect(x0,y0, x1,y1) {
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;
	}

	/**
	 * Note: only works for positive rects.
	 */
	Rect.prototype.contains = function(point) {
		return ((point.x >= this.x0 && point.x < this.x1) && 
			(point.y >= this.y0 && point.y < this.y1));
	};


	Rect.prototype.toString = function() {
		return "[ " + new Point(this.x0,this.y0) + ":" + new Point(this.x1,this.y1) + " ]";
	};

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

		this.width = setting(carousel, 'width', defaults.width);
		this.height = setting(carousel, 'height', defaults.height);
		this.switchPause = setting(carousel, 'switchPause', defaults.switchPause);
		this.speed = setting(carousel, 'speed', defaults.speed);
	}

	/**
	 * ScreenBuffer represents canvas object and it's scratch buffer.
	 * 
	 */
	function ScreenBuffer(carousel, settings) {
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

	ScreenBuffer.prototype.renderNavigateLeft = function(state) {
		if (state.showLeftNavigation()) {
			this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
			this.context.beginPath();
			this.context.rect(0, 0, this.settings.width/6.0, this.settings.height);
			this.context.fill();
		}
	};

	ScreenBuffer.prototype.renderNavigateRight = function(state) {
		if (state.showRightNavigation()) {
			this.context.fillStyle = "rgba(0, 0, 0, 0.3)";
			this.context.beginPath();
			this.context.rect(settings.width*(1-1/6.0), 0, this.settings.width, this.settings.height);
			this.context.fill();
		}
	};



	/**
	 * State is the current state of the carousel. 
	 * On instance is created for each carousel.
	 *
	 */
	function State(carousel, settings) {

		this.currentFrame = 0;
		this.progress = 0.0;
		this.i = 0; // frameIndex
		
		this.switchTimerId = -1;
		this.animationTimerId = -1;
		this.switchInProgress = 0;
		this.direction = this.Direction.RIGHT;

		function images(images) {
			ret = [];
			for (var i = 0; i < images.length; ++i) {
				imageDiv = images[i].getElementsByTagName('img')[0];
				// TODO: This might not be necessary.
				ret.push(imageDiv);
			}
			return ret;
		}

		this.images = images(carousel.getElementsByClassName('image'));


		this.lastMouse = new Point(-1, -1);
		this.leftNavigationArea = new Rect(0, 0, settings.width/6.0, settings.height);
		this.rightNavigationArea = new Rect(settings.width - settings.width/6.0, 0, settings.width, settings.height);

	}

	State.prototype.Direction = { LEFT: 0, RIGHT: 1 };

	State.prototype.showLeftNavigation = function() {
		return this.leftNavigationArea.contains(this.lastMouse);
	};

	State.prototype.showRightNavigation = function() {
		return this.rightNavigationArea.contains(this.lastMouse);
	};
	
	/**
	 * Returns true if the screen needs to be redrawn because a naviagtion area has changed.
	 */
	State.prototype.updateMouse = function(x, y) {
		

		mouse = new Point(x, y);
		
		

		leftNavChanged = this.leftNavigationArea.contains(mouse) != this.showLeftNavigation();
		rightNavChanged = this.rightNavigationArea.contains(mouse) != this.showRightNavigation();
		ret = leftNavChanged || rightNavChanged;
		this.lastMouse = mouse;
		return ret;
	};

	/**
	 * Img element of the image currently displayed. 
	 *
	 * Returns the same object while fading out, until the next image is fully visible.
	 */
	State.prototype.currentImage = function () {
		return this.images[this.currentFrame];
	};

	/**
	 * Integer indicating the index of the next image in the list.
	 */
	State.prototype.nextFrame = function () {
		return (this.currentFrame + 1) % this.images.length;
	};

	State.prototype.previousFrame = function () {
		return (this.currentFrame + this.images.length - 1) % this.images.length;
	};

	/**
	 * img element of the next image to be displayed.
	 */
	State.prototype.nextImage = function () {
		return this.images[this.nextFrame()];
	};

	State.prototype.previousImage = function () {
		return this.images[this.previousFrame()];
	};

	function animate(settings, state, screenBuffer) {
		var blend = fade;

		function fade(image0, image1, progress) {
		    
		    p = state.source.data;
		    q = state.target.data;
		    
		    
		    r = state.result.data;
		    translucency = progress/100.0;
		    opacity = 1.0 - translucency;
		    for (var i = 0; i < p.length; i += 1) {
		        r[i] = p[i] * opacity + q[i] * translucency;
		    }
		    screenBuffer.context.putImageData(state.result, 0, 0);
		}

		function scroll(image0, image1, progress) {
			x = progress*settings.width/100.0;
			screenBuffer.context.drawImage(image0, -x, 0, settings.width, settings.height);
			screenBuffer.context.drawImage(image1, settings.width - x, 0, settings.width, settings.height);
		}

		/**
		 * Get a smoother looking animation by using accelaration and breaking.
		 * 
		 */
		function updateProgress(state, settings) {
			g = settings.speed/300;
			M = 0.0012;
			drag = Math.max(M*(-85+state.progress), 0);
			acc = g - drag;
			speed = Math.min(settings.speed, acc*state.i);
			return Math.min(state.progress + speed, 100.0);
		}

		/**
		 * Called with 60fps to switch between images. This method is responsible 
		 * for calling the blend method and stopping the switch timer when it is
		 * completed.
		 * 
		 */
		function switchFrame() {
			state.progress = updateProgress(state, settings);
			blend(state.currentImage(), state.nextImage(), state.progress);

			screenBuffer.renderNavigateLeft(state);
			screenBuffer.renderNavigateRight(state);

			if (state.progress >= 100.0) {
				window.clearInterval(state.animationTimerId);
				state.currentFrame  = state.direction == state.Direction.RIGHT ? state.nextFrame():state.previousFrame();
				state.progress = 0.0;

				console.log("Switch completed for " + state.animationTimerId);
				--state.switchInProgress;
				state.direction = state.Direction.RIGHT;
			}
			++state.i;
		}

		function readData(image) {
	        screenBuffer.scratch.drawImage(image, 0, 0, settings.width, settings.height);
    	    return screenBuffer.scratch.getImageData(0, 0, settings.width, settings.height);
		}

		function startSwitchFrame() {
			if (state.switchInProgress >= 1) {
				console.log("Skipping switch for " + state.animationTimerId);
				return;
			}
			++state.switchInProgress;
			console.log("Switching frames between " + state.currentFrame + " and " + state.nextFrame());

			
			state.i = 0;

			state.source = readData(state.currentImage());
			state.target = readData(state.nextImage());

			state.result = screenBuffer.context.createImageData(settings.width, settings.height);
			state.animationTimerId = window.setInterval(switchFrame, 1000 / 60);
		}

		eventMouseMove = function(mouseEvent) {
			if (state.switchInProgress > 0) {
				return;
			}

			redraw = state.updateMouse(mouseEvent.offsetX, mouseEvent.offsetY);

			if (redraw) {
				drawBetweenSwitch(settings, state, screenBuffer);
			}
		};

		eventMouseDown = function(mouseEvent) {
			if (state.showLeftNavigation()) {
				console.log("Navigate left!");
				window.clearInterval(state.animationTimerId);
				window.clearInterval(state.switchTimerId);
				
				state.switchInProgress = 1;
				console.log("Switching frames between " + state.currentFrame + " and " + state.nextFrame());

			
				state.direction = state.Direction.LEFT;
				state.i = 0;

				state.source = state.result == undefined ? readData(state.currentImage()) : state.result;
				state.target = readData(state.previousImage());

				state.result = screenBuffer.context.createImageData(settings.width, settings.height);
				state.animationTimerId = window.setInterval(switchFrame, 1000 / 60);
				state.switchTimerId = window.setInterval(startSwitchFrame, settings.switchPause);
			}
			if (state.showRightNavigation()) {
				console.log("Navigate right!");
				window.clearInterval(state.animationTimerId);
				window.clearInterval(state.switchTimerId);
				
				state.switchInProgress = 1;
				console.log("Switching frames between " + state.currentFrame + " and " + state.nextFrame());

			
				state.i = 0;

				state.source = state.result == undefined ? readData(state.currentImage()) : state.result;
				state.target = readData(state.nextImage());

				state.result = screenBuffer.context.createImageData(settings.width, settings.height);
				state.animationTimerId = window.setInterval(switchFrame, 1000 / 60);
				state.switchTimerId = window.setInterval(startSwitchFrame, settings.switchPause);
			}
		};

		screenBuffer.canvas.addEventListener('mousemove', eventMouseMove);
		screenBuffer.canvas.addEventListener('mouseout', eventMouseMove);
		screenBuffer.canvas.addEventListener('mouseover', eventMouseMove);
		screenBuffer.canvas.addEventListener('mousedown', eventMouseDown);
		
		state.switchTimerId = window.setInterval(startSwitchFrame, settings.switchPause);
		console.log("Started animation for " + carousel.id);
	}

	function drawBetweenSwitch(settings, state, screenBuffer) {

		screenBuffer.context.drawImage(state.currentImage(), 0, 0, settings.width, settings.height);

		screenBuffer.renderNavigateLeft(state);
		screenBuffer.renderNavigateRight(state);
	}

	function initCarousel(carousel, settings) {
		carousel.style.width = "" + settings.frameWidth + "px";
		carousel.style.height = "" + settings.frameHeight + "px";
		carousel.getElementsByClassName("images")[0].style.display = "none";


		var screenBuffer = new ScreenBuffer(carousel, settings);
		var state = new State(carousel, settings);

		state.images[0].onload = function() {
			screenBuffer.context.drawImage(state.currentImage(), 0, 0, settings.width, settings.height);		
		}

		animate(settings, state, screenBuffer);
	}

	function init() {
		carousels =	document.getElementsByClassName('valrus-carousel');
		for (var i = 0; i < carousels.length; ++i) {
			carousel = carousels[i];
			carousel.id = "carousel" + i;
			console.log("Found carousel [" + i + "/" + carousels.length + "]: " + carousel.id);
			settings = new Settings(carousel);
			initCarousel(carousel, settings);
		}
	}

	init();
})();
