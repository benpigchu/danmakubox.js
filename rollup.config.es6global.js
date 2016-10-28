import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/main.es6.js',
  format: 'iife',
  dest: 'dist/danmakubox.es6global.js',
  moduleName: 'DanmakuBox'
}