#!/bin/bash

./node_modules/.bin/lighthouse $URL --output html --output json --output-path site
./node_modules/.bin/surge --project site.report.html --domain $BUILD.surge.sh
