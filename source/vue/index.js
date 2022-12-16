


import {initState} from './instance/init'
import { Watcher } from './obsever/watcher'
import {compiler} from './utils/index'
function Vue(options){
    this._init(options)
}

function query(el){
  if(typeof el==='string'){
    return document.querySelector(el)
  }
}

Vue.prototype._init = function(options){
  const vm = this
  // 把当前options的挂载当前Vue实例上
  vm.$options = options;
  // 初始化vue 属性方法
  initState(vm);
  if(vm.$options.el){
    vm.$mount()
  }
}

Vue.prototype.$mount = function(){
  const vm = this
  let el = vm.$options.el
  el = vm.$el = query(el) //挂载当前dom
  console.log('🐻初始化渲染--start');
   //渲染时通过watcher来渲染
  const updateComponent = ()=>{
    //更新渲染
    this._update() 
  }
 new Watcher(vm,updateComponent)
}

Vue.prototype._update = function(){
  const vm = this
  const el = this.$el
  // 创建一个文档碎片
  const node =document.createDocumentFragment()
  let firstChild;
  while (firstChild = el.firstChild) {
    node.appendChild(firstChild)
  }
  console.log('>>>step1-进行编译模版，触发节点的get方法');
  //将 {{title}} 替换成data中的实际数据
  compiler(node,vm);
     //将内存碎片输出到dom
  el.appendChild(node)
}

Vue.prototype.$watch = function(expr,handle,opts){
   new Watcher(this,expr,handle,opts)
}

export default Vue






