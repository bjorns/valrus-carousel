var valrus = valrus || {};
valrus.geometry = valrus.geometry || {};
valrus.geometry.Point = function(x, y) {
	this.x = x;
	this.y = y;
};
	
valrus.geometry.Point.prototype.toString = function() {
	return "[" + this.x + ":" + this.y + "]";
};
	
valrus.geometry.Rect = function(x0,y0, x1,y1) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
};
	
/**
 * Note: only works for positive rects.
 */
valrus.geometry.Rect.prototype.contains = function(point) {
	return ((point.x >= this.x0 && point.x < this.x1) && 
		(point.y >= this.y0 && point.y < this.y1));
};


valrus.geometry.Rect.prototype.toString = function() {
	return "[ " + new Point(this.x0,this.y0) + ":" + new Point(this.x1,this.y1) + " ]";
};