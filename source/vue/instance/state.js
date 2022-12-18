

import { obsever } from "../obsever"
import { Watcher } from "../obsever/watcher"
import Dep from "../obsever/dep"
const sharedPropertyDefinition={
  enumerable: true,
  configurable: true,
  get: function(){},
  set: function(){}
}

function proxy(target,sourceKey,key){
  sharedPropertyDefinition.get = function(){
    return this[sourceKey][key]
  }

  sharedPropertyDefinition.set = function(val){
    this[sourceKey][key] = val
  }
  Object.defineProperty(target,key,sharedPropertyDefinition)
}

export function initData(vm){
  let data = vm.$options.data
  data = vm._data = typeof data==="function"? data.call(vm): data||{}
   Object.keys(data).forEach(key=>{
     proxy(vm,'_data',key)
   })
  obsever(vm._data) 
}
export function initWatch(vm){
 const watch = vm.$options.watch
  for(let key in watch){
    let ObjOrFn = watch[key]
     if(ObjOrFn.handler){
      // 配置形式（对象形式）
      createWatcher(vm,key,ObjOrFn.handler,{immediate:ObjOrFn.immediate})
     }
     else{
      //函数形式
      createWatcher(vm,key,ObjOrFn)
     }
  }
}

//用户自定义
function createWatcher (vm,key,handler,opts={}){
  vm.$watch(key,handler,opts)
}

export function initComputed(vm){
  //创建控对象保存计算属性名和函数
  let watchers  = vm._computedWatchers= Object.create(null)
  const computedProps = vm.$options.computed
  for (const key in computedProps) {
    const fn = computedProps[key]
    //计算watcher
    watchers[key] = new Watcher(vm,fn,()=>{},{lazy:true})
    Object.defineProperty(vm,key,{
      get:createComputedGetter(vm,key)
    })
  }
}
function createComputedGetter(vm,key){
const watcher  = vm._computedWatchers&&vm._computedWatchers[key]
return function(){
  if(watcher){
    //如果是true。需要进行重新计算
    if(watcher.dirty){
      watcher.evaluate()
    }

    //是计算属性watcher,添加dep关联[name.dep age.dep]
    if(Dep.target){
      watcher.depend()
    }
    return watcher.value
  }
}

}
