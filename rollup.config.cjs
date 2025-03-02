const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const external = require('rollup-plugin-peer-deps-external');

module.exports = {
  input: 'src/index.tsx',
  output: [
    {
      dir: 'lib/commonjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
    },
    {
      dir: 'lib/module',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
    },
  ],
  plugins: [
    external(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    commonjs(),
    typescript({
      tsconfig: false,
      compilerOptions: {
        rootDir: 'src',
        outDir: undefined,
        declaration: false,
        sourceMap: true,
        module: 'esnext',
        target: 'esnext',
        jsx: 'preserve',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true
      },
      include: ['src/**/*'],
      exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx']
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      configFile: './babel.config.js'
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