import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'lib/commonjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'lib/module/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: false,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      include: [
        'src/**/*',
        'node_modules/react-native-parsed-text/**',
      ],
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: [
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
        'react-native-reanimated/plugin',
      ],
    }),
    commonjs({
      include: /node_modules/,
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser(),
  ],
  external: [
    'react',
    'react-native',
    'react-native-reanimated',
    'react-native-image-zoom-viewer',
    'react-native-sound',
    'react-native-svg',
    'react-native-video',
    'twrnc',
  ],
};
