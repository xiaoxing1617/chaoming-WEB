<template>
	<view class="main">
		<view class="background">
			<view style="width: 200rpx;height: 200rpx;background: #f00;top:0;left: 0;"></view>
			<view style="width: 100rpx;height: 100rpx;background: #00f;top:250rpx;left: 150rpx;"></view>
			<view style="width: 100rpx;height: 100rpx;background: #0f0;top:550rpx;right: 0rpx;"></view>
			<view style="width: 130rpx;height: 130rpx;background: #00f;top:1000rpx;left: 0rpx;"></view>
		</view>
		<view class="content">
			<view class="logo"
				:style="{marginTop:(menuButtonBoundingClientRect.top+menuButtonBoundingClientRect.height)+'px'}">
				<image mode="aspectFill" src="/static/logo.png"></image>
			</view>
			<view class="entrance">
				<form>
					<view :class="'radio-view '+type">
						<view class="checked"></view>
						<view @click="type='num'" class="num">学号登录</view>
						<view @click="type='account'" class="account">账号登录</view>
					</view>

					<view @click="openSchoolList" class="input"
						:style="{color:schoolSelectId?'#0048FE;':'#EF4E77',padding:'22rpx 50rpx'}">
						{{schoolName}}
					</view>
					<input class="input" v-model="account" :placeholder="'朝明在线'+(type=='num'?'学号':'账号')" />
					<input type="password" class="input" v-model="password" placeholder="朝明在线密码" />

					<x-text :size="26" value="登录遇到问题？" @tap="openLoginTipsShow" block color="#0048FE" right></x-text>

					<button class="login" @click="login">
						<u-icon name="hourglass-half-fill" color="#fff" size="36" v-if="loginLoading"></u-icon>
						<u-icon v-else name="arrow-right" color="#fff" size="36"></u-icon>
					</button>

					<view
						style="bottom: 40rpx;text-align: center;position: fixed;display: flex;justify-content: center;width: 80%;color:#aaa;font-size: 28rpx;font-weight: 800;">
						<label @click="agreement=!agreement">
							<radio color="#0048FE" :checked="agreement"></radio> 同意<span style="color: #0048FE;"
								@click.stop="agreementPopup=true">用户使用协议</span>
						</label>
					</view>


				</form>
			</view>
			<!-- 学校选择 -->
			<u-popup mode="right" v-model="popup.show">
				<view style="width: 520rpx;height: 100%;">
					<liu-indexed-list radius="30%" v-if="schoolList && schoolList.length>0" :dataList="schoolList"
						@click="schoolListClick"></liu-indexed-list>
					<view v-else="" style="text-align: center;padding-top: 200rpx;color: #aaa;">正在拉取中...</view>
				</view>
			</u-popup>

			<!-- 登录中转 -->
			<u-popup :closeable="false" :mask-close-able="false" v-model="loginPopup.show" :z-index="10076"
				mode="bottom" border-radius="22" width="100%">
				<view style="padding: 35rpx 20rpx;">
					<view v-if="loginPopup.ad">
						<u-image @click="loginPopupAdClick" :show-menu-by-longpress="false" width="100%" height="260rpx"
							:src="loginPopup.ad.image" mode="aspectFill" border-radius="10"></u-image>
					</view>
					<view v-else
						style="display: flex;justify-content: center;align-items: center;height: 260rpx;border:solid 1px #eee;border-radius: 20rpx;">
						<view class="height-title man">
							<span>朝明辅助</span>
						</view>
					</view>

					<x-text :margin="[17,0,20,0]" :ellipsis="3" :size="35" center :value="loginPopup.content"
						color="#000" style="border-bottom: solid #dcdfe6 2rpx;" block="" bold=""></x-text>
					<view style="padding: 0 10rpx;display: flex;justify-content: center;margin-bottom: 5rpx;"
						v-if="loginPopup.switch">
						<u-switch v-model="isRememberUserLogin" active-color="#0048FE" :size="35"></u-switch>
						<view style="margin-left: 10rpx;color: #aaa;font-size: 28rpx;">记住登录信息</view>
					</view>

					<u-button @click="loginPopup.confirm()" :loading="loginLoading" :disabled="loginLoading"
						shape="circle" type="primary" fill
						:custom-style="{marginTop:'8rpx',background:'#0048FE',width: '100%',color:'#fff'}">{{loginPopup.buttonText}}</u-button>

				</view>
			</u-popup>

		</view>

		<!-- 协议 -->
		<u-popup v-model="agreementPopup" closeIconPos="bottom-right" mode="left" closeable :closeIconSize="42">
			<view
				:style="{paddingTop:(menuButtonBoundingClientRect.top+menuButtonBoundingClientRect.height)+'px',paddingLeft:'12rpx',paddingRight:'12rpx'}">
				<u-parse :html="agreementContent" :selectable="true"></u-parse>
			</view>
		</u-popup>

		<!-- 登录遇到问题 -->
		<u-popup v-model="loginTipsShow" mode="bottom" closeable border-radius="20">
			<scroll-view scroll-y style="height: 500px;overflow-y: scroll;">

				<x-text :size="35" :margin="[30,0,15,0]" value="常用功能" bold block color="#000" center></x-text>
				<u-grid :col="3" style="margin:2 2 15rpx 15rpx;">
					<u-grid-item @click="copyWx">
						<u-icon name="weixin-fill" :size="51"></u-icon>
						<view class="grid-text">复制客服微信</view>
					</u-grid-item>
					<u-grid-item @click="callPhone">
						<u-icon name="phone-fill" :size="50"></u-icon>
						<view class="grid-text">拨打客服电话</view>
					</u-grid-item>
					<u-grid-item @click="clearLogin">
						<u-icon name="trash-fill" :size="50"></u-icon>
						<view class="grid-text">清除登录信息</view>
					</u-grid-item>
				</u-grid>

				<x-text :size="35" :margin="[30,0,15,0]" value="常见问题" bold block color="#000" center></x-text>

				<view v-for="(item,index) of loginTipsList" style="margin: 15rpx 10rpx 25rpx 25rpx;">
					<u-section :title="item.title" :right="false" bold font-size="30"></u-section>
					<u-read-more :toggle="true" ref="uReadMore" show-height="175" text-indent="10rpx">
						<rich-text :nodes="item.content"></rich-text>
					</u-read-more>

					<u-line color="#e0e0e0" margin="10rpx 25rpx 0 0" length="90%"></u-line>
				</view>
			</scroll-view>
		</u-popup>

		<xingCommon ref="xingCommon" />
	</view>
