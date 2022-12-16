export function def (obj ,key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
  getValue(vm,expr){
    const exprArr = expr.split('.')
    return  exprArr.reduce((result,current)=>result[current],vm)
  },
  //通过正则替换当前实例的数据
  compilerText(child,vm){
    if(!child.expr){
      child.expr = child.textContent
    }

    child.textContent = child.expr.replace(defaultRE,function(...args){
      const value = util.getValue(vm,args[1])
      if(typeof value==='object'){
        return JSON.stringify(value)
      }
      return value
    })
  }
}

export function compiler(node,vm){
  const childNodes=  node.childNodes
  childNodes.forEach(child => {
    //1-元素  3-文本
    if(child.nodeType===1){
      //递归调用
      compiler(child,vm)
    }
    else if (child.nodeType == 3) {
      util.compilerText(child,vm); //先写这个
  }
  });

}