valrus.animate = function (settings, state, screenBuffer) {
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
			state.currentFrame  = state.nextFrame();
			state.progress = 0.0;

			console.log("Switch completed for " + state.switchTimerId);
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
			screenBuffer.context.drawImage(state.currentImage(), 0, 0, settings.width, settings.height);
			screenBuffer.renderNavigateLeft(state);
			screenBuffer.renderNavigateRight(state);
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