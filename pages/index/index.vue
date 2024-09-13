<template>
	<view class="page-index" :style="{height:windowHeight+'px'}">
		
		<!-- 确认中转-弹出层 -->
		<u-popup :closeable="!popup.transit.load" :mask-close-able="!popup.transit.load" v-model="popup.transit.show"
			:z-index="10076" mode="center" size="620rpx" border-radius="20" width="88%">
			<u-row justify="center">
				<u-col :span="12">
					<view style="text-align: center;">
						<x-text :value="popup.transit.data.name" :size="35" :margin="[18,12,0,12]" color="#0048FE" block
							:ellipsis="1" center></x-text>
						<x-text :value="popup.transit.data.tips" :size="26" :margin="[0,0,20,0]" color="#aaa"></x-text>
					</view>
				</u-col>
				<u-col :span="12">
					<view
						style="display: flex;justify-content: center;align-items: center;height: 260rpx;border:solid 1px #eee;border-radius: 20rpx;">
						<view class="height-title man">
							<span>朝明辅助</span>
						</view>
					</view>
				</u-col>
				<u-col :span="12">
					<view style="margin: 20rpx auto 25rpx auto;display: flex;justify-content: center;">
						<u-button shape="circle" plain type="primary" :ripple="true" @click="brush()" :hair-line="false"
							:loading="popup.transit.load" fill
							:custom-style="{background:'#0048FE',width: '100%',color:'#fff'}">{{popup.transit.load?popup.transit.buttonText:'确认操作'}}</u-button>
					</view>
				</u-col>
			</u-row>
		</u-popup>
		<!-- 课程列表-弹出层 -->
		<u-popup v-model="popup.show" style="overflow: hidden;" mode="bottom" height="1200rpx" border-radius="23">
			<x-text :margin="[19,0,8,0]" :ellipsis="1" :size="37" center :value="popup.title" color="#0048FE"
				style="border-bottom: solid #dcdfe6 2rpx;" block="" bold=""></x-text>
			<u-back-top :scroll-top="popupBackTop" @returnTop="popupScrollBackTop"></u-back-top>
			<scroll-view scroll-with-animation :scroll-top="popupScrollTop" @scroll="popupScroll" refresher-enabled
				enable-back-to-top scroll-y ref="popupList" @refresherrefresh="getDetail" style="height: 1120rpx;"
				:refresher-triggered="popup.load">
				<u-row v-if="!popup.load">
					<u-col :span="12">
						<view style="text-align: center;">
							<x-text :size="28" :value="'大章:'+popup.data.count.big_chapter" color="#aaa"></x-text>
							<x-text :margin="[0,8]" :size="24" value="/" color="#aaa"></x-text>
							<x-text :size="28" :value="'小章:'+popup.data.count.mini_chapter" color="#aaa"></x-text>
							<x-text :margin="[0,8]" :size="24" value="/" color="#aaa"></x-text>
							<x-text :size="28" :value="'视频:'+popup.data.course
.video_count" color="#aaa"></x-text>
							<x-text :margin="[0,8]" :size="24" value="/" color="#aaa"></x-text>
							<x-text :size="28" :value="'作业:'+(popup.data.count.mini_chapter - popup.data.course
.video_count)" color="#aaa"></x-text>
							<x-text :margin="[0,8]" :size="24" value="/" color="#aaa"></x-text>
							<x-text :size="28" :value="'资料:'+popup.data.course
