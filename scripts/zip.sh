#!/bin/bash

# package version from package.json
VERSION=$(cat package.json | grep version | cut -d '"' -f 4)

cd dist/firefox
# remove ts.worker and create fake ts.worker
rm ./ts.worker.worker.js
echo "self.onmessage = function (_e) {
	self.postMessage({ data: null });
};" > ./ts.worker.worker.js
zip -r ../../xodeforces-${VERSION}-firefox.zip .

cd ../chrome
zip -r ../../xodeforces-${VERSION}-chrome.zip .

cd ..

