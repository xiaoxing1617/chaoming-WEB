<template>
	<view>
		<view class="refresh" @click="getMeTestList">刷新列表</view>
		<view class="li" v-for="(item,index) in list">
			<view class="status" v-if="item.status == 'not'">未开始</view>
			<view class="status" style="background: #f00;" v-else-if="item.status == 'wait'">待考试</view>
			<view class="status" style="background: #0048FE;" v-else-if="item.status == 'proceed'">考试中</view>
			<view class="status" style="background: #1CAD1B;" v-else-if="item.status == 'finish'">已结束</view>
			<view class="title">{{item.title}}</view>
			<view class="txt">考试ID：{{item.id}}（{{item.order}}）</view>
			<view class="txt">开始时间：{{item.open_start}}</view>
			<view class="txt">结束时间：{{item.open_end}}</view>
			<view class="txt">总分：{{item.total_score}}分</view>
			<view class="txt">得分：{{item.get_score}}分</view>
			<view class="txt">时长：{{item.time_length}}分钟</view>


			<view class="but" style="background: #4B5364;" v-if="!item.is_support">不支持解密
			</view>
			<view class="but" style="background: #f00;" v-else-if="item.status == 'wait'" @click="tips">等待进入考试</view>
			<view class="but" v-else-if="item.status == 'proceed'" @click="getTestAnswer(item.id)">解密答案</view>
			<view class="but" v-else-if="item.status == 'finish'" @click="getTestAnswer(item.id)">查看答案</view>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msg.type" :cancelText="msg.close_txt" :confirmText="msg.confirm_txt" title="提示"
				:content="msg.content" @confirm="msg.confirm" @close="msg.close"></uni-popup-dialog>
		</uni-popup>

		<uni-popup ref="brushPopup">
			<view class="brush-popup-view">
				<view class="main">
					<view class="title">{{testAnswer.title}}</view>
					<view class="answer-list">
						<view class="item" v-for="(item,index) in testAnswer.list">
							<view class="topic"><span>{{index+1}}.&nbsp;</span>&nbsp;{{item.title}}</view>
							<view class="answer">{{item.op}}</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				APP: getApp(),
				msg: {
					type: "error",
					content: "",
					confirm() {},
					close() {},
					confirm_txt: "知道了",
					close_txt: "关闭",
				},
				testAnswer: {
					title: "",
					list: [

					],
				},
			}
		},
		methods: {
			/**
			 * 查看考试答案
			 * @param {Object} id
			 */
			getTestAnswer(id) {
				const item = this.list.find(item => item.id === id);
				this.testAnswer.title = item.title;
				let _this = this;
				let login_token = uni.getStorageSync('login_token');
				if (!login_token) {
					uni.setStorageSync('login_token', null);
				} else {
					this.login_token = login_token;
				}
				uni.showLoading({
					title: '请稍后...',
					mask: true,
				});
				uni.request({
					url: this.APP.globalData.basicUrl + "/Index/viewTestAnswer",
					data: {
						token: this.login_token,
						test_id: item.id,
						index: item.order,
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							this.testAnswer.list = res.data.data;
							this.$refs.brushPopup.open("bottom")
						} else {
							this.msg.type = "error";
							this.msg.content = res.data.msg;
							this.$refs.alertDialog.open()
						}
					},
					fail() {
						uni.hideLoading();
						this.msg.type = "error";
						this.msg.content = "系统繁忙";
						this.$refs.alertDialog.open()
					}
				})
			},
			tips() {
				this.msg.type = "info";
				this.msg.content = "您需要先进入考试才能解密获取本场考试的答案。（须知：朝明在线或本程序出现问题时可能无法解密成功）";
				this.$refs.alertDialog.open()
			},
			/**
			 * 获取考试列表
			 */
			getMeTestList() {
				let _this = this;
				this.APP.getUserInfo().then((data) => {
					let login_token = uni.getStorageSync('login_token');
					if (!login_token) {
						uni.setStorageSync('login_token', null);
					} else {
						this.login_token = login_token;
					}
					uni.showLoading({
						title: '请稍后...',
						mask: true,
					});
					uni.request({
						url: this.APP.globalData.basicUrl + "/Index/getMeTestList",
						data: {
							token: this.login_token
						},
						success: (res) => {
							uni.hideLoading();
							if (res.data && res.data?.code && res.data.code * 1 === 1) {
								this.list = res.data.data;
							} else {
								this.loginLoading = false;
								this.msg.type = "error";
								this.msg.content = res.data.msg;
								this.$refs.alertDialog.open()
							}
						},
						fail() {
							uni.hideLoading();
							this.loginLoading = false;
							this.msg.type = "error";
							this.msg.content = "系统繁忙";
							this.$refs.alertDialog.open()
						}
					})
				}).catch((msg) => {
					this.loginLoading = false;
					this.msg.type = "error";
					this.msg.content = msg;
					this.msg.confirm_txt = "去登录";
					this.msg.confirm = this.msg.close = function() {
						uni.navigateTo({
							url: '/pages/index/index'
						});
					}
					this.$refs.alertDialog.open()

				})
			},
		},
		onLoad() {
			this.getMeTestList();
		}
	}