</template>
<script>
	const APP = getApp();
	export default {
		data() {
			return {
				loginPopup: {
					show: false,
					content: "",
					buttonText: "登录中...",
					switch: false,
					confirm() {},
					ad: null,
				},
				loginTipsShow: false,
				loginTipsList: [{
						title: "登录成功之后，我应该选择记住信息还是不记住直接进入？",
						content: "如果您选择记住信息，那么下次使用此设备打开我们的软件时，将会自动填写上次填写记住的账号密码和学校信息，但如果使用另外一个手机设备就需要再次输入账号密码了。如果选择不记住直接进入，同理，仅作为此次临时登录，如果登录失效还需要您重新输入账号密码登录进入系统！",
					},
					{
						title: "什么是登录失效，失效会怎么样？",
						content: "登录失效是指您本次登录之后，在一定的时间之内使用此手机设备直接打开软件就自动登录上了，无需反复输入账号密码登录。为了保证您的账号安全性，我们会在一定的时间后将您已登录的手机设备失效处理，失效并不会注销删除您的账号，仅是需要您重新再登录一下。",
					},
					{
						title: "忘记了密码怎么办？",
						content: "请前往登录“朝明在线”平台（https://pt.jinkex.com/app2/login）->忘记密码->按照要求填写信息->验证手机号->获得最新的密码。如有疑问可联系客服！",
					},
					{
						title: "提示几分钟内禁止登录？",
						content: "您可能是过于频繁的登录系统了，此项限制由朝明在线的规则，出于账号安全考虑，您在一定时间内多次输入错误密码登录才会触发。可以尝试稍后重试，并不是您的账号被封禁了。",
					},
					{
						title: "密码是由什么组成的？",
						content: "除了系统初始默认密码或者重置的密码以外，密码都是由包含大写字母、小写字母、数字和特殊符号（指.-*/+#&@等）。例如：Zhang666& 就是复杂密码",
					},
					{
						title: "点击登录按钮之后出现白色空白提示？",
						content: "可能是系统正在升级或者系统出现了问题，如果遇到此问题请及时联系我们反馈，感谢！我们将竭尽全力快速响应解决您的问题！",
					},
					{
						title: "一直提示账号密码错误，但确定输入正确了？",
						content: "遇到此问题不要着急，请先慢慢想想是不是大小写或者符号错了或少了，如果实在想不起来或者登录不上，您也可以重新忘记密码重置密码，前往登录“朝明在线”平台（https://pt.jinkex.com/app2/login）->忘记密码->按照要求填写信息->验证手机号->获得最新的密码。",
					},
					{
						title: "登录之后我的账号密码会被泄露吗？",
						content: "本程序严格遵守相关法律法规，最大限度保证您的数据安全及密码不被泄露。此外，为了您能稳定的完成刷课、刷作业等等操作，本程序会储存您的账号密码，作为在程序执行时或特定紧急情况下使用并操作，请知晓！同时，您也可以联系我们清除您在本程序内及服务端储存的隐私数据信息，致力于最大限度保障您的权益！",
					},
				],

				agreementContent: `
				<div style="text-align: center;font-size: 33rpx;font-weight: 800;color: #0048FE;">用户使用协议</div>
				<div class="tips">
					<ol start="1">
						<li>开发者微信号：<span style="font-weight: 800;">${APP.globalData.wx}（长按复制）</span>
						</li>
						<li>为了系统稳定完成刷课操作，系统会缓存您的账号密码，请知晓</li>
						<li>本系统完全免费，禁止使用本系统进行包括但不限于：刷课盈利、违法违规、售卖使用等</li>
						<li>本系统仅供学习交流使用，请勿过渡依赖，如有侵权请联系我们删除</li>
						<li>本系统属于测试阶段，使用即代表愿意承担其程序出错导致的不可抗力后果</li>
						<li>最终解释权归开发者所有</li>
					</ol>
				</div>
				`,
				autoFill: false,
				menuButtonBoundingClientRect: APP.globalData.menuButtonBoundingClientRect,
				agreementPopup: false,
				popup: {
					show: false,
				},
				isRememberUserLogin: true,
				loginLoading: true,
				schoolList: [],
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
				agreement: false,
			}
		},
		computed: {
			schoolName() {
				if (this.schoolList && this.schoolSelectId) {
					let obj = this.schoolList.find(item => item.id == this.schoolSelectId);
					return obj.name
				} else {
					return '点击选择学校'
				}
			}
		},
		onShareAppMessage(res) {
			return APP.globalData.shareObj
		},
		onShareTimeline(res) {
			return APP.globalData.shareObj
		},
		onLoad() {
			this.$nextTick(() => {
				this.$x = this.$refs.xingCommon;
			})
			//获取广告数据
			APP.getAdData().then((data) => {
				console.log("获取广告数据", data);
				if (data.loginPopupAd) {
					this.loginPopup.ad = data.loginPopupAd;
				}
			})
		},
		onShow() {
			let _this = this;
			this.loginLoading = true;
			this.loginPopup.switch = false;
			this.loginPopup.show = true;
			this.loginPopup.content = "正在校验当前登录信息是否过期";
			this.loginPopup.buttonText = "自动登录中...";
			this.loginPopup.confirm = () => {};

			APP.getUserInfo().then((data) => {
				this.$nextTick(() => {
					this.loginLoading = false;

					this.loginPopup.switch = false;
					this.loginPopup.show = true;
					this.loginPopup.content = "您已登录！欢迎回家，" + data.realname;
					this.loginPopup.buttonText = "进入首页";
					this.loginPopup.confirm = () => {
						_this.jumpClassList()
					};
				})
			}).catch((error) => {
				let user_login = uni.getStorageSync('user_login');
				if (user_login && user_login?.account) {
					APP.request({
						url: "/Index/getSchoolList",
						success: (res) => {
							if (res.data && res.data?.code && res.data.code * 1 === 1) {
								let data_list = [];
								res.data.data.forEach(function(element) {
									element.phone = "学生数:" + element.studentCount;
									element.img = "/static/logo.png";
									data_list.push(element)
								});
								this.schoolList = data_list;

								this.$nextTick(() => {
									this.loginLoading = false;

									this.loginPopup.switch = false;
									this.loginPopup.show = true;
									this.loginPopup.content = "当前登录信息已失效，请重新登录！";
									this.loginPopup.buttonText = "好的";
									this.loginPopup.confirm = () => {
										console.log("confirm");
										this.loginPopup.show = false;
									};

									if (!this.autoFill) {
										this.autoFill = true;
										this.account = user_login.account
										this.password = user_login.password
										this.type = user_login.type
										this.schoolSelectId = user_login.school_id * 1
										this.agreement = new Boolean(user_login.school_id)
									}
								})

							} else {
								this.loginPopup.show = false;
								this.loginLoading = false;
							}
						},
						fail: () => {
							this.loginPopup.show = false;
							this.loginLoading = false;
						}
					})
				} else {
					this.loginPopup.show = false;
					this.loginLoading = false;
					uni.getStorageSync('user_login', null);
				}
			})
		},
		methods: {
			loginPopupAdClick() {
				if (this.loginPopup.ad.weburl) {
					uni.navigateTo({
						url: "/pages/webview/webview?src=" + encodeURIComponent(this.loginPopup.ad.weburl)
					});
				}
			},
			clearLogin() {
				this.$x.openModal({
					showTitle: true,
					title: "清除登录信息",
					content: "您确定要清除当前设备记住的登录信息（账号/密码/学校）吗？清除并不是销毁注销您的账号，而是在本设备下记住的账号密码被会清除，不会自动填写了。下次使用本设备登录时需要重新输入账号密码才可以完成登录。",
					confirmText: "确认清除",
					cancelText: "取消",
					showCancelButton: true,
					zIndex: 10076,
					confirm: () => {
						this.account = ""
						this.password = ""
						this.type = 'num'
						this.schoolSelectId = 0
						this.agreement = false;
						uni.setStorageSync('user_login', null);
						this.loginTipsShow = false
					},
					cancel() {

					},
				})

			},
			copyWx() {
				//复制微信号
				uni.setClipboardData({
					data: APP.globalData.wx
				});
			},
			callPhone() {
				//拨打电话
				uni.makePhoneCall({
					phoneNumber: APP.globalData.phone
				});
			},
			openLoginTipsShow() {
				console.log("loginTipsShow")
				this.loginTipsShow = true;
				this.$nextTick(() => {
					this.$refs.uReadMore.forEach((item, index) => {
						item.init();
					})
				})
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
			 * 登录
			 */
			login() {
				let _this = this;

				if (this.loginLoading) {
					return;
				}
				if (!this.agreement) {
					this.$x.toast({
						title: '请先勾选用户使用协议',
					})
					return;
				}
				if (this.type != "num" && this.type != "account") {
					this.$x.toast({
						title: '请正确选择登录方式',
					})
					return;
				}
				if (!this.schoolSelectId) {
					this.$x.toast({
						title: '请选择一个学校',
					})
					return;
				}
				if (!this.password || !this.account) {
					this.$x.toast({
						title: '请输入账号密码',
					})
					return;
				}
				this.loginLoading = true;
				this.loginPopup.switch = false;
				this.loginPopup.show = true;
				this.loginPopup.content = "";
				this.loginPopup.buttonText = "登录中...";
				this.loginPopup.confirm = () => {};

				APP.getUserSystem(true).then((user_system) => {


					APP.request({
						url: "/User/login",
						method: "POST",
						data: {
							type: _this.type,
							account: _this.account,
							password: _this.password,
							school_id: _this.schoolSelectId,
							user_system,
						},
						success: (res) => {
							_this.loginLoading = false;
							if (res.data && res.data?.code && res.data.code * 1 === 1) {

								_this.loginPopup.switch = true;
								_this.loginPopup.show = true;
								_this.loginPopup.content = "登录成功！";
								_this.loginPopup.buttonText = "进入首页";
								_this.loginPopup.confirm = () => {
									if (_this.isRememberUserLogin) {
										//记住信息
										uni.setStorageSync('user_login', {
											account: _this.account,
											password: _this.password,
											school_id: _this.schoolSelectId,
											type: _this.type,
											agreement: true,
										});
									} else {
										uni.setStorageSync('user_login', null);
									}
									_this.jumpClassList()
								};
								uni.setStorageSync('login_token', res.data.data
									.XY_SYSTEM_USER_TOKEN);
							} else {
								_this.loginPopup.switch = false;
								_this.loginPopup.show = true;
								_this.loginPopup.content = res.data.msg;
								_this.loginPopup.buttonText = "关闭";
								_this.loginPopup.confirm = () => {
									_this.loginPopup.show = false;
								};
							}
						},
						fail: (res) => {
							_this.loginLoading = false;
							_this.loginPopup.switch = false;
							_this.loginPopup.show = true;
							_this.loginPopup.content = "系统繁忙";
							_this.loginPopup.buttonText = "关闭";
							_this.loginPopup.confirm = () => {
								_this.loginPopup.show = false;
							};
						},
					})

				});

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
			jumpClassList() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			/**
			 * 选择学校
			 */
			schoolListClick(e) {
				this.popup.show = false;
				this.schoolSelectId = e.id;
			},
			/**
			 * 获取学校列表
			 */
			openSchoolList() {
				this.popup.show = true;
				APP.request({
					url: "/Index/getSchoolList",
					success: (res) => {
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							let data_list = [];
							res.data.data = res.data.data.filter(item => item !== undefined && item !== null &&
								item !== "");

							res.data.data.forEach(function(element) {
								element.phone = "学生数:" + element.studentCount;
								element.img = "/static/logo.png";
								data_list.push(element);
							});

							this.schoolList = data_list;
						} else {
							this.popup.show = false;
							this.$x.openModal({
								content: res.data.msg,
								confirmText: "确定",
							})
						}
					},
					fail: (res) => {
						this.popup.show = false;
						this.$x.openModal({
							content: "系统繁忙，请稍后重试！",
							confirmText: "确定",
						})
					},
				})
			}
		}
	}
</script>

<style>
	@keyframes rotate {
		from {
			transform: translate(-10%, -20%) rotate(0deg);
		}

		to {
			transform: translate(-20%, -10%) rotate(360deg);
		}
	}

	page {
		width: 100%;
		height: 100%;
	}

	.main {
		width: 100%;
		position: relative;
	}

	.content {
		width: 80%;
		height: 100%;
		padding: 65rpx 0rpx;
		position: absolute;
		color: #000;
		left: 10%;
	}

	.background {
		width: 100%;
		height: 100%;
		background: #eeeff0;
		opacity: 0.9;
		filter: blur(50px);
		position: absolute;
	}

	.background view {
		border-radius: 50%;
		position: absolute;
		animation: rotate 0.8s linear infinite alternate;
		/* 应用旋转动画 */
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.logo image {
		width: 100%;
		height: 100%;
	}


	.input {
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx 50rpx;
		color: #333;
		margin-bottom: 20rpx;
		text-align: center;
		font-size: 35rpx;
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .05);
	}

	.tips {
		margin-top: 20rpx;
		color: #333;
		font-size: 30rpx;
		height: 800rpx;
		overflow-y: scroll;
	}

	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100rpx;
		height: 100rpx;
		margin-top: 80rpx;
		margin-bottom: 20rpx;
		border-radius: 50%;
		color: #eee;
		background: #0048FE;
		font-size: 35rpx;
		font-weight: 800;
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .15);
	}

	.exit {
		margin-top: 30rpx;
		margin-bottom: 20rpx;
		border-radius: 50rpx;
		color: #000;
		background: #eee;
		width: 100%;
		font-size: 35rpx;
		font-weight: 800;
	}

	.radio-view {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		width: 500rpx;
		margin: 0rpx auto;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 30rpx;
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .05);
	}

	.radio-view>view {
		text-align: center;
		width: 100%;
		padding: 10rpx 15rpx;
		z-index: 2;
		color: #000;
		transition: 0.2s all linear;
		font-size: 32rpx;
	}

	.radio-view .checked {
		position: absolute;
		padding: 0;
		width: 245rpx;
		background: #0048FE;
		height: 100%;
		z-index: 1;
		top: 0;
		left: 0;
		border-radius: 20rpx;
		transition: 0.3s left ease-in-out;
	}

	.radio-view.num .checked {
		left: 0;
	}

	.radio-view.num .num {
		color: #fff;
	}

	.radio-view.account .checked {
		left: 255rpx;
	}

	.radio-view.account .account {
		color: #fff;
	}
</style>