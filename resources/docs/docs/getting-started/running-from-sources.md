Running the app from the sources slightly differs from using prebuilt binaries: we'll build and launch the app with npm (node package manager).

## Requirements

- [Node.js](https://nodejs.org/en/#download)
- [git](https://git-scm.com/downloads)


## Run from sources


**Download**

```bash
git clone https://github.com/jean-emmanuel/open-stage-control
cd open-stage-control/
# uncomment next line if you want the latest release
# instead of the current development version
# git checkout $(git describe --tags `git rev-list --tags --max-count=1`)
npm install
npm run build
```

!!! tip "Raspberry systems"
    Run one of these instead of `npm install` (you can get the system's `arch` by running `uname -m` in a terminal)
    ```
    npm install --arch=arm64
    npm install --arch=armv7l
    ```


!!! info "Updating from sources"
    ```bash
    git pull
    npm install
    npm run build
    ```

**Run**

```bash
npm start [ -- options]
```

!!! info ""
    A double hyphen (`--`) is used here to tell npm that the options are to be passed to the app.


!!! warning "MIDI support"
    When running from sources, MIDI support won't be enabled unless the [MIDI configuration procedure](../../midi/midi-configuration/) for "other systems" is followed.

## Build documentation

In order to make the local documentation available through the server's `--docs` option and the launcher's `Documentation` menu action, an extra step is needed.


```bash
# install docs website theme
python3 -m pip install mkdocs-material
# build docs website
npm run build-docs
```

## Package from sources

Follow the "Run from sources" instructions, then:

```bash

# TARGET_PLATFORM can be linux, win32 (windows) or darwin (os x)
export PLATFORM=TARGET_PLATFORM
# TARGET_ARCH can be ia32, x64, armv7l or arm64
export ARCH=TARGET_ARCH


npm run package


# The node-only package can be built with
npm run package-node

```

This will build the app in `dist/open-stage-control-PLATFORM-ARCH`.

!!! info ""
    Building the app for windows from a linux system requires wine to be installed.


## Debian / Ubuntu and RPM installers

=== "Debian / Ubuntu"

    ```
    npm run deb64
    ```

=== "RPM"

    ```
    npm run rpm
    ```


## Build script on Mac Silicon

This user-contributed script can be used to build open stage control on recent Macs:

https://github.com/rewgs/osc-as
