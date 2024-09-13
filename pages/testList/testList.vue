<template>
	<view>
		<u-navbar :back-icon-name="load?'hourglass-half-fill':'reload'" :custom-back="reload" back-icon-color="#fff"
			:back-text="load?'请稍后':'刷新'" :back-text-style="{ color: '#fff' }" :back-icon-size="35" title="考试列表"
			:title-size="34" title-color="#fff" :background="background">
		</u-navbar>

		<view style="text-align: center;margin-top: 48rpx;" v-if="load">
			<u-loading color="red" mode="circle" :size="66"></u-loading>
		</view>

		<view class="content" v-else>
			<u-card v-for="(item,index) of list" :border-radius="22" box-shadow="0 4px 8px 0 rgba(0, 44, 102, 0.05)">
				<view class="" slot="head">
					<u-tag :text="getStatusName(item.status)[1]" mode="dark" shape="circleLeft"
						:type="getStatusName(item.status)[0]" style="margin-right: 13rpx;" /><span
						style="font-size: 33rpx;">{{item.title}}</span>
				</view>
				<view class="" slot="body">
					<x-text :value="'试卷ID：'+item.id+'（'+item.order+'）'" :size="30" :margin="[0,12,0,12]" color="#000"
						block :ellipsis="1"></x-text>
					<x-text :value="'答题时长：'+item.time_length+'分钟'" :size="30" :margin="[0,12,0,12]" color="#000"
						block></x-text>
					<x-text :value="'试卷总分：'+item.total_score+'分'" :size="30" :margin="[0,12,0,12]" color="#000"
						block></x-text>
					<x-text :value="'考试得分：'+item.get_score+'分'" :size="30" :margin="[0,12,0,12]" color="#000"
						block></x-text>
					<x-text :value="'开放时间：'+item.open_start+'~'+item.open_end" :size="30" :margin="[0,12,0,12]"
						color="#000" block></x-text>
				</view>
				<view class="" slot="foot">
					<template v-if="item.status=='error'">
						<!-- 错误 -->
						<u-button type="error" :ripple="true"
							@click="tips(item.error_directions)">{{item.error_title}}</u-button>
					</template>

					<template v-else-if="item.status=='finish'">
						<!-- 已结束 -->
						<u-button type="success" :ripple="true" v-if="item.is_support"
							@click="viewTestAnswer(item.title,item.id,item.order)">已结束，查看试卷答案</u-button>
						<u-button :disabled="true" v-else>不支持查看试卷答案</u-button>
					</template>
					<template v-else-if="item.status=='wait'">
						<!-- 等待开放-->
						<u-button type="default" @click="tips('等待该场考试开放作答时间')" :ripple="true">等待开放时间</u-button>
					</template>

					<template v-else>
						<!-- 已开放，未考试 / 正在答题中-->
						<template v-if="item.is_support">
							<!-- 支持查看答案 -->
							<u-button type="warning"
								@click="tips('请先通过另一个设备进入朝明在线考试答题界面，然后回到本小程序点左上角“刷新”即可查看本场考试答案！有什么不懂的可以联系客服！')"
								:ripple="true" v-if="item.status=='not'">请先进入考试答题</u-button>
							<u-button type="primary" @click="viewTestAnswer(item.title,item.id,item.order)"
								:ripple="true" v-if="item.status=='proceed'">正在答题，查看试卷答案</u-button>
						</template>
						<template v-else>
							<u-button :disabled="true">暂不支持查看试卷答案</u-button>
						</template>

					</template>
				</view>
			</u-card>
		</view>
		<xingCommon ref="xingCommon" />

		<!-- 课程列表-弹出层 -->
		<u-popup v-model="popup.show" style="overflow: hidden;" mode="bottom" height="1200rpx" border-radius="23">
			<x-text :margin="[19,12,8,12]" :ellipsis="1" :size="37" center :value="popup.title" color="#0048FE"
				style="border-bottom: solid #dcdfe6 2rpx;" block="" bold=""></x-text>
			<u-row>
				<u-col :span="12" v-for="(item,index) of popup.list">
					<x-text :margin="[8,12,8,15]" :size="31" color="#000" :value="index+1+'.'+item.title" bold=""
						block=""></x-text>
					<x-text icon="attach" :margin="[0,12,10,15]" :size="31" :value="item.op" color="#000" block=""
						bold=""></x-text>
					<view style="padding-top:8rpx;border-bottom: solid #f5f5f5 1rpx;width: 96%;margin-bottom: 12rpx;">
					</view>
				</u-col>
			</u-row>
		</u-popup>
	</view>
</template>

<script>
	const APP = getApp();
	export default {
		data() {
			return {
				load: false,
				background: {
					backgroundImage: 'linear-gradient(to left, #0048FE 0%, #3a72fe 100%)'
				},
				list: [],
				popup: {
					show: false,
					title: "",
					list: []
				}
			}
		},
		onShareAppMessage(res) {
			return {
				title: '朝明辅助-考试列表',
				path: '/pages/textList/textList'
			}
		},
		onShareTimeline(res) {
			return {
				title: '朝明辅助-考试列表',
				path: '/pages/textList/textList'
			}
		},
		onLoad() {
			this.$nextTick(() => {
				this.$x = this.$refs.xingCommon;
			})
		},
		onShow() {
			this.reload();
		},
		methods: {
			viewTestAnswer(title, id, order) {
				this.$x.openModal({
					showTitle: true,
					title: "温馨提示",
					content: "请务必先完成该考试课程的所有作业，因为解密试卷答案需要从作业中获取，若有未完成的请及时刷取！",
					confirmText: "确认查看",
					cancelText: "取消",
					showCancelButton: true,
					confirm: () => {

						uni.showLoading({
							title: '正在获取...',
							mask: true,
						});

						APP.request({
							url: "/Index/viewTestAnswer",
							data: {
								test_id: id,
								index: order,
							},
							success: (res) => {
								uni.hideLoading();
								if (res.data && res.data?.code && res.data.code * 1 === 1) {
									this.popup.show = true;
									this.popup.title = title;
									this.popup.list = res.data.data;
									console.log("viewTestAnswer", this.popup.list);
								} else {
									this.$x.openModal({
										content: res.data.msg,
										confirmText: "确定",
									})
								}
							},
							fail() {
								uni.hideLoading();
								this.$x.openModal({
									content: "系统繁忙，请稍后重试！",
									confirmText: "确定",
								})
							}
						})
					},
				})
			},
			tips(msg) {
				this.$x.openModal({
					content: msg,
					confirmText: "确定",
					zIndex: 99999,
				})
			},
			getStatusName(status) {
				switch (status) {
					case "finish":
						return ["success", "考试结束"];
						break;
					case "not":
						return ["warning", "已开放，未考试"];
						break;
					case "proceed":
						return ["primary", "正在答题中"];
						break;
					case "wait":
						return ["info", "等待开放"];
						break;
					case "error":
						return ["error", "异常情况"];
						break;
				}
			},
			reload() {
				if (this.load) {
					return;
				}
				this.load = true;
				//获取考试列表
				APP.getUserInfo().then((user) => {
					APP.request({
						url: "/Index/getMeTestList",
						data: {},
						success: (res) => {
							this.load = false;
							if (res.data && res.data?.code && res.data.code * 1 === 1) {
								this.list = res.data.data
								console.log("list", this.list);
							} else {
								this.$x.openModal({
									content: res.data.msg,
									confirmText: "确定",
								})
							}
						},
						fail() {
							this.load = false;
							this.$x.openModal({
								content: "系统繁忙，请稍后重试！",
								confirmText: "确定",
							})
						}
					})

				}).catch((msg) => {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				})
			},
		}
	}
</script>

<style>
	page {
		background: #f5f5f5;
	}
</style>