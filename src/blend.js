 valrus = valrus || {};
 valrus.blend = valrus.blend || {};

 valrus.blend.fade = function(settings, state, screenBuffer) {
    p = state.source.data;
    q = state.target.data;
    r = state.result.data;

    translucency = state.progress/100.0;
    opacity = 1.0 - translucency;
    for (var i = 0; i < p.length; i += 1) {
        r[i] = p[i] * opacity + q[i] * translucency;
    }
    screenBuffer.context.putImageData(state.result, 0, 0);
};

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

valrus.blend.immediate = function(settings, state, screenBuffer) {
    screenBuffer.context.putImageData(state.target, 0, 0);
};
