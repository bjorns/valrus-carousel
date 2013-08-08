describe("Create ScreenBuffer", function() {
	carousel = setFixtures('<div class="carousel"></div>')[0];
	settings = new valrus.Settings(carousel);
	screenBuffer = new valrus.ScreenBuffer(carousel, settings);

	it("test canvas installation", function() {
		expect(screenBuffer.context).not.toEqual(undefined);

		
	});

	it("test scratch buffer installation", function() {
		expect(screenBuffer.scratch).not.toEqual(undefined);
		expect(screenBuffer.context.toString()).toEqual(screenBuffer.scratch.toString());
	});

	it("test canvas size", function() {
		w = settings.width;
		h = settings.height;
		expect(screenBuffer.canvas.width).toEqual(w);
		expect(screenBuffer.canvas.height).toEqual(h);
		expect(screenBuffer.scratchCanvas.width).toEqual(w);
		expect(screenBuffer.scratchCanvas.height).toEqual(h);
		expect(screenBuffer.overlayCanvas.width).toEqual(w);
		expect(screenBuffer.overlayCanvas.height).toEqual(h);
	});


});
