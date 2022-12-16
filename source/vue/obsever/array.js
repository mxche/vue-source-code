//获取原生数组方法
const arrayProto = Array.prototype
//拷贝新的数组原型对象，修改原生方法，
export const arrayMethods = Object.create(arrayProto)

const arrayMethodsPatch = ['push','pop','shift','unshift','splice','sort','revert']


arrayMethodsPatch.forEach(method => {
  arrayMethods[method] = function(...args){
    const result = arrayProto[method].apply(this,args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift': 
      inserted = args
      break;
      case 'splice':
        //splice 存在三个参数，取最后一个参数的值
        inserted = args.slice(2)
      break;
    }
    //对当前添加或者修改的数据，劫持监听下
    if(inserted) ob.observerArray(inserted) 
    //通知订阅dep订阅，更新渲染
    ob.dep.notify()
    return result
  }
});
 