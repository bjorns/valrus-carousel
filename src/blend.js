valrus = valrus || {};
valrus.blend = valrus.blend || {};

/**
 * Deprecated. Only available for reference.
 */
valrus.blend.fade = function(settings, state, screenBuffer) {
	p = state.source.data;
	q = state.target.data;
	r = state.result.data;

	translucency = state.progress/100.0;
	opacity = 1.0 - translucency;
	for (var i = 0; i < p.length; i += 1) {
		r[i] = p[i] * opacity + q[i] * translucency;
	}
	screenBuffer.context.putImageData(state.result, 0, 0 );
};

valrus.blend.fade2 = function(settings, state, screenBuffer) {
	opacity = state.progress/100.0;
	translucency = 1.0 - opacity;
	
	screenBuffer.scratch.clearRect(0,0,screenBuffer.width, screenBuffer.height);

	screenBuffer.scratch.gloablAlpha = translucency;
	screenBuffer.scratch.drawImage(state.previousImage(), 0, 0);

	screenBuffer.scratch.globalAlpha = opacity;
	screenBuffer.scratch.drawImage(state.currentImage(), 0, 0);

	screenBuffer.context.drawImage(screenBuffer.scratchCanvas, 0,0);
	
};

/**
 * Deprecated. Only available for reference.
 */
valrus.blend.scroll = function(settings, state, screenBuffer) {
	var x = state.progress * settings.width/100.0;

	if (state.direction == state.Direction.LEFT) {
		screenBuffer.context.putImageData(state.source, x, 0);
		screenBuffer.context.putImageData(state.target, -settings.width + x, 0);
	} else {
		screenBuffer.context.putImageData(state.source, -x, 0);
		screenBuffer.context.putImageData(state.target, settings.width - x, 0);
	}
};

valrus.blend.scroll2 = function(settings, state, screenBuffer) {
	var x = state.progress * settings.width/100.0;

	if (state.direction == state.Direction.LEFT) {
		screenBuffer.context.drawImage(state.previousImage(), x, 0);
		screenBuffer.context.drawImage(state.currentImage(), -screenBuffer.width + x, 0);

	} else {
		screenBuffer.context.drawImage(state.previousImage(), -x, 0);
		screenBuffer.context.drawImage(state.currentImage(), screenBuffer.width - x, 0);
	}
};

valrus.blend.immediate = function(settings, state, screenBuffer) {
	screenBuffer.context.putImageData(state.target, 0, 0);
};
