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
        'node/index': 'src/server/node/index.js',
        'electron/index': 'src/server/electron/index.js'
    },
	output: [
		{
            dir: 'app/server/',
            format: 'commonjs',
            sourcemap: true,
            strict: false,
            name: '_',
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
            banner: {
                content: {
                    file: path.join(__dirname, 'license-header.txt'),
                },
            }
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
                {src: 'src/app/index.js', dest: 'app/'},
                {src: 'src/server/index.js', dest: 'app/server/'},
                {src: 'src/python/*', dest: 'app/server/python/'},
                {src: 'node_modules/fsevents/fsevents.node', dest: 'app/server/'},
                {src: 'LICENSE', dest: 'app/'},
                {src: 'package.json', dest: 'app/'},
            ]
        })
    ]
};
