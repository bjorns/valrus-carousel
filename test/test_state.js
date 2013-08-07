describe("State", function() {
	carousel = setFixtures('<div class="carousel">' + 
		'<div class="images">' +
		'	<span class="image"><img src="image0.jpg" /></span>' +
		'	<span class="image"><img src="image1.jpg" /></span>' +
		'	<span class="image"><img src="image2.jpg" /></span>' +
		'</div>' +
		'</div>')[0];

	settings = new valrus.Settings(carousel);
	state = new valrus.State(carousel, settings);

	it("test initial state", function() {
		expect(state.currentFrame).toEqual(0);
		expect(state.progress).toEqual(0.0);
		expect(state.i).toEqual(0);
		expect(state.switchTimerId).toEqual(-1);
		expect(state.animationTimerId).toEqual(-1);
		expect(state.switchInProgress).toEqual(0);
		expect(state.direction).toEqual(state.Direction.RIGHT);
		expect(state.lastMouse.x).toEqual(-1);
		expect(state.lastMouse.y).toEqual(-1);
		
		expect(state.leftNavigationArea).toEqual(new valrus.geometry.Rect(0,0,
			settings.width/6,settings.height));
		expect(state.rightNavigationArea).toEqual(
			new valrus.geometry.Rect(settings.width - settings.width/6.0, 0, 
				settings.width, settings.height));
		
	});

	it("test images initialization", function() {
		expect(state.images.length).toEqual(3);
		expect(state.images[0].src).toMatch('image0.jpg');
		expect(state.images[1].src).toMatch('image1.jpg');
		expect(state.images[2].src).toMatch('image2.jpg');
	});

	it("test image access", function() {
		expect(state.currentImage().src).toMatch('image0.jpg');
		expect(state.nextImage().src).toMatch('image1.jpg');

		state.currentFrame = state.nextFrame();
		expect(state.currentImage().src).toMatch('image1.jpg');
		expect(state.nextImage().src).toMatch('image2.jpg');

		state.currentFrame = state.nextFrame();
		expect(state.currentImage().src).toMatch('image2.jpg');
		expect(state.nextImage().src).toMatch('image0.jpg');

		state.currentFrame = state.nextFrame();
		expect(state.currentImage().src).toMatch('image0.jpg');
		expect(state.nextImage().src).toMatch('image1.jpg');

		// Go back one step.
		state.direction = state.Direction.LEFT;
		expect(state.currentImage().src).toMatch('image0.jpg');
		expect(state.nextImage().src).toMatch('image2.jpg');

		state.currentFrame = state.nextFrame();
		expect(state.currentImage().src).toMatch('image2.jpg');
		expect(state.nextImage().src).toMatch('image1.jpg');
	});
});
