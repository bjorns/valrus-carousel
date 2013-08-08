valrus.animate = function (settings, state, screenBuffer) {

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
		settings.blend(settings, state, screenBuffer);

		screenBuffer.renderNavigateLeft(state);
		screenBuffer.renderNavigateRight(state);

		if (state.progress >= 100.0) {
			window.clearInterval(state.animationTimerId);
			console.log("Switch completed for " + state.switchTimerId);
			--state.switchInProgress;
			state.direction = state.Direction.RIGHT;
		}
		++state.i;
	}


	function startSwitchFrame() {
		if (state.switchInProgress >= 1) {
			console.log("Skipping switch for " + state.animationTimerId);
			return;
		}
		++state.switchInProgress;
		console.log("Switching frames between " + state.currentFrame + " and " + state.nextFrame());

		
		state.currentFrame = state.nextFrame();
		state.progress = 0.0;
		state.i = 0;

		state.source = screenBuffer.imageData(state.previousImage());
		state.target = screenBuffer.imageData(state.currentImage());
		state.result = screenBuffer.screenBuffer();

		state.animationTimerId = window.setInterval(switchFrame, 1000 / 60);
	}

	eventMouseMove = function(mouseEvent) {
		redraw = state.updateMouse(mouseEvent.offsetX, mouseEvent.offsetY);

		if (state.switchInProgress > 0) {
			return;
		}

		if (redraw) {
			screenBuffer.context.drawImage(state.currentImage(), 0, 0, settings.width, settings.height);
			screenBuffer.renderNavigateLeft(state);
			screenBuffer.renderNavigateRight(state);
		}
	};

	eventMouseDown = function(mouseEvent) {
		if (state.showLeftNavigation()) {
			state.direction = state.Direction.LEFT;
			console.log("Navigate left!");
		} else if (state.showRightNavigation()) {
			console.log("Navigate right!");
		} else {
			return;
		}
			
		window.clearInterval(state.animationTimerId);
		window.clearInterval(state.switchTimerId);
			
		state.switchInProgress = 1;
		console.log("Switching frames between " + state.currentFrame + " and " + state.nextFrame());

		state.currentFrame = state.nextFrame();
		state.progress = 0.0;
		state.i = 0;

		// If the switch is initiated in the middle of an already 
		// running switch we use the current screen as the source image
		// which reduces flicker.
		state.source = screenBuffer.screenBuffer();
		state.target = screenBuffer.imageData(state.currentImage());
		state.result = screenBuffer.screenBuffer();

		state.animationTimerId = window.setInterval(switchFrame, 1000 / 60);
		state.switchTimerId = window.setInterval(startSwitchFrame, settings.switchPause);
	};

	screenBuffer.overlayCanvas.addEventListener('mousemove', eventMouseMove);
	screenBuffer.overlayCanvas.addEventListener('mouseout', eventMouseMove);
	screenBuffer.overlayCanvas.addEventListener('mouseover', eventMouseMove);
	screenBuffer.overlayCanvas.addEventListener('mousedown', eventMouseDown);
	
	state.switchTimerId = window.setInterval(startSwitchFrame, settings.switchPause);
	console.log("Started animation for " + carousel.id);
};
