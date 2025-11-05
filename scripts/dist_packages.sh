#!/bin/bash

# clean
rm -rf dist app

# buid
npm run build
npm run build-docs
npm run package -- --all
PLATFORM=darwin ARCH=arm64 npm run package
npm run package-node

# get current version
VERSION=$(sed -nE 's/^\s*"version":\ "(.*?)",$/\1/p' package.json)

cd dist

# fetch & copy midi bins
mkdir tmp && cd tmp
cp ../../bin/osc-midi-* ./
chmod +x *
touch .expect-midi-bin
cp {.expect-midi-bin,osc-midi-linux} ../open-stage-control-linux-x64/resources/app/server/python/
cp {.expect-midi-bin,osc-midi-windows.exe} ../open-stage-control-win32-x64/resources/app/server/python/
cp {.expect-midi-bin,osc-midi-osx} ../open-stage-control-darwin-x64/open-stage-control.app/Contents/Resources/app/server/python/
cp {.expect-midi-bin,osc-midi-osx} ../open-stage-control-darwin-arm64/open-stage-control.app/Contents/Resources/app/server/python/
cd ..
rm -rf tmp

# make packages
mkdir packages
npm run deb64
npm run rpm64
mv *.{deb,rpm} packages/

mv open-stage-control-node open-stage-control_${VERSION}_node
mv open-stage-control-win32-x64    open-stage-control_${VERSION}_win32-x64
mv open-stage-control-linux-x64    open-stage-control_${VERSION}_linux-x64

echo "Creating zip packages..."
zip -q -r --symlinks packages/open-stage-control_${VERSION}_osx-x64.zip open-stage-control-darwin-x64/open-stage-control.app
zip -q -r --symlinks packages/open-stage-control_${VERSION}_osx-arm64.zip open-stage-control-darwin-arm64/open-stage-control.app
zip -q -r packages/open-stage-control_${VERSION}_node.zip     open-stage-control_${VERSION}_node
zip -q -r packages/open-stage-control_${VERSION}_win32-x64.zip      open-stage-control_${VERSION}_win32-x64
zip -q -r packages/open-stage-control_${VERSION}_linux-x64.zip      open-stage-control_${VERSION}_linux-x64
