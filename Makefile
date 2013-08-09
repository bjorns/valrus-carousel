SRC= src/geometry.js
SRC+=src/settings.js
SRC+=src/screen_buffer.js
SRC+=src/state.js
SRC+=src/blend.js
SRC+=src/animate.js
SRC+=src/init.js

MIN=$(patsubst src/%.js, bin/%.min.js, $(SRC))


all: lint test bin/valrus-carousel.min.js

bin:
	mkdir -p bin

compress: bin bin/valrus-canvas.min.js

bin/valrus-carousel.min.js: bin $(MIN)
	cat $(MIN) > $@

bin/%.min.js: src/%.js
	yuicompressor --type js --charset UTF-8 --line-break 80 -o $@ $^	

lint:
	jsl -conf jslint.conf -nosummary -nocontext -nofilelisting -nologo

## Currently doesn't give error messages, visit http://localhost:8080/test more more info on failures.
test:
	phantomjs lib/phantom-jasmine/run_jasmine_test.coffee test/phantomjs.html > /dev/null

clean:
	rm -rf bin

.PHONY: all lint test clean