.resource_count" color="#aaa"></x-text>
						</view>
					</u-col>
					<template v-for="(item,index) in popup.data.chapter">
						<u-col :span="12">
							<u-row type="flex" justify="space-between">
								<u-col :span="10">
									<x-text :margin="[0,3]" :size="30" :value="(index+1)+'.'+item.name" color="#000"
										style="font-weight: 800;" :ellipsis="1" block=""></x-text>

								</u-col>
								<u-col :span="2">
									<view style="text-align: right;">
										<x-text :size="28" :value="getFinishNum(item.children)" color="#aaa"></x-text>
										<x-text :margin="[0,5]" :size="24" value="/" color="#aaa"></x-text>
										<x-text :margin="[0,15,0,1]" :size="28" :value="item.children.length"
											color="#aaa"></x-text>
									</view>
								</u-col>
							</u-row>
						</u-col>
						<u-col :span="12">
							<u-line-progress striped striped-active :percent="getFinishProgress(item.children)"
								active-color="#0048FE"></u-line-progress>
						</u-col>
						<u-col :span="12" v-for="(min_item,min_index) in item.children">
							<view style="display: flex;justify-content: ;">
								<view
									style="width:135rpx;height:110rpx;display: flex;justify-content: center;align-items: center;">
									<u-icon :name="min_item.videoid?'play-circle-fill':'file-text-fill'" :size="78"
										color="#0048FE"></u-icon>
								</view>
								<view style="width: 100%;">
									<u-row justify="center">
										<u-col :span="9">
											<x-text :margin="[10,0,0,0]" :size="30" :value="min_item.name" color="#000"
												block="" :ellipsis="1"></x-text>
										</u-col>
										<u-col :span="3">
											<view style="margin-top: 10rpx;" v-if="min_item.videoid">
												<!-- 视频 -->
												<u-button @click="brushPopupOpen({
													type:'class',
													id:min_item.id,
													video_time:min_item.video_time,
													name:min_item.name,
													tips:'视频课程 | 时长:'+formatSecondsToTime(min_item.video_time)+' | 已学:'+decimalToPercentage(min_item.rec.progress)+'%',
												})" v-if="decimalToPercentage(min_item.rec.progress)<100" size="mini" type="primary" :ripple="true"
													:custom-style="{background:'#0048FE',width: '100%',color:'#fff'}">立即学习</u-button>
												<u-button v-else plain fill size="mini" type="success"
													@click="tips('该视频课程已全部看完')">学习完成</u-button>
											</view>
											<view style="margin-top: 10rpx;" v-else>
												<!-- 作业 -->
												<u-button v-if="min_item.praxise_count<=0" plain fill size="mini"
													type="info" @click="tips('该作业并没有题目可作答，无需提交')">
													暂无题目
												</u-button>
												<u-button @click="brushPopupOpen({
													type:'task',
													id:min_item.id,
													name:min_item.name,
													tips:'作业答题 | 题目:'+min_item.rec.praxise_has_count+'/'+min_item.praxise_count,
												})" v-else-if="min_item.rec.praxise_submit_count<=0" fill size="mini" type="primary" :ripple="true"
													:custom-style="{background:'#0048FE',width: '100%',color:'#fff'}">立即答题</u-button>
												<u-button
													@click="tips(min_item.praxise_count==min_item.rec.praxise_correct_count?'作业题目全部正确作答，共'+min_item.praxise_count+'题':'作业题目并未全部正确作答。共'+min_item.praxise_count+'题，正确'+min_item.rec.praxise_correct_count+'题，错误'+(min_item.praxise_count-min_item.rec.praxise_correct_count)+'题')"
													v-else-if="min_item.rec.praxise_submit_count==2" plain fill
													size="mini" type="success">
													{{min_item.praxise_count==min_item.rec.praxise_correct_count?'全部正确':'答错'+(min_item.praxise_count-min_item.rec.praxise_correct_count)+'题'}}
												</u-button>
												<u-button @click="tips('您已经在朝明在线提交过一次答题了，系统无法自动完成，请自行前往朝明在线平台手动作答！')"
													v-else-if="min_item.rec.praxise_submit_count==1" plain fill
													size="mini" type="info">
													请自行作答
												</u-button>
											</view>
										</u-col>
									</u-row>

									<template v-if="min_item.videoid">
										<x-text :margin="[0,0,0,10]" :size="25"
											:value="'时长:'+formatSecondsToTime(min_item.video_time)"
											color="#aaa"></x-text>
										<x-text :margin="[0,8]" :size="24" value="|" color="#aaa"></x-text>
										<x-text :margin="[0,0,0,0]" :size="25"
											:value="'已学:'+decimalToPercentage(min_item.rec.progress)+'%'"
											color="#aaa"></x-text>
										<x-text :margin="[0,8]" :size="24" value="|" color="#aaa"></x-text>
									</template>
									<x-text :margin="[0,0,0,10]" :size="25"
										:value="'作业:'+min_item.rec.praxise_has_count+'/'+min_item.praxise_count"
										color="#aaa"></x-text>



									<view
										style="padding-top:12rpx;border-bottom: solid #f5f5f5 1rpx;width: 96%;margin-bottom: 10rpx;">
									</view>
								</view>
							</view>

						</u-col>
					</template>
				</u-row>
			</scroll-view>

		</u-popup>

		<view class="header"
			:style="{paddingTop:(menuButtonBoundingClientRect.top+(menuButtonBoundingClientRect.height/2))+'px',height:headerHeight+'px'}">
			<view class="height-title">
				<span>朝明辅助</span>
			</view>
			<view class="banner">
				<u-swiper circular :border-radius="16" :list="swiperList" img-mode="aspectFill"></u-swiper>
			</view>

			<view class="user">
				<u-card @head-click="()=>user.is_login?exit():''" :title="user.academy_name?'当前账号':'未登录'"
					:sub-title="user.is_login?'退出登录':''">
					<view style="display: flex;justify-content: center;" slot="body" class="u-skeleton">
						<view style="width:180rpx;display: flex;justify-content: center;">
							<u-avatar class="u-skeleton-circle" :size="100"
								:src="user.avatar?imgBasicUrl+user.avatar:'/static/logo.png'"></u-avatar>
						</view>
						<view style="width:100%;" class="u-skeleton">
							<x-text :size="35" :value="user.realname?user.realname:'这里是昵称'" color="#000" bold
								class="u-skeleton-rect"></x-text>

							<x-text :margin="[0,0,0,12]" :size="28" :value="user.num" color="#aaa"
								class="u-skeleton-rect"></x-text>
							<x-text :margin="[3,0,0,0]" value="" block=""></x-text>
							<view style="width: 100%;" class="u-skeleton-rect">
								<x-text :size="28" :value="user.batch_name" color="#aaa"></x-text>
								<x-text :margin="[0,8,0,8]" :size="22" value="/" color="#aaa"></x-text>
								<x-text :size="28" :value="user.major_name+' '+user.classes_name" color="#aaa"></x-text>
							</view>
						</view>
					</view>
				</u-card>
			</view>
		</view>

		<!-- 列表 -->
		<view class="content">

			<template v-if="!user.is_login">
				<view class="list" :style="{height:listHeight+'px'}">
					<u-empty text="请先登录" mode="permission" :icon-size="170" :font-size="33" :margin-top="66">
						<u-button slot="bottom" :ripple="true" @click="jumpLogin">立即登录</u-button>
					</u-empty>
				</view>
			</template>
			<template v-else>
				<u-tabs-swiper :offset="[20,-50]" ref="tabs" :list="list" :current="active"
					@change="(n)=>active=n"></u-tabs-swiper>



				<view class="list">
					<swiper :style="{height:listHeight+'px'}" :current="active" @change="(e)=>active=e.detail.current">
						<swiper-item v-for="(list_item,list_index) in list">
							<scroll-view style="height: 100%;" scroll-y :refresher-triggered="listRefresher"
								refresher-enabled ref="content" @refresherrefresh="getClassList">
								<view v-if="list[list_index] && list[list_index].course">
									<u-row @click="jumpDetail(item.course_name,item.course_id,item.open_id)"
										class="subject" gutter="28" v-for="(item, index) in list[list_index].course"
										:key="index">
										<u-col :span="6">
											<u-image :show-menu-by-longpress="false" width="100%" height="192rpx"
												:src="item.picture" mode="aspectFill" border-radius="10"></u-image>
										</u-col>
										<u-col class="detail" :span="6">
											<x-text :size="35" :value="item.course_name" color="#303030" bold block=""
												:ellipsis="2">
											</x-text>
											<x-text :margin="[8,0,0,0]" :size="24" :value="item.type"
												color="#C5C5C5"></x-text>
											<x-text :margin="[8,0,0,12]" :size="24" :value="item.test_type"
												color="#C5C5C5"></x-text>
											<x-text block value=""></x-text>
											<x-text :margin="[0,8,0,0]" :size="29" value="视频学习:" color="#000"></x-text>
											<x-text :size="29" :value="item.chapter_complete" bold
												color="#0048FE"></x-text>
											<x-text :size="29" :margin="[30,8,0,8]" value="/" color="#000"></x-text>
											<x-text :size="29" :value="item.video_count" bold color="#0048FE"></x-text>
											<x-text :margin="[0,0,0,5]" :size="29" value="节" color="#000"></x-text>
										</u-col>
									</u-row>
								</view>

							</scroll-view>
						</swiper-item>
					</swiper>
				</view>

			</template>
		</view>
		<xingCommon ref="xingCommon" />
		
		
		<u-back-top :top="0" :scroll-top="isShowShareAppMessageButton?1:0" mode="square" :bottom="300" icon="share-fill" tips="分享" open-type="share" @returnTop="shareApp"></u-back-top>
		<u-back-top :top="0" :scroll-top="isShowWeixinFillButton?1:0" mode="square" :bottom="200" icon="weixin-fill" tips="客服" @returnTop="jumpWeixin"></u-back-top>

		<u-skeleton :loading="!user.is_login || getUserInfoLoad" :animation="true" bgColor="#fff"></u-skeleton>
	</view>
