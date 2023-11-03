<script>
	export default {
		globalData: {
			basicUrl: "https://chaoming.96xy.cn/api",
			// basicUrl: "http://127.1.0.4",
			lossChildrens:[],
			pageIndex:1,
			lossChildrenImgUrl:"https://res.crotg.com/",
		},
		onLaunch: function() {
			console.log('App Launch')
			this.getLossChildrens();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			/**
			 * 获取一个随机的失踪儿童数据
			 */
			getItemLossChildren(){
				console.log("getItemLossChildren");
				let lossChildrens = this.globalData.lossChildrens;
				if(lossChildrens && lossChildrens.length>=1){
					// 生成一个随机索引
					const randomIndex = Math.floor(Math.random() * lossChildrens.length);
					// 使用随机索引来获取随机元素
					const randomElement = lossChildrens[randomIndex];
					return randomElement;
				}else{
					return false;
				}
			},
			/**
			 * 获取失踪儿童列表数据
			 */
			getLossChildrens(){
				uni.request({
					url: "https://api.crotg.com/app/suspectedLossChildren/getChildrenByType?type=3&gender=-1&pageIndex="+this.globalData.pageIndex,
					method:"POST",
					// data: {
					// 	type: 3,  //这个不太清楚，3应该是现有失踪人口数据
					// 	gender:-1,  //-1应该是不限性别
					// 	pageIndex:1,  //页码
					// },
					success: (res) => {
						const mergedArray = this.globalData.lossChildrens.concat(res.data.data.SuspectedLossChildrens);
						this.globalData.lossChildrens = mergedArray;
						let page = this.globalData.pageIndex;
						this.globalData.pageIndex = this.globalData.pageIndex+1;
						if(res.data.data.totalPages>page && page<5){
							this.getLossChildrens();
						}
						console.log("crotg.com",mergedArray)
					},
				})
			},
			/**
			 * 获取用户信息
			 */
			getUserInfo() {
				let _this = this;
				return new Promise((resolve, reject) => {
				    let login_token = uni.getStorageSync('login_token');
					console.log("login_token",login_token)
					if (!login_token) {
						uni.setStorageSync('login_token', null);
						reject("请先前往登录！");
					}
					uni.request({
						url: _this.globalData.basicUrl + "/User/getUserInfo",
						data:{
							token:login_token
						},
						success: (res) => {
							if (res.data && res.data?.code && res.data.code * 1 === 1) {
								resolve(res.data.data);
							} else {
								uni.setStorageSync('login_token', null);
								reject(res.data.msg);
							}
						},
						fail() {
							uni.setStorageSync('login_token', null);
							reject("系统繁忙");
						}
					})
				});


			},
		}
	}
</script>

<style>
	/*每个页面公共css */
	.uni-radio-input,
	.uni-checkbox-input {
		background: #4B5364 !important;
		border: 1px solid #21252B !important;
	}

	.uni-radio-input-checked,
	.uni-checkbox-input-checked {
		background-color: rgb(0, 72, 254) !important;
		border-color: rgb(0, 72, 254) !important;
	}

	.uni-checkbox-input-checked::before {
		color: #fff !important;
	}

	.uni-popup-dialog {
		background: #21252B !important;
	}

	.uni-dialog-button-group {
		border-top-color: #333 !important;
	}

	.uni-border-left {
		border-left-color: #333 !important;
	}

	.uni-dialog-button-text {
		color: #eee !important;
	}

	.uni-button-color {
		color: #0867CE !important;
	}

	.uni-dialog-content-text {
		color: #aaa !important;
	}


	.uni-scroll-view-content {
		background: #282C35 !important;
	}

	.left-item-title {
		color: #aaa !important;
	}

	.left-item-card {
		background: #21252B !important;
	}

	.left-item-card-info {
		border-bottom: 1px solid #333 !important;
	}

	.left-item-card-name {
		color: #eee !important;
	}

	.liu-search {
		background: #21242D !important;
		border: none !important;
	}

	.liu-input {
		background: #111316 !important;
	}

	.liu-input .uni-input-input {
		color: #eee !important;
	}

	.liu-scroll-right-name {
		color: #eee !important;
	}

	.liu-list {
		background: #21242D !important;
	}

	.left-item-card .img-info {
		border: solid #555 1px !important;
	}
	.uni-collapse,.uni-collapse-item__title-box{
	    background: #21242D !important;
	}
	.uni-collapse-item__title-box{
		color: #eee !important;
	}
	.uni-collapse-item__wrap{
	    background: #282C35 !important;
	}
	.uni-collapse-item--border{
	    border-bottom: #2C2F37 solid 1px !important;
	}
	.uni-collapse-item-border{
		border-bottom: 1px #333 solid !important;
		height: 127rpx !important;
	}
	.wx-public-account{
		text-align: center;
		color: #0867CE;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		margin: 0.3rem auto;
		border: 2px solid #0867CE;
		border-radius: 0.5rem;
	}
	.wx-public-account>view{
		width: 9rem;
		height: 9rem;
		margin: 0rem auto;
		margin-top: 0.5rem;
	}
	.wx-public-account>view>image{
		width: 100%;
		height: 100%;
	}
</style>