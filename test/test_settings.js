describe("Settings default values", function() {
	carousel = document.createElement('canvas');
	settings = new valrus.Settings(carousel);

	it("Speed", function() {
		expect(settings.speed).toEqual(8.0);
	});
    
	it("Width", function() {
		expect(settings.width).toEqual(512);
	});

	it("Height", function() {
		expect(settings.height).toEqual(255);
	});

});

describe("Settings DOM values", function() {
	

	carousel = setFixtures('<div class="carousel"><div class="settings">' + 
		'<span class="speed">10</span>' + 
		'<span class="width">1024</span>' + 
		'<span class="height">510</span>' + 
		'<span class="switchPause">1234</span>' + 
		'</div></div>')[0];
	var settings = new valrus.Settings(carousel);
	it("Speed", function() {
		expect(settings.speed).toEqual(10.0);
	});

	it("Width", function() {
		expect(settings.width).toEqual(1024);
	});

	it("Height", function() {
		expect(settings.height).toEqual(510);
	});
    
	it("Switch Pause", function() {
		expect(settings.switchPause).toEqual(1234);
	});
});

