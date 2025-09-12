var commonjs = require('@rollup/plugin-commonjs'),
    nodeResolve = require('@rollup/plugin-node-resolve'),
    json = require('@rollup/plugin-json')

module.exports = {
    input: 'src/docs/widgets-reference.mjs',
	output: [
		{
            file: 'src/docs/widgets-reference.js',
            inlineDynamicImports: true,
            format: 'commonjs',
            sourcemap: false,
            strict: false,
            indent: false,
            name: '_'
		},
	],
	plugins: [
        json(),
        nodeResolve({
            browser: true
        }),
        commonjs()
    ]
};