</template>

<script>
	const APP = getApp();
	export default {
		data() {
			return {
				shareObj:{
					withShareTicket:true,
					title: "朝明辅助",
					content:"给你分享一款“朝明在线”刷课刷作业的工具~",
					imageUrl:"https://chaoming.96xy.cn/public/static/share/1.png",
					path:"/pages/index/index",
				},
				
				isShowShareAppMessageButton:false,  //是否显示“分享朋友”的按钮
				isShowWeixinFillButton:false,  //是否显示“联系客服”的按钮
				
				getUserInfoLoad: false,
				listRefresher: false,
				popup: {
					show: false,
					title: "",
					load: true,
					data: {},
					course_id: "",
					open_id: "",
					transit: {
						show: false,
						load: false,
						data: {},
					},
				},
				selectIndex: 0,
				swiperList: [{
					image: require("@/static/swiper/1.png"),
					name: "1"
				}, ],
				menuButtonBoundingClientRect: APP.globalData.menuButtonBoundingClientRect,
				active: 0,
				list: [],
				user: {
					is_login: false,
				},
				windowHeight: 0,
				popupScrollTop: 0,
				popupBackTop: 0,
				imgBasicUrl: APP.globalData.basicUrl + '/index/files?path=',
			}
		},
		computed: {
			headerHeight() {
				let header = uni.upx2px(670);
				return (this.menuButtonBoundingClientRect.top + this.menuButtonBoundingClientRect.height) + header
			},
			listHeight() {
				let tags = uni.upx2px(0);
				return this.windowHeight - tags - (this.headerHeight + this.menuButtonBoundingClientRect.top)
			},
		},
		methods: {
			/**
			 * 跳转微信客服页
			 */
			jumpWeixin(){
				let wx = APP.globalData.wx;
				let phone = APP.globalData.phone;
				uni.showActionSheet({
					title:"联系客服",
					itemList:["复制微信号（"+wx+"）","拨打电话（"+phone+"）"],
					success:(res)=>{
						if(res.tapIndex === 0){
							//复制微信号
							uni.setClipboardData({
								data: wx
							});
						}else if(res.tapIndex === 1){
							//拨打电话
							uni.makePhoneCall({
								phoneNumber: phone
							});
						}
					},
				})
			},
			/**
			 * 分享小程序
			 */
			shareApp(){
				uni.showShareMenu(this.shareObj)
			},
			jumpLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			popupScrollBackTop() {
				this.popupScrollTop = this.popupBackTop;
				this.$nextTick(() => {
					this.popupBackTop = 0;
					this.popupScrollTop = 0;
				})
			},
			/**
			 * 更改返回课程浮窗顶部的组件数据
			 */
			popupScroll: function(e) {
				this.popupBackTop = e.detail.scrollTop;

			},
			/**
			 * 退出登录
			 */
			exit() {
				this.$x.openModal({
					title: "退出登录",
					showTitle: true,
					content: "您确定要退出当前登录账号吗？",
					confirmText: "确定退出",
					cancelText: "取消",
					showCancelButton: true,
					confirm: () => {
						this.user.is_login = false;
						uni.setStorageSync('login_token', null);
						this.jumpLogin()
					}
				})
			},
			/**
			 * 刷课/刷作业弹窗打开
			 */
			brushPopupOpen(obj) {
				this.popup.transit.show = true;
				this.popup.transit.load = false;
				this.popup.transit.data = obj;
			},
			brush() {
				let path, data;
				if (this.popup.transit.data.type == "class") {
					path = "/Index/brushClass";
					data = {
						course_id: this.popup.course_id,
						open_id: this.popup.open_id,
						id: this.popup.transit.data.id,
						video_time: this.popup.transit.data.video_time,
					}
				} else if (this.popup.transit.data.type == "task") {
					path = "/Index/brushTask";
					data = {
						course_id: this.popup.course_id,
						open_id: this.popup.open_id,
						id: this.popup.transit.data.id,
					}
				} else {
					return false;
				}
				this.popup.transit.buttonText = "操作中...";
				this.popup.transit.load = true;
				let that = this;
				APP.request({
					url: path,
					data,
					success: (res) => {
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							this.popup.transit.buttonText = "刷新中...";
							this.$x.toast({
								title: res.data.msg,
							})
							this.getDetail(false);
						} else {
							this.popup.transit.load = false;
							this.$x.openModal({
								content: res.data.msg ? res.data.msg : '未知错误',
								confirmText: "确定",
							})
						}
					},
					fail: (res) => {
						this.popup.transit.load = false;

						this.$x.openModal({
							content: '系统繁忙，请稍后重试！',
							confirmText: "确定",
						})
					}
				})
			},
			tips(msg) {
				this.$x.openModal({
					content: msg,
					confirmText: "确定",
					zIndex: 99999,
				})
			},
			getFinishProgress(arr) {
				let total = arr.length;
				let finish = this.getFinishNum(arr);
				let num = Math.floor((finish / total) * 100);
				return num;
			},
			getFinishNum(arr) {
				let num = 0;
				arr.forEach((item) => {
					if (item.videoid) {
						//视频
						if (this.decimalToPercentage(item.rec.progress) >= 100) {
							num++;
						}
					} else {
						//作业
						if (item.praxise_count <= 0) {
							//题数为0
							num++;
						} else if (item.rec.praxise_has_count >= item.praxise_count) {
							//做完了
							num++;
						}
					}
				})
				return num;
			},
			decimalToPercentage(decimalString) {
				// 将字符串转换为浮点数
				const decimal = parseFloat(decimalString);

				// 将浮点数乘以100，并格式化为百分比形式的字符串
				const percentage = (decimal * 100).toFixed(2);

				return percentage;
			},
			formatSecondsToTime(seconds) {
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const remainingSeconds = seconds % 60;

				const formattedHours = hours.toString().padStart(2, '0');
				const formattedMinutes = minutes.toString().padStart(2, '0');
				const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

				return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
			},
			getDetail(load = true) {
				let course_id = this.popup.course_id;
				let open_id = this.popup.open_id
				this.popup.load = load;
				APP.request({
					url: "/Index/getClassDetails",
					data: {
						course_id,
						open_id
					},
					success: (res) => {
						this.popup.load = false;
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							this.popup.data = res.data.data;
							this.popup.transit.buttonText = "完成";

							this.popup.transit.show = false;
							this.popup.transit.load = false;
						} else {
							this.popup.load = false;
							this.popup.show = false;
							this.$x.openModal({
								content: res.data.msg,
								confirmText: "确定",
							})
						}
					},
					fail: (res) => {
						this.popup.load = false;
						this.popup.show = false;

						this.$x.openModal({
							content: "系统繁忙，请稍后重试！",
							confirmText: "确定",
						})
					}
				})
			},
			jumpDetail(course_name, course_id, open_id) {
				this.popup.title = course_name;
				this.popup.show = true;
				this.popup.load = true;
				this.popup.course_id = course_id;
				this.popup.open_id = open_id;
				this.$nextTick(() => {
					this.getDetail();
				})
			},
			/**
			 * 获取课程列表数据
			 */
			getClassList() {
				this.list = [{
					name: "...",
					count: "获取中",
				}];

				this.listRefresher = true;
				APP.request({
					url: "/Index/getClassList",
					data: {},
					success: (res) => {
						this.listRefresher = false;
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							res.data.data.forEach((item, index) => {
								item.name = "第" + (index + 1) + "学期"
								item.index = index;
								item.course.forEach((c_item) => {
									c_item.picture = this.imgBasicUrl +
										c_item.course_fm
								})
							})
							this.list = res.data.data;
							console.log("list", this.list);
						} else {
							this.$x.openModal({
								content: res.data.msg,
								confirmText: "确定",
							})
						}
					},
					fail() {
						this.listRefresher = false;
						this.$x.openModal({
							content: "系统繁忙，请稍后重试！",
							confirmText: "确定",
						})
					}
				})
			},
		},
		onShareAppMessage(res) {
			return this.shareObj
		},
		onShareTimeline(res) {
			return this.shareObj
		},
		onShow() {
			let that = this;
			uni.getSystemInfo({
				success(res) {
					that.windowHeight = res.windowHeight;
				}
			})
			this.getUserInfoLoad = true;
			//获取课程列表
			APP.getUserInfo().then((user) => {
				this.getUserInfoLoad = false;
				if (!this.user.is_login) {
					this.getClassList();
				}
				this.user = {
					is_login: true,
					...user
				};
				
				setTimeout(()=>{
					this.isShowShareAppMessageButton = true;
					this.isShowWeixinFillButton = true;
				},1000);
			}).catch((msg) => {
				this.user.is_login = false;
				this.getUserInfoLoad = false;
				this.jumpLogin()
				this.isShowShareAppMessageButton = false;
				this.isShowWeixinFillButton = false;
			})
		},
		onLoad() {
			this.$nextTick(() => {
				this.$x = this.$refs.xingCommon;
			})

			//窗体改变大小触发事件
			uni.onWindowResize((res) => {
				this.windowHeight = res.size.windowHeight;
			})

			uni.showLoading({
				title: '请稍后...',
				mask: true,
			});
			//获取课程列表
			APP.getUserInfo().then((user) => {
				this.getUserInfoLoad = false;
				this.user = {
					is_login: true,
					...user
				};
				uni.hideLoading();
				this.getClassList();
			}).catch((msg) => {
				uni.hideLoading();
				this.user.is_login = false;
				this.getUserInfoLoad = false;
				this.jumpLogin()
			})
		}
	}
