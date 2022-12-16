
let queue  = []
let watcherIds = {}
const callbacks = []



//watcher 等待队列
 export function queueWatcher(watcher){
 let id = watcher.id
 if(!watcherIds[id]){
   watcherIds[id] = true
   queue.push(watcher)
   nextTick(flushQueue)
 }
}

function flushQueue(){
  queue.forEach(watcher=>watcher.run())
  queue=[]
  watcherIds={}
}

function flushCallback(){
  callbacks.forEach(cb=>cb())
}

function nextTick(cb){
  callbacks.push(cb)
  let timeFunc = ()=>{
    flushCallback()
  }
  if(Promise){
    return Promise.resolve().then(timeFunc)
  }
  // 如果promise不支持，用MutationObserver 监听dom变化
  // characterData:true  节点内容或节点文本的变动
  if(MutationObserver){
    const observer = new MutationObserver(timeFunc)
    let textNode = document.createTextNode(1);
    observer.observe(textNode, {characterData:true});
    textNode.textContent = 2; //若文本变为2则会执行上面的observe
    return
  }
  if (setImmediate){
    return setImmediate(timerFunc);
  }
  setTimeout(timeFunc, 0);
}