<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{loadTitle}}<text style="font-weight: 800;">{{user_realname}}</text></text>
		</view>
		<view v-if="user_realname" style="width: 100%;">
			<button class="login" @click="jumpClassList">同意以下须知并进入</button>
			<button class="exit" @click="exit">退出帐号登录</button>
			<view class="tips">
				<ol start="1">
					<li>开发者微信号（前面有一个下划线）：<span style="font-weight: 800;" @click="copyWx">_xiaoxing1617（点击复制）</span></li>
					<li>为了系统稳定完成刷课操作，系统会缓存您的账号密码，请知晓</li>
					<li>本系统完全免费，禁止使用本系统进行包括但不限于：刷课盈利、违法违规、售卖使用等</li>
					<li>本系统仅供学习交流使用，请勿过渡依赖，如有侵权请联系我们删除</li>
					<li>本系统属于测试阶段，使用即代表愿意承担其程序出错导致的不可抗力后果</li>
					<li>最终解释权归开发者所有</li>
				</ol>
			</view>
		</view>
		<view class="entrance" v-if="!load && !user_realname">
			<form>
				<radio-group @change="typeChange" class="radio">

					<label>
						<radio value="num" :checked="type=='num'" /> 学号登录
					</label>
					<label>
						<radio value="account" :checked="type=='account'" /> 账号登录
					</label>
				</radio-group>

				<input class="input" placeholder-style="color:#FF9594" style="color:#0048FE"
					:placeholder="schoolSelectId?'':'点击选择学校'" disabled="" @click="openSchoolList"
					:value="schoolSelectId?schoolList[schoolSelectId].name:''" />
				<input class="input" v-model="account" :placeholder="'请输入朝明在线登录'+(type=='num'?'学号':'账号')" />
				<input type="password" class="input" v-model="password" placeholder="请输入朝明在线登录密码" />
				<button class="login" @click="login" :style="loginLoading?'opacity: 0.85;':''"
					:loading="loginLoading">{{loginLoading?'正在登录中...':'同意以下须知并登录'}}</button>


				<checkbox-group @change="changeRememberUserLogin">
					<label style="color: #e0e0e0;margin:30rpx 50rpx;font-size: 32rpx;">
						<checkbox :checked="isRememberUserLogin" /> 记住登录信息
					</label>
				</checkbox-group>
			</form>
			<view class="tips">
				<ol start="1">
					<li>开发者微信号（前面有一个下划线）：<span style="font-weight: 800;" @click="copyWx">_xiaoxing1617（点击复制）</span></li>
					<li>为了系统稳定完成刷课操作，系统会缓存您的账号密码，请知晓</li>
					<li>本系统完全免费，禁止使用本系统进行包括但不限于：刷课盈利、违法违规、售卖使用等</li>
					<li>本系统仅供学习交流使用，请勿过渡依赖，如有侵权请联系我们删除</li>
					<li>本系统属于测试阶段，使用即代表愿意承担其程序出错导致的不可抗力后果</li>
					<li>最终解释权归开发者所有</li>
				</ol>
			</view>
		</view>
		<!-- 学校选择 -->
		<uni-popup ref="popup">
			<view style="width: 520rpx;background: #282C35;height: 100%;">
				<liu-indexed-list radius="30%" v-if="schoolList && schoolList.length>0" :dataList="schoolList"
					@click="schoolListClick"></liu-indexed-list>
				<view v-else="" style="text-align: center;padding-top: 200rpx;color: #aaa;">正在拉取中...</view>
			</view>
		</uni-popup>

		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msg.type" :cancelText="msg.close_txt" :confirmText="msg.confirm_txt" title="提示"
				:content="msg.content" @confirm="msg.confirm" @close="msg.close"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadTitle:"正在验证登录...",
				load:true,
				isRememberUserLogin: true,
				loginLoading: false,
				schoolList: [],
				APP: getApp(),
				schoolSelectId: 0,
				type: "num",
				account: "",
				password: "",
				msg: {
					type: "error",
					content: "",
					confirm() {},
					close() {},
					confirm_txt: "知道了",
					close_txt: "关闭",
				},
				user_realname:null,
			}
		},
		onShow() {
			let _this = this;
			this.APP.getUserInfo().then((data) => {
				console.log(data)
				this.user_realname = data.realname
				this.loadTitle = "欢迎回家，";
			}).catch((error) => {
				
				this.loadTitle = "Hello，欢迎使用";
					this.load = false;
							let user_login = uni.getStorageSync('user_login');
							if (user_login && user_login?.account) {
								uni.request({
									url: this.APP.globalData.basicUrl + "/Index/getSchoolList",
									success: (res) => {
										if (res.data && res.data?.code && res.data.code * 1 === 1) {
											let data_list = [];
											res.data.data.forEach(function(element) {
												element.phone = "学生数:" + element.studentCount;
												element.img = "/static/logo.png";
												data_list[element.id] = element;
											});
											this.schoolList = data_list;
				
				
											this.account = user_login.account
											this.password = user_login.password
											this.type = user_login.type
											this.schoolSelectId = user_login.school_id
										}
									}
								})
							} else {
								uni.getStorageSync('user_login', null);
							}
  })
		},
		methods: {
			copyWx(){
			  uni.setClipboardData({
			        data: "_xiaoxing1617",
			        success: () => {
			          uni.showToast({
			            title: '复制成功',
			            icon: 'success'
			          });
			        },
			        fail: () => {
			          uni.showToast({
			            title: '复制失败',
			            icon: 'none'
			          });
			        }
			      });	
			},
			/**
			 * 记住登录信息
			 */
			changeRememberUserLogin(e) {
				if (e.detail.value.length >= 1) {
					this.isRememberUserLogin = true;
				} else {
					this.isRememberUserLogin = false;
				}
			},
			/**
			 * 退出登录
			 */
			exit(){
				uni.setStorageSync('login_token', null);
				window.location.reload();
			},
			/**
			 * 登录
			 */
			login() {
				let _this = this;
				if (this.loginLoading) {
					return;
				}
				this.loginLoading = true;
				uni.request({
					url: this.APP.globalData.basicUrl + "/User/login",
					data: {
						type: this.type,
						account: this.account,
						password: this.password,
						school_id: this.schoolSelectId,
					},
					success: (res) => {
						this.loginLoading = false;
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							let confirm = function() {
								_this.jumpClassList()
							};
							this.msg.type = "success";
							this.msg.content = res.data.msg;
							this.msg.confirm_txt = "进入系统";
							this.msg.close_txt = "好的";
							this.msg.confirm = confirm;
							this.msg.close = confirm;
							this.$refs.alertDialog.open()
							if (this.isRememberUserLogin) {
								uni.setStorageSync('user_login', {
									account: this.account,
									password: this.password,
									school_id: this.schoolSelectId,
									type: this.type,
								});
							} else {
								uni.setStorageSync('user_login', null);
							}
							uni.setStorageSync('login_token', res.data.data.XY_SYSTEM_USER_TOKEN);
						} else {
							this.msg.type = "error";
							this.msg.content = res.data.msg;
							this.$refs.alertDialog.open()
							console.error(res);
						}
					},
					fail: (res) => {
						this.loginLoading = false;
						this.msg.type = "error";
						this.msg.content = "系统繁忙";
						this.$refs.alertDialog.open()
						console.error(res);
					},
				})
			},
			/**
			 * 切换登录方式
			 */
			typeChange(e) {
				this.type = e.detail.value;
			},
			/**
			 * 跳转课程页面
			 */
			jumpClassList(){
				uni.navigateTo({
				  url: '/pages/classList/classList'
				});
			},
			/**
			 * 选择学校
			 */
			schoolListClick(e) {
				this.$refs.popup.close();
				this.schoolSelectId = e.id;
			},
			/**
			 * 获取学校列表
			 */
			openSchoolList() {
				console.log("openSchoolList")
				this.$refs.popup.open("right");
				uni.request({
					url: this.APP.globalData.basicUrl + "/Index/getSchoolList",
					success: (res) => {
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							let data_list = [];
							res.data.data.forEach(function(element) {
								element.phone = "学生数:" + element.studentCount;
								element.img = "/static/logo.png";
								data_list[element.id] = element;
							});
							this.schoolList = data_list;
						} else {
							this.$refs.popup.close();
							this.msg.type = "error";
							this.msg.content = res.data.msg;
							this.$refs.alertDialog.open()
							console.error(res);
						}
					},
					fail: (res) => {
						this.$refs.popup.close();
						this.msg.type = "error";
						this.msg.content = "系统繁忙";
						this.$refs.alertDialog.open()
						console.error(res);
					},
				})
			}
		}
	}
</script>

<style>
	page {
		width: 100%;
		background: #1C2025;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0 50rpx;
		padding-bottom: 100px;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.input {
		background: #282C35;
		border-radius: 20rpx;
		padding: 20rpx 50rpx;
		color: #e0e0e0;
		margin-bottom: 20rpx;
		text-align: center;
		font-size: 35rpx;
	}

	.tips {
		margin-top: 20rpx;
		color: #a0a0a0;
		font-size: 30rpx;
	}

	.login {
		margin-top: 30rpx;
		margin-bottom: 20rpx;
		border-radius: 50rpx;
		color: #eee;
		background: #0048FE;
		width: 100%;
		font-size: 35rpx;
		font-weight: 800;
	}
	.exit{
		margin-top: 30rpx;
		margin-bottom: 20rpx;
		border-radius: 50rpx;
		color: #000;
		background: #eee;
		width: 100%;
		font-size: 35rpx;
		font-weight: 800;
	}

	.radio {
		text-align: center;
		color: #e0e0e0;
		margin-bottom: 20rpx;
		font-size: 32rpx;
	}

	.radio>label {
		margin: 0 20rpx;
	}
</style>