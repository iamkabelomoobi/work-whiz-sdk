import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const externalDependencies = ['axios', 'tslib'];
const isExternalDependency = id =>
  externalDependencies.some(pkg => id === pkg || id.startsWith(`${pkg}/`));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'WorkWhizSDK',
      sourcemap: true,
      exports: 'named',
      globals: {
        axios: 'axios',
        tslib: 'tslib',
      },
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser(),
  ],
  external: isExternalDependency,
};
