//收集属性的watcher
let uid = 0
export class Dep {
  constructor(){
    this.id = uid++
    this.subs = []
  }
  addSub(watcher){
    this.subs.push(watcher)
  }

  notify(){
    this.subs.forEach(watcher=>watcher.update())
  }
  // dep 和watcher双向依赖
  depend(){
    if(Dep.target){
      Dep.target.addDep(this)
    }
  }
  
}
// 压栈出栈，当进行渲染的时候进行收集当前的dep
let stack = []

export function pushTarget(watcher){
  Dep.target = watcher
  stack.push(watcher)
}
export function popTarget(){
  stack.pop()
  Dep.target = stack[stack.length-1]
}
export default Dep

