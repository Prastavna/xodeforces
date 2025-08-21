#!/bin/bash

# package version from package.json
VERSION=$(cat package.json | grep version | cut -d '"' -f 4)

zip -r xodeforces-${VERSION}-firefox.zip dist/firefox
zip -r xodeforces-${VERSION}-chrome.zip dist/chrome
