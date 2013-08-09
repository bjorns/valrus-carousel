"use strict";
valrus.animate = function (settings, state, screenBuffer) {

	/**
	 * Get a smoother looking animation by using accelaration and breaking.
	 * 
	 */
	function updateProgress(state, settings) {
		var g = settings.speed/300;
		var M = 0.0012;
		var drag = Math.max(M*(-85+state.progress), 0);
		var acc = g - drag;
		var speed = Math.min(settings.speed, acc*state.i);
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
			console.log("Switch completed for " + state.switchTimerId);
			state.switchInProgress = false;
			state.direction = state.Direction.RIGHT;
			state.setSourceImage(null);
		} else {
			requestAnimationFrame(switchFrame);
		}
		++state.i;
	}


	function startSwitchFrame() {
		if (state.switchInProgress) {
			console.log("Skipping switch for " + state.animationTimerId);
			return;
		}
		state.switchInProgress = true;
		console.log("Switching frames between " + state.currentFrame + " and " + state.nextFrame());

		
		state.currentFrame = state.nextFrame();
		state.progress = 0.0;
		state.i = 0;

		state.source = screenBuffer.imageData(state.previousImage());
		state.target = screenBuffer.imageData(state.currentImage());
		state.result = screenBuffer.screenBuffer();

		state.animationTimerId = requestAnimationFrame(switchFrame);
	}

	var eventMouseMove = function(mouseEvent) {
		var redraw = state.updateMouse(mouseEvent.offsetX, mouseEvent.offsetY);

		if (state.switchInProgress) {
			return;
		}

		if (redraw) {
			screenBuffer.context.drawImage(state.currentImage(), 0, 0, settings.width, settings.height);
			screenBuffer.renderNavigateLeft(state);
			screenBuffer.renderNavigateRight(state);
		}
	};

	var eventMouseDown = function(mouseEvent) {
		if (state.showLeftNavigation()) {
			state.direction = state.Direction.LEFT;
			console.log("Navigate left!");
		} else if (state.showRightNavigation()) {
			console.log("Navigate right!");
		} else {
			return;
		}
			
		if (state.animationTimerId)
			cancelAnimationFrame(state.animationTimerId);

	
		window.clearInterval(state.switchTimerId);
		
			
		state.switchInProgress = true;
		console.log("Switching frames between " + state.currentFrame + " and " + state.nextFrame());

		state.currentFrame = state.nextFrame();
		state.progress = 0.0;
		state.i = 0;

		// If the switch is initiated in the middle of an already 
		// running switch we use the current screen as the source image
		// which reduces flicker.
		state.setSourceImage(screenBuffer.screenImage());
		state.animationTimerId = requestAnimationFrame(switchFrame);
		state.switchTimerId = window.setInterval(startSwitchFrame, settings.switchPause);
	};

	screenBuffer.overlayCanvas.addEventListener('mousemove', eventMouseMove);
	screenBuffer.overlayCanvas.addEventListener('mouseout', eventMouseMove);
	screenBuffer.overlayCanvas.addEventListener('mouseover', eventMouseMove);
	screenBuffer.overlayCanvas.addEventListener('mousedown', eventMouseDown);
	
	state.switchTimerId = window.setInterval(startSwitchFrame, settings.switchPause);
	console.log("Started animation for " + screenBuffer.id);
};
