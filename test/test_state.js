describe("Create state", function() {
	carousel = setFixtures('<div class="carousel"></div>')[0];
	settings = new valrus.Settings(carousel);

	state = new valrus.State(carousel, settings);

	it("test initial state", function() {
		expect(state.currentFrame).toEqual(0);
		expect(state.images.length).toEqual(0);
	});
});