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
    input: 'src/launcher/index.mjs',
	output: [
		{
            dir: 'app/launcher/',
            format: 'commonjs',
            strict: false,
            name: '_',
		},
	],
    treeshake: false,
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
        nodeResolve(),
        terser(),
        license({
            thirdParty: {
                includeSelf: true,
                output: 'app/launcher/LICENSES',
            },
        }),
        copy({
            targets: [
                {src: 'src/html/launcher.html', dest: 'app/launcher/', rename: 'index.html'},
            ]
        })
    ]
};
