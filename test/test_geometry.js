describe("Create point", function() {
 	
	it("test origin has valid values.", function () {
		p = new valrus.geometry.Point(0,0);
		expect(p.x).toEqual(0.0);
		expect(p.y).toEqual(0.0);
	})

	it("test point has valid X and Y.", function () {
		p = new valrus.geometry.Point(1,2);
		expect(p.x).toEqual(1.0);
		expect(p.y).toEqual(2.0);
	})

});

describe("Create rect", function() {
	it("test rect corner placement", function() {
		r = new valrus.geometry.Rect(0,1,2,3);
		expect(r.x0).toEqual(0.0);
		expect(r.y0).toEqual(1.0);
		expect(r.x1).toEqual(2.0);
		expect(r.y1).toEqual(3.0);
	});
});

describe("Point in rect", function() {
	it("test rect contains point in middle", function() {
		r = new valrus.geometry.Rect(0,0,2.0,2.0);
		p = new valrus.geometry.Point(1.0,1.0);
		expect(r.contains(p)).toEqual(true);
	});

	it("test rect does not contains point to left", function() {
		r = new valrus.geometry.Rect(0,0,2.0,2.0);
		p = new valrus.geometry.Point(-1.0,1.0);
		expect(r.contains(p)).toEqual(false);
	});

	it("test rect does not contains point to right", function() {
		r = new valrus.geometry.Rect(0,0,2.0,2.0);
		p0 = new valrus.geometry.Point(3.0,1.0);
		expect(r.contains(p)).toEqual(false);
	});

	it("test rect does not contains point above", function() {
		r = new valrus.geometry.Rect(0,0,2.0,2.0);
		p0 = new valrus.geometry.Point(1.0,3.0);
		expect(r.contains(p)).toEqual(false);
	});

	it("test rect does not contains point below", function() {
		r = new valrus.geometry.Rect(0,0,2.0,2.0);
		p0 = new valrus.geometry.Point(1.0,-1.0);
		expect(r.contains(p)).toEqual(false);
	});

	it("test rect with point on edges", function() {
		r = new valrus.geometry.Rect(0,0,2.0,2.0);
		left = new valrus.geometry.Point(0.0,1.0);
		right = new valrus.geometry.Point(2.0,1.0);
		bottom = new valrus.geometry.Point(1.0,0.0);
		top = new valrus.geometry.Point(1.0,10000.0);
		
		expect(r.contains(left)).toEqual(true);
		expect(r.contains(right)).toEqual(false);	
		expect(r.contains(bottom)).toEqual(true);
		expect(r.contains(top)).toEqual(false);
	});

	// TODO: Add support for backwards rect such as Rect(0,0, -2, -2)
});
