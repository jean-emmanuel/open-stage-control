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
    input: 'src/server/index.js',
	output: [
		{
            file: 'app/server/open-stage-control-server.js',
            inlineDynamicImports: true,
            format: 'commonjs',
            strict: false,
            name: '_',
		},
	],
    external: ['electron'],
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
        terser({
            sourceMap: true,
            output: {
                comments: false,
            },
        }),
        license({
            banner: {
                content: {
                    file: path.join(__dirname, 'license-header.txt'),
                },
            }
        }),
        copy({
            targets: [
                {src: 'src/app/index.js', dest: 'app/'},
                {src: 'src/python/*', dest: 'app/server/python/'},
                {src: 'node_modules/fsevents/fsevents.node', dest: 'app/server/'},
                {src: 'LICENSE', dest: 'app/'},
                {src: 'package.json', dest: 'app/'},
            ]
        })
    ]
};
