
import { pushTarget,popTarget,Dep } from "./dep";
import {queueWatcher} from './nextTick'
import {util} from '../utils/index'
let uid = 0
export class Watcher {
  /**
   * 
   * @param {*} vm  当前组件实例
   * @param {*} expOrFn  表达式，或者函数
   * @param {*} cb   回调函数
   * @param {*} opts  配置项
   */
  constructor(vm,expOrFn,cb=()=>{},opts={}){
    this.vm = vm
    this.expOrFn = expOrFn

    if(typeof expOrFn==='function' ){
      this.getter = expOrFn
    }else{
      this.getter = function(){
        return util.getValue(vm,expOrFn)
      }
    }
    this.deps = []
    this.depIds = new Set()
    this.immediate = opts?.immediate
    //标识是否是计算属性
    this.lazy =opts.lazy 
    //是否需要进行计算
    this.dirty = this.lazy
    // 初始化渲染 调用执行函数
    this.value  = this.dirty? undefined: this.get()
    this.cb = cb
    this.opts = opts
    this.id = uid++
    //如果存在immediate 属性 为true，直接回调结果
    if(this.immediate){
      this.cb(this.value)
    }
  }

  addDep(dep){
    const id  = dep.id
    if(!this.depIds.has(id)){
      this.depIds.add(id)
      this.deps.push(dep)
      //dep 关联watcher
      dep.addSub(this)
    }
  }
  //让计算属性中的引用属性的依赖关联到渲染watcher中，触发更新
  depend(){
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  //计算属性专用(计算watcher)
  evaluate(){
    //取计算属性的值，
    this.value = this.get()
    //下次不再改变
    this.dirty = false;
  }
  get(){
    pushTarget(this)
    //改变this指向，取的是data中的值
    const value = this.getter.call(this.vm,this.vm) //执行当前的渲染操作
    popTarget()
    return value
  }
  //watch专用（用户watcher）
  run(){
    //watcher渲染的拿到最新的值
    const value =  this.get()
    if(this.value !== value) {
      this.cb(value, this.value);
    }
  }
  //更新渲染（渲染watcher）
  update(){
    //计算属性watcher，只更新值
    if(this.lazy){
      this.dirty = true
    }else{
     //渲染watcher， 异步更新，收集更新watcher，一次更新
     console.log('🐻异步更新渲染');
     queueWatcher(this)
    }  
 
  }
}



