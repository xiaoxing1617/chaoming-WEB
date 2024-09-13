<script>
	import Vue from 'vue'
	export default {
		globalData: {
			basicUrl: "https://chaoming.96xy.cn/api",
			// basicUrl: "http://127.1.0.4",
			lossChildrens: [],
			pageIndex: 1,
			lossChildrenImgUrl: "https://res.crotg.com/",
			wx:"_xiaoxing1617",
			phone:"15305434384",
		},
		onLaunch: function() {
			uni.loadFontFace({
				global: true,
				family: 'No.308-ShangShouJiSuTi-2',
				source: 'url("https://chaoming.96xy.cn/public/static/font/cm.ttf")',
				success() {
					console.log('success')
				},
				fail(e) {
					console.log('fail', e)
				}
			})
			console.log('App Launch')
			if (uni.canIUse('getMenuButtonBoundingClientRect')) {
				this.globalData.menuButtonBoundingClientRect = uni.getMenuButtonBoundingClientRect();
			} else {
				this.globalData.menuButtonBoundingClientRect = {
					width: 0,
					height: 0,
					left: 0,
					top: 16,
					right: 0
				}
			}

			this.getUserSystem().then((res) => {
				this.request({
					url: "/Index/access",
					method: "POST",
					data: res,
				})
			})

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			getUserSystem() {
				let _this = this;
				return new Promise(async (resolve, reject) => {
					let locationInfo = await new Promise((resolve, reject) => {
						uni.getLocation({
							type: 'wgs84',
							success: function(res) {
								resolve(res);
							},
							fail: function(err) {
								resolve({});
							}
						});
					});

					let loginCode = await new Promise((resolve, reject) => {
						uni.login({
							provider: 'weixin', //使用微信登录
							success: (res) => {
								resolve(res.code);
							},
							fail: function(err) {
								resolve("");
							}
						})
					});


					resolve({
						systemInfo: uni.getSystemInfoSync(),
						loginCode,
						locationInfo,
					});
				})
			},
			request(obj) {
				obj.url = this.globalData.basicUrl + obj.url;
				obj.data = {
					...obj.data,
					// token: this.getLoginToken()
				}
				obj.header = {
					...obj.header,
					"Authorization": this.getLoginToken(),
				};
				uni.request(obj);
			},
			getLoginToken() {
				let login_token = uni.getStorageSync('login_token');
				if (!login_token) {
					login_token = "";
					uni.setStorageSync('login_token', null);
				}
				return login_token;
			},
			/**
			 * 获取用户信息
			 */
			getUserInfo() {
				let _this = this;
				return new Promise((resolve, reject) => {
					let login_token = uni.getStorageSync('login_token');
					if (!login_token) {
						reject("请先登录");
					}

					this.request({
						url: "/User/getUserInfo",
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

<style lang="scss">
	/*每个页面公共css */
	@font-face {
		font-family: 'No.308-ShangShouJiSuTi-2';
		src: url('https://chaoming.96xy.cn/public/static/font/cm.ttf');
	}

	.wx-public-account {
		text-align: center;
		color: #0867CE;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		margin: 0.3rem auto;
		border: 2px solid #0867CE;
		border-radius: 0.5rem;
	}

	.wx-public-account>view {
		width: 9rem;
		height: 9rem;
		margin: 0rem auto;
		margin-top: 0.5rem;
	}

	.wx-public-account>view>image {
		width: 100%;
		height: 100%;
	}

	.x-text {
		font-size: 20rpx;
		display: inline-block;

		&.block {
			display: block;
		}

		&.bold {
			font-weight: 800;
		}

		&.center {
			text-align: center;
		}
		
		&.right {
			text-align: right;
		}
		
		&.left {
			text-align: left;
		}

		&.ellipsis {
			word-wrap: normal;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			overflow: hidden; //隐藏超出部分
			text-overflow: ellipsis; //显示省略号
			-webkit-line-clamp: 1;
		}
	}
</style>