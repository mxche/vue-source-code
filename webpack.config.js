const HtmlWebpackPlugin = require('html-webpack-plugin')
const path  = require('path')


const pathResolve = (url)=>{
  return path.resolve(__dirname,url)
}


module.exports = {
  entry: pathResolve('./src/index.js'),
  mode:"development",
  devServer:{
    port: 3000
  },
  devtool: 'source-map', 
  output:{
    path:pathResolve('dist'),
    clean:true,
    filename:'[name].[chunkhash:8].bundle.js',
  },
  resolve:{
    modules:[pathResolve('source'),pathResolve('node_modules')]
  },
  plugins:[new HtmlWebpackPlugin({template:pathResolve('public/index.html')})]
}