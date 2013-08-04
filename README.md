Valrus Carousel
===============

Valrus is a simple extensible HTML 5 Canvas carousel element that can easily be included 
in webpages.

Demo
-----
To see a demo run serve.sh and point your browser to http://localhost:8080/demo

Installation
--------------
To use Valrus you need html to place the carousel and you need to import the javascript file at the bottom
of the page as follows. 

	<div class="valrus-carousel">
		<div class="settings">
			<span class="speed">10</span>
			<span class="width">1024</span>
			<span class="height">510</span>

		</div>
		<div class="images">
			<span class="image"><img src="carousel0.jpg" /></span>
			<span class="image"><img src="carousel1.jpg" /></span>
			<span class="image"><img src="carousel2.jpg" /></span>
		</div>
	</div>
	...
	<script src="../src/valrus-canvas.js"></script>

