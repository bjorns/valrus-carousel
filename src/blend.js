 valrus = valrus || {};
 valrus.blend = valrus.geometry || {};

 valrus.blend.fade = function(state, screenBuffer) {
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

valrus.blend.scroll = function(state, screenBuffer) {
	x = state.progress * state.settings.width/100.0;
	settings = state.settings;
	screenBuffer.context.putImageData(state.source.data, -x, 0, settings.width, settings.height);
	screenBuffer.context.drawImage(state.target.data, settings.width - x, 0, settings.width, settings.height);
};
