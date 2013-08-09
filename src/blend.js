"use strict";
valrus = valrus || {};
valrus.blend = valrus.blend || {};

valrus.blend.fade = function(settings, state, screenBuffer) {
	var opacity = state.progress/100.0;
	var translucency = 1.0 - opacity;
	
	screenBuffer.scratch.clearRect(0,0,screenBuffer.width, screenBuffer.height);

	screenBuffer.scratch.gloablAlpha = translucency;
	screenBuffer.scratch.drawImage(state.sourceImage(), 0, 0);

	screenBuffer.scratch.globalAlpha = opacity;
	screenBuffer.scratch.drawImage(state.targetImage(), 0, 0);

	screenBuffer.context.drawImage(screenBuffer.scratchCanvas, 0,0);
	
};

valrus.blend.scroll = function(settings, state, screenBuffer) {
	var x = state.progress * settings.width/100.0;

	if (state.direction == state.Direction.LEFT) {
		screenBuffer.context.drawImage(state.sourceImage(), x, 0);
		screenBuffer.context.drawImage(state.targetImage(), -screenBuffer.width + x, 0);
	} else {
		screenBuffer.context.drawImage(state.sourceImage(), -x, 0);
		screenBuffer.context.drawImage(state.targetImage(), screenBuffer.width - x, 0);
	}
};

valrus.blend.cards = function(settings, state, screenBuffer) {
	var x = state.progress * settings.width/100.0;

	var SHADOW_WIDTH = 30;

	if (state.direction == state.Direction.LEFT) {
		screenBuffer.context.fillStyle = "rgba(0, 0, 0, 0.1)";
		screenBuffer.context.beginPath();
		screenBuffer.context.rect(x, 0, SHADOW_WIDTH, screenBuffer.height);
		screenBuffer.context.fill();		
		screenBuffer.context.drawImage(state.targetImage(), -screenBuffer.width + x, 0);
	} else {
		screenBuffer.context.fillStyle = "rgba(0, 0, 0, 0.1)";
		screenBuffer.context.beginPath();
		screenBuffer.context.rect(screenBuffer.width - x - 0.3*(100 - state.progress), 0, SHADOW_WIDTH, screenBuffer.height);
		screenBuffer.context.fill();
		screenBuffer.context.drawImage(state.targetImage(), screenBuffer.width - x, 0);
	}
};

valrus.blend.immediate = function(settings, state, screenBuffer) {
	screenBuffer.context.putImageData(state.target, 0, 0);
};
