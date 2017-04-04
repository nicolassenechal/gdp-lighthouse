#!/bin/bash

./node_modules/.bin/lighthouse http://github.com --output html --output json
./node_modules/.bin/surge --project /var/app/current/report.html --domain gdp-test.surge.sh
