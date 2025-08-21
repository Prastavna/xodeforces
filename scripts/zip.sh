#!/bin/bash

# package version from package.json
VERSION=$(cat package.json | grep version | cut -d '"' -f 4)

cd dist/firefox
zip -r ../../xodeforces-${VERSION}-firefox.zip .

cd ../chrome
zip -r ../../xodeforces-${VERSION}-chrome.zip .

cd ..

