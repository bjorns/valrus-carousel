Valrus Carousel
===============

Valrus is a simple extensible HTML 5 Canvas carousel element that can easily be included 
in webpages.

Demo
-----
To see a demo run serve.sh and point your browser to http://localhost:8080/demo. You 
can use a file:// url but be aware bacause of security features in Chrome it may cause issues.

There is also one available here http://www.lysator.liu.se/~skoglund/valrus/

Installation
--------------
To use Valrus you need html to place the carousel and you need to import the javascript file at the bottom
of the page as follows. 

	<div class="valrus-carousel">
		<div class="settings">
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
	<script src="valrus-carousel.min.js"></script>

Settings
--------

The carousel responds to the followng settings:

|setting        | type  |default|description|
|---------------|-------|-------|-----------|
|speed          |numeric|8      |An abstract speed notion, because of some non linear animation there are no had specs on switch times vs. speed|
|width          |numeric|512    |The width in pixels of the canvas element.|
|height         |numeric|255    |The height in pixels of the canvas element.|
|switchPause    |numeric|5000   |The time in milliseconds between new switches. Note that if the switch itself takes more than this it will be aborted.|
|blend          |string |fade   |The blend function. Included options are _scroll_, _fade_ and _immediate_|


Adding a blend function
------------------------
The blend function is called with 60fps while the transition is running. It is responsible for rendering the transition between
the two images onto the canvas context.

To add a blend function define it under valrus.blend namespace and give it this signature:

	valrus.blend.immediate = function(settings, state, screenBuffer) {
		screenBuffer.context.putImageData(state.target, 0, 0);
	}

Have a look at src/blend.js to see the example functions. Bascally screenBuffer.context is the canvas context to write to and state.source and state.target contains byte arrays of data to blend. state.progress denotes the current progress between frames.


Interesting further work
------------------------

* 3D blends
* Testing is not covering properly.
