module.exports = {
  devServer: {
    port: 3000,
    proxy: 'http://localhost:7001'
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}