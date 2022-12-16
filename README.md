#### 安装依赖包
```js
yarn add  webpack webpack-cli webpack-dev-server html-webpack-plugin -S
```
#### 配置启动 和 打包
```js
yarn  dev | yarn build
```
#### 配置vue文件源码映射
- 本地创建source目录
- 通过webpack的 modules配置，指向source目录
- 在index.js文件中，可以通过import Vue from 'vue' 就能查到到对应的模块内容

##### 数据劫持 


# vue-source-code
