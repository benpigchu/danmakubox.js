import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/main.js',
  format: 'umd',
  plugins: [babel()],
  dest: 'dist/danmakubox.js',
  moduleName: 'DanmakuBox'
}