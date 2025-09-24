var commonjs = require('@rollup/plugin-commonjs'),
    nodeResolve = require('@rollup/plugin-node-resolve'),
    json = require('@rollup/plugin-json'),
    babel = require('@rollup/plugin-babel'),
    terser = require('@rollup/plugin-terser'),
    copy = require('rollup-plugin-copy'),
    license = require('rollup-plugin-license'),
    package = require('../package.json'),
    path = require('path')

module.exports = {
    input:  {
        'node/index': 'src/server/node/index.mjs',
        'electron/index': 'src/server/electron/index.mjs'
    },
	output: [
		{
            dir: 'app/server/',
            format: 'commonjs',
            sourcemap: true,
            sourcemapExcludeSources: true,
            strict: false
		},
	],
    treeshake: false,
    external: ['electron', '@serialport'],
    watch: {
        clearScreen: false
    },
	plugins: [
        json(),
        commonjs({
            ignoreGlobal: true,
            ignoreDynamicRequires: true
        }),
        nodeResolve({
            preferBuiltins: true
        }),
        license({
            thirdParty: {
                includeSelf: true,
                output: 'app/server/LICENSES',
            },
        }),
        terser({
            sourceMap: true,
            keep_classnames: true,
            keep_fnames: true,
            output: {
                comments: false,
            },
        }),
        copy({
            targets: [
                {src: 'src/index.js', dest: 'app/'},
                {src: 'src/server/index.js', dest: 'app/server/'},
                {src: 'src/server/python/*.py', dest: 'app/server/python/'},
                {src: 'node_modules/fsevents/fsevents.node', dest: 'app/server/'},
                {src: 'LICENSE', dest: 'app/'},
                {src: 'package.json', dest: 'app/'},
            ]
        })
    ]
};
