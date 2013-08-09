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
	

	carousel = setFixtures('<body><div class="valrus-carousel"' + 
		' data-speed="10"' + 
		' data-width="1024"' + 
		' data-height="510"' + 
		' data-switch-interval="1234"' + 
		'></div></body>')[0].getElementsByClassName('valrus-carousel')[0];
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
		expect(settings.switchInterval).toEqual(1234);
	});
});

