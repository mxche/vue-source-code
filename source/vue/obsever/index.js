import {arrayMethods} from './array'
import { def } from "../utils/index";
import Dep from './dep';

export function defineReactive (data,key,value){
  let dep  = new Dep()
    //如果typeof value本身是一对象 递归观察
   const childOb = obsever(value)
   Object.defineProperty(data,key,{
    get(){
      //对当前压栈的数据进行依赖收集
      if(Dep.target){
        // console.log(Dep.target,value,'>>>依赖收集process');
        //订阅当前操作节点的依赖， 通过触发Dep的depend方法,
        //触发watcher的addDep方法，把当前的dep传给watcher，让dep也保存当前的watcher，实现双向依赖
        dep.depend()//双向依赖
        if(childOb){
          childOb.dep.depend()
          //数据递归, 遍历每项，若是对象则再进行观察
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue){
      if(newValue===value) return
      value = newValue
      console.log('✅修改数据--触发set\n'+'当前值:'+newValue+'\n' +'当前dep:',dep,value);
      //通知更新
      dep.notify()
    }
   })
}


export class Observer{
  constructor(data){
    this.dep = new Dep()
    //创建对象，当前实例的方法保存值得私有属性上，便于后续数组操作，调用数组中数据劫持
    def(data,'__ob__',this)
    // 如果是数组
    if(Array.isArray(data)){
      //对原生数组原型方法进行劫持，可以通知
      data.__proto__ = arrayMethods
       this.observerArray(data)
    } else{
      this.walk(data)
    }
  }

  walk(obj){
    Object.keys(obj).forEach(key=>{
      defineReactive(obj,key,obj[key])
    })
  }

  //劫持数组操作的数据，监听
  observerArray(items){
    for (let i = 0; i < items.length; i++) {
      obsever(items[i])
    }
  }
}

export function dependArray(value) {
  for(let i=0; i<value.length; i++) {
      let currentItem = value[i];
      currentItem.__ob__ && currentItem.__ob__.dep.depend();
      if (Array.isArray(currentItem)){
          dependArray(currentItem); //数组递归
      }
  }
}

export function obsever(data){
  if(typeof data!=='object'|| data===null ) return
  //已经被观察的数据不需要重新进行观察
  if(data.__ob__){
    console.log(__ob__,'3232');
    return data.__ob__
  }
    return new Observer(data)
 }