</script>


<style scoped lang="scss">
	/deep/ .uni-scroll-view-content {
		background: #fff !important;
	}

	@keyframes showName-c6c4a2ba {
		0% {
			letter-spacing: -1.25rem;
			filter: blur(.625rem)
		}

		to {
			letter-spacing: .1875rem
		}
	}

	page {
		background: #f5f5f5;
		width: 100%;
		max-width: 820rpx;
		height: 100%;
		margin: 0 auto;
	}

	.page-index {
		width: 100%;
		height: 100%;


		.height-title {
			font-family: 'No.308-ShangShouJiSuTi-2', sans-serif;
			/* 使用你定义的字体，并指定一个备选字体 */
			text-align: center;
			font-size: 100rpx;
			animation: showName-c6c4a2ba 2.5s forwards;
			background: linear-gradient(to right, #EF4E77, #F5669B, #F28C58);
			// background: linear-gradient(to right, #3A0067, #4A0363, #E7233B);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;

			&.man {
				animation: showName-c6c4a2ba 1.5s forwards !important;
			}
		}

		.header {
			padding-bottom: 10rpx;
			background: linear-gradient(180deg, #0048FE 0%, #f5f5f5 100%);

			.banner {
				margin: 0 auto;
				margin-top: 3rpx;
				width: 100%;
				padding: 0 30rpx;
			}

			.user {
				margin: 0 auto;
				margin-top: 20rpx;
				width: 100%;
			}
		}

		.content {
			background: #ffffff;

			.title {
				height: 78rpx;
			}

			.list {
				display: flex;
				flex-direction: column;

				.subject {
					margin: 0 auto;
					// display: flex;
					// justify-content: left;
					// align-items: center;
					padding-left: 10rpx;
					height: 252rpx;
					border-bottom: 2px solid #f5f5f5;

					.detail {
						width: 100%;

					}
				}
			}
		}
	}
</style>