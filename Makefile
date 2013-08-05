SRC=

all: lint compress

bin:
	mkdir -p bin

compress: bin bin/valrus-canvas.min.js

bin/valrus-canvas.min.js: src/valrus-canvas.js
	yuicompressor --type js --charset UTF-8 --line-break 80 -o $@ $^	

lint:
	jsl -conf jslint.conf -nosummary -nocontext -nofilelisting -nologo

clean:
	rm -rf bin

.PHONY: all lint
