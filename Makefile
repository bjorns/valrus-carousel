SRC= src/geometry.js
SRC+=src/settings.js
SRC+=src/screen_buffer.js
SRC+=src/state.js
SRC+=src/blend.js
SRC+=src/animate.js
SRC+=src/valrus-canvas.js

MIN=$(patsubst src/%.js, bin/%.min.js, $(SRC))


all: lint bin/valrus-carousel.min.js

bin:
	mkdir -p bin

compress: bin bin/valrus-canvas.min.js

bin/valrus-carousel.min.js: bin $(MIN)
	cat $(MIN) > $@

bin/%.min.js: src/%.js
	yuicompressor --type js --charset UTF-8 --line-break 80 -o $@ $^	

lint:
	jsl -conf jslint.conf -nosummary -nocontext -nofilelisting -nologo

clean:
	rm -rf bin

.PHONY: all lint
