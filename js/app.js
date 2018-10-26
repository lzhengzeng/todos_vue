(function (window,Vue) {
	// 'use strict';
	
	// Your starting point. Enjoy the ride!
new Vue({
	el:'#app',
	data:{
		dataList:JSON.parse(window.localStorage.getItem('dataList'))||[],
		content:'',
		beforeUpdate:{},
		activeBtn:1,
		showarr:[]
	},
	watch:{
		dataList:{
			handler(newArr){
				window.localStorage.setItem('dataList',JSON.stringify(newArr))
				this.haschange()
			},
			deep:true
		}
	},
	directives: {
		focus:{
			inserted(el){
				el.focus();
			}
		}
	},
	methods: {
		//组装一个对象，把对象添加到数组
		addTodo(){
			if(!this.content.trim()) {
				return;
			}
			this.dataList.push({
				content:this.content.trim(),
				isFinsh:false,
				id:this.dataList.length?this.dataList.sort((a,b)=>a.id-b.id)[this.dataList.length-1]['id']+1:1
			})
			this.content='';
		},
		//删除功能实现
		delTodo(index){
			//根据索引来删除
			this.dataList.splice(index,1);
		},
		//删除所有
		delAlltodo(){
			this.dataList=this.dataList.filter(item => !item.isFinsh)
		},
		//双击显示编辑
		showEdit(i){
			//排他
			this.$refs.show.forEach(item=>{
				item.classList.remove('editing')
			})
			this.$refs.show[i].classList.add('editing')
			this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[i]))
		},
		//编辑
		updateTodo(index){
			if(!this.dataList[index].content.trim()) return this.dataList.splice(index, 1)
			if (this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinsh = false
			this.$refs.show[index].classList.remove('editing')
		},
		haschange(){
			switch (window.location.hash) {
				case '':
				case '#/':
					this.showAll()
					this.activeBtn = 1
					break
				case '#/active':
					this.activeAll(false)
					this.activeBtn = 2
					break
				case '#/completed':
					this.activeAll(true) 
					this.activeBtn = 3
					break
			}
		},
		showAll(){
			this.showarr=this.dataList.map(()=>true)
		},
		activeAll(boo){
			this.showarr = this.dataList.map(item => item.isFinsh === boo)
			if (this.dataList.every(item => item.isFinsh === !boo)) return window.location.hash = '#/'
		}
	},
	computed:{
		activeNum(){
			return this.dataList.filter(item=>!item.isFinsh).length
		},
		toggleAll:{
			get (){
				return this.dataList.every(item => item.isFinsh)
			},
			set (val){
				this.dataList.forEach(item => item.isFinsh = val)
			}
		}
	},
	created(){
		this.haschange();
		
		window.onhashchange=()=>{
			this.haschange();
		}
	}
})
})(window,Vue);
