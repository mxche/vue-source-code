import Vue from 'vue'

const vm = new Vue({
el:'#app',
data(){
  return {
    title:"hello word",
     person:{
      name:'张三',
      age:20,
      desc:"喜欢唱跳rap",
      example:{
        tip:"练习两年半"
      }
     },
  }
},
computed:{
    createPerson({title,person}){
      return title +"---"+ person.name
    },
    num({createPerson}){
      console.log(createPerson,'createPerson----');
      return this.person.age + 10
    }
},
// watch:{
  // 'person.name'(newValue,oldValue){
  //   console.log(oldValue,'>>oldValue');
  //   console.log(newValue,'>>11newValue');
  // },
  // 'person.name':{
  //   handler(newValue,oldValue){
  //   console.log(oldValue,'>>oldValue');
  //   console.log(newValue,'>>11newValue');
  //   },
  //   immediate:true
  // }
// },

})
// vm.title = '123'
// vm.person = '喜欢打篮球'

// vm.arr[0].name = 'hhh'
// vm.person.example.tip = '12121'
// vm.arr.splice(0,1,{name:"替换掉了",title:"hello work",id:2})
// console.log(vm,'arr');
// vm.arr.push({name:'create',title:"hello word",id:5})
// vm.arr.push(2)
// console.log(vm.arr,'arr')
// console.log(vm,'vue instance!!!');

setTimeout(() => {
  vm.person.name = '小明'
  // vm.person.age = 25
}, 1000);
