var commonjs = require('@rollup/plugin-commonjs'),
    nodeResolve = require('@rollup/plugin-node-resolve'),
    json = require('@rollup/plugin-json'),
    babel = require('@rollup/plugin-babel'),
    terser = require('@rollup/plugin-terser'),
    copy = require('rollup-plugin-copy'),
    license = require('rollup-plugin-license'),
    watchChange = require('./client.plugin-watch'),
    package = require('../package.json'),
    path = require('path'),
    watch = process.argv.includes('--watch')

module.exports = {
    input: 'src/client/index.mjs',
	output: [
		{
            dir: 'app/client/',
            chunkFileNames: `[name].js`,
            entryFileNames: `[name].js`,
            format: 'es',
            sourcemap: true,
            sourcemapExcludeSources: true
		},
	],
    treeshake: false,
    watch: {
        clearScreen: false
    },
	plugins: [
        json(),
        nodeResolve({
            browser: true
        }),
        commonjs(),
        watch ? {} : babel({
            babelHelpers: 'bundled',
            babelrc: false,
            exclude: [
                /node_modules\/core-js/,
                /node_modules\/ace-builds/
            ],
            presets: [[
                '@babel/preset-env',
                {
                    debug: true,
                    targets: {
                        ios: '11',
                        chrome: '70'
                    },
                    useBuiltIns: 'usage',
                    corejs: 3,
                    modules:false
                }
            ]]
        }),
        watch ? {} : terser({
            sourceMap: true,
            keep_classnames: true,
            keep_fnames: true,
            output: {
                comments: false,
            },
        }),
        {
            name: 'remove-node-modules-from-source-map',
            enforce: 'post',
            transform(code, id) {
                if (id.includes('node_modules')) {
                    return { code, map: { mappings: '' } }
                }
            }
        },
        watch ? {} :license({
            thirdParty: {
                includeSelf: true,
                output: 'app/client/LICENSES',
            },
        }),
        watch ? {} : copy({
            targets: [
                {src: 'resources/images/logo_nobadge.png', dest: 'app/assets/', rename: 'favicon.png'},
                {src: 'resources/images/logo.png', dest: 'app/assets/'},
                {src: 'resources/images/logo_tray.png', dest: 'app/assets/'},
                {src: 'resources/images/logo_tray@x2.png', dest: 'app/assets/'},
                {src: 'resources/images/logo_16x16.png', dest: 'app/assets/'},
                {src: 'resources/fonts/*', dest: 'app/assets/fonts/'},
                {src: 'node_modules/ace-builds/src-min/worker-css.js', dest: 'app/client/ace/'},
                {src: 'node_modules/ace-builds/src-min/worker-html.js', dest: 'app/client/ace/'},
                {src: 'node_modules/ace-builds/src-min/worker-javascript.js', dest: 'app/client/ace/'},
                {src: 'node_modules/ace-builds/src-min/ace.js', dest: 'app/client/ace/'},
                {src: 'src/html/client.html', dest: 'app/client/', rename: 'index.html', transform: (contents)=>{
                    return contents.toString().replace(/\$\{([^\}]+)\}/g, (m, p1)=>{return package[p1]})
                }},

            ]
        }),
        watchChange()
    ]
};