</script>

<style>
	page {
		width: 100%;
		background: #282C35;
	}

	.refresh {
		width: 90%;
		margin: 10rpx auto;
		margin-top: 20rpx;
		border-radius: 50rpx;
		padding: 12rpx 20rpx;
		text-align: center;
		font-size: 29rpx;
		font-weight: 800;
		background: #0048FE;
		color: #fff;
		letter-spacing: 7rpx;
	}

	.li {
		border-radius: 12rpx;
		color: #fff;
		width: 95%;
		margin: 20rpx auto;
		background: #21242D;
		padding-bottom: 20rpx;
	}

	.li>.status {
		border-radius: 12rpx 0 12rpx 0;
		background: #4B5364;
		padding: 4rpx 10rpx;
		font-size: 25rpx;
		display: inline-block;
	}

	.li>.title {
		font-weight: 800;
		font-size: 35rpx;
		margin: 10rpx 25rpx;
	}

	.li>.txt {
		font-weight: 500;
		font-size: 28rpx;
		color: #ABB2BF;
		margin: 5rpx 25rpx;
	}

	.li>.but {
		width: 90%;
		margin: 10rpx auto;
		margin-top: 20rpx;
		border-radius: 50rpx;
		padding: 12rpx;
		text-align: center;
		font-size: 29rpx;
		font-weight: 800;
		background: #0048FE;
		letter-spacing: 7rpx;
	}

	.brush-popup-view {
		width: 100%;
		background: #111316;
		height: 650rpx;
		border-radius: 30rpx 30rpx 0 0;
		box-shadow: 0 2px 10px 0 rgba(255, 255, 255, 0.1);
	}

	.brush-popup-view {
		padding-top: 25rpx;
	}

	.brush-popup-view .main {
		width: 92%;
		height: 610rpx;
		background: #21252B;
		border-radius: 30rpx;
		margin: 0 auto;
		padding-top: 15rpx;
		position: relative;
	}

	.brush-popup-view .main .title {
		color: #0048FE;
		text-align: center;
		font-size: 33rpx;
		font-weight: 800;
		margin-bottom: 10rpx;
	}

	.answer-list {
		height: 540rpx;
		overflow-y: scroll;
		color: #fff;
		padding: 5rpx 15rpx;
	}

	.answer-list>.item {
		border-bottom: #282C35 solid 1rpx;
		margin: 10rpx auto;
		padding-bottom: 15rpx;
	}

	.answer-list>.item .topic {
		font-size: 30rpx;
		background: #1b212b;
		border-radius: 12rpx;
		padding: 8rpx 12rpx;
		margin-bottom: 5rpx;
	}

	.answer-list>.item .topic>span {
		color: #0048FE;
		font-weight: 800;
		font-size: 32rpx;
	}

	.answer-list>.item .answer {
		font-size: 30rpx;
		padding-left: 10rpx;
	}
</style>