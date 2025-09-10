var commonjs = require('@rollup/plugin-commonjs'),
    nodeResolve = require('@rollup/plugin-node-resolve'),
    json = require('@rollup/plugin-json'),
    babel = require('@rollup/plugin-babel'),
    terser = require('@rollup/plugin-terser'),
    copy = require('rollup-plugin-copy'),
    license = require('rollup-plugin-license'),
    watchChange = require('./client.plugin-watch'),
    package = require('../package.json'),
    path = require('path')

module.exports = {
    input: 'src/client/index.js',
	output: [
		{
            file: 'app/client/open-stage-control-client.js',
            inlineDynamicImports: true,
            format: 'iife',
            sourcemap: true,
            strict: false,
            name: '_'
		},
	],
    watch: {
        clearScreen: false
    },
	plugins: [
        json(),
        commonjs(),
        nodeResolve({
            browser: true
        }),
        babel({
            babelHelpers: 'bundled',
            exclude: [
                /node_modules\/core-js/,
                /node_modules\/ace-builds/
            ],
            presets: [[
                '@babel/preset-env',
                {
                    targets: {
                        ios: '10.3',
                        chrome: '60'
                    },
                    useBuiltIns: 'usage',
                    corejs: 3,
                    modules:false
                }
            ]]
        }),
        terser({
            safari10: true,
            sourceMap: true,
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
        license({
            banner: {
                content: {
                    file: path.join(__dirname, 'license-header.txt'),
                },
            }
        }),
        copy({
            targets: [
                {src: 'resources/images/logo_nobadge.png', dest: 'app/assets/', rename: 'favicon.png'},
                {src: 'resources/images/logo.png', dest: 'app/assets/'},
                {src: 'resources/images/logo_tray.png', dest: 'app/assets/'},
                {src: 'resources/images/logo_tray@x2.png', dest: 'app/assets/'},
                {src: 'resources/images/logo_16x16.png', dest: 'app/assets/'},
                {src: 'resources/fonts/*', dest: 'app/assets/fonts/'},
                {src: 'node_modules/ace-builds/src-min/worker-css.js', dest: 'app/client/workers/'},
                {src: 'node_modules/ace-builds/src-min/worker-html.js', dest: 'app/client/workers/'},
                {src: 'node_modules/ace-builds/src-min/worker-javascript.js', dest: 'app/client/workers/'},
                {src: 'src/html/client.html', dest: 'app/client/', rename: 'index.html', transform: (contents)=>{
                    return contents.toString().replace(/\$\{([^\}]+)\}/g, (m, p1)=>{return package[p1]})
                }},

            ]
        }),
        watchChange()
    ]
};
