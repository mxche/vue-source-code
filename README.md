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
- vue/index.js vue入口文件,创建Vue 实例对象，挂载原型
- vue/instance/init.js vue初始工作
- vue/obsever/index.js 数据劫持-观察者
- proxy 数据代理，当访问vm.title 时候，自动找到vm._data.title

#### 数组劫持
- vue/obsever/array.js 对数组的部份方法进行拦截处理
- observerArray 把处理数组的方法挂载到每个数据的Observer,
- 使其在操作数据的以后可以拿到这个方法，触发对添加的数据的观察
- vue只会对添加的数组对象进行观察劫持，基本数据类型不会劫持如：vm.arr[1].a = 20 不会触发set方法
- 需要在Observer对象构造器中添加数组项的递归劫持(dependArray) 

#### 模版编译
- 通过模版编译，替换{{xxx}}为data中定义的值
- 利用正则进行匹配{{}},进行内容替换
- 通过reduce方法，一层层查找多层对象 例：vm.person.tips.name ...
#### 数据驱动--发布订阅者模式
- 1.首先进行初始化，给每一个响应式属性增加一个dep和watcher（vu2 中一个组件对应一个watcher）
- 2.一个属性有多个 子属性，就会生成多个watcher,每一个属性都引用了Dep
- 3.一个响应式属性只有一个dep，一个dep中可能包含多个watcher（渲染watcher和watch方法）
- 4.一个watcher中可能包含多个dep，组件中包含多个{{xxx}},其中一个修改就会触发diff算法更新
- 5.dep.js 进行收集渲染watcher，进行发布和订阅,一个{{xxx}}可能有多个watcher
- 6.初始化渲染过程：
==> vue/index new Watcher
==> 触发get方法==>pushTarget-压栈
==> watcher.getter()-触发compiler()
==> reduce触发Object.defineProperty的数据get
==> 把当前dep添加到Dep.target中，同时Dep.target也添加到dep中，实现双向依赖
==> popTarget-出栈
- 7.更新过程： 
==> 触发Object.defineProperty的数据set
==> 触发dep的notify-通知所有依赖的的watcher更新
==> 触发Watcher.get方法==>pushTarget-压栈
==> watcher.getter()-触发compiler()
==> reduce触发Object.defineProperty的数据get 
==> 把当前dep添加到Dep.target中，同时Dep.target也添加到dep中，实现双向依赖
==> popTarget-出栈
#### 模版异步批量更新
- 问题：对于同一个任务队列中，修改相同的属性多次，会有多个渲染watcher，同时也会造成多次更新
- 解决方案：创建一个微任务队列，收集需要更新的渲染watcher，保存不同id的渲染watcher数组，
- 最后通过微任务遍历执行队列的方法进行更新
#### watch实现原理
- 同样也是通过Watcher实现，不同于渲染Watcher,只进行数据的更新
- 在Watcher保存一个值，下次渲染出发watcher时候触发get,和新旧值对比来进行调用callback
#### computed实现原理
- watcher三大种类：渲染watcher，用户watcher，计算watcher
- 把当前的属函数名称当作属性用，通过Object.defineProperty()定义属性，当取值的时候触发函数执行
- 计算属性默认不执行，与渲染watcher无关，只与计算watcher有关（引用了计算属性，或者修改了依赖才执行）
- 通过watcher的dirty属性来控制是否执行函数
- 问题：修改计算属性的引用类型的值，不会更新计算属性本身？
- 渲染更新流程： 触发set()==>dep通知==>执行渲染watcher
- 计算属性流程： 触发set()==>dep通知==>执行计算watcher
- 解决：计算属性不会触发渲染watcher，需要将计算属性的watcher和渲染watcher进行关联
- 如何关联，当执行完成计算watcher后，指针会指向渲染watcher（Dep.target = stack[stack.length-1]）
==> 计算属性watcher-->收集依赖deps-->执行引用属性的dep.depend()-->将当前的dep.target进行压栈
- 修改计算属性中引用的属性的时候：
==> 修改引用类型-->set()-->dep-->[渲染watcher,计算watcher]执行计算watcher-->当执行完计算属性后会进行出栈，指针重新指向渲染watcher
-->让当前的计算属性中的引用类型关联到渲染watcher中-->然后进行渲染操作的时候当前的watcher的getter就是_update()，从而更新页面

