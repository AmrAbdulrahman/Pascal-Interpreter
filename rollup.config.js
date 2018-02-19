// import resolve from 'rollup-plugin-node-resolve';
// import babel from 'rollup-plugin-babel';
//
// export default {
//   input: 'src/index.js',
//   output: {
//     name: 'sc',
//     file: 'dist/bundle.js',
//     format: 'iife',
//   },
//   plugins: [
//     babel({
//       include: 'src/index.js',
//       externalHelpers: false,
//       runtimeHelpers: true,
//       babelrc: false,
//       presets: ['es2015-rollup'],
//       plugins: ['transform-runtime'],
//     }),
//     resolve(),
//   ]
// };

import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'sc'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
