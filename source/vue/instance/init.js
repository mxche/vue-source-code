
import {initData,initComputed,initWatch} from './state'

// 进行初始化工作
export function initState(vm){
  const ops= vm.$options
  if(ops.data){
    initData(vm)
  }
  if(ops.computed){
    initComputed(vm)
  }
  if(ops.watch){
    initWatch(vm)
  }
  
}


