<template>
	<view>
		<!-- 刷课提示 -->
		<uni-popup ref="brushPopup" :is-mask-click="brushPopupIsMaskClick">
			<view class="brush-popup-view">
				<view class="main">
					<view class="title">公益广告</view>
					<view class="info" v-if="randomItemLossChildren">
						<view class="left">
							<image :fade-show="true" mode="aspectFill" :src="`https://res.crotg.com/`+randomItemLossChildren.imgUrl"></image>
						</view>
						<view class="right">
							<view class="item">姓名：{{randomItemLossChildren.name}}【{{randomItemLossChildren.gender==1?'男':randomItemLossChildren.gender==2?'女':'未填写'}}】</view>
							<view class="item">年龄：{{randomItemLossChildren.age}}岁</view>
							<view class="item">特点：{{randomItemLossChildren.features}}</view>
							<view class="item">详细信息：{{randomItemLossChildren.information}}</view>
							<view class="item">走失地址：{{randomItemLossChildren.lostAddress}}</view>
							<view class="item">走失时间：{{randomItemLossChildren.lostTime}}</view>
							<view class="item">如有线索请您及时拨打110提供，在此我们非常感谢！</view>
						</view>
					</view>
					<view class="empty" v-else="">
						暂时未获取到走失儿童的数据，您可以主动前往<span @click="jumpArchive">中国走失儿童数据库</span>官网进行查看
					</view>
				</view>
				<view class="tips">公益广告数据均来自 <span @click="jumpArchive">中国走失儿童数据库</span> 官网获得</view>
				<view class="bottom" @click="brush" :style="`${brushPopupIsMaskClick?'background:rgba(0, 72, 254,1);color:#fff':'background:rgba(0, 72, 254,0.3);color:#eee'}`">
					{{brushPopupIsMaskClick?'开始刷课':'正在执行刷课任务'}}
				</view>
			</view>
		</uni-popup>
		
		
		<view class="head-view" :style="`height:${headHeight}px;`" v-if="list.length>=1">
			<view @click="headLiClick(index)" :class="`li${index==current?' select':''}`" v-for="(item,index) in list">
				第{{item.semester}}学期
			</view>
		</view>
		<swiper class="swiper" @change="currentChange" :current="current"
			:style="`height: ${windowHeight - headHeight - remainHeight}px;`" :indicator-dots="false" :autoplay="false"
			:duration="300">
			<swiper-item v-for="(item,index) in list">
				<scroll-view :scroll-y="true" class="swiper-item">
					<uni-collapse @change="collapseChange" v-model="collapseValue[index]" :accordion="true">
						<uni-collapse-item v-for="(class_item,class_index) in item.course">
							<template v-slot:title>
								<view class="class-info">
									<view class="left">
										<image class="image" :fade-show="true" mode="aspectFill" :src="`https://api.jinkex.com/files?path=`+class_item.course_fm"></image>

									</view>
									<view class="right">
										<view class="name">{{class_item.course_name}}</view>
										<view class="tags">
											<view>{{class_item.type}}</view>
											<view>{{class_item.test_type}}</view>
											<view>学分:{{class_item.gredit}}</view>
											<view>课时:{{class_item.chapter_complete>=class_item.video_count?class_item.video_count:class_item.chapter_complete}}/{{class_item.video_count}}</view>
										</view>
									</view>
								</view>
							</template>
							<template
								v-if="classDetails && classDetails[class_item.course_id] && classDetails[class_item.course_id][class_item.open_id]">
								<view class="list" :key="chapter_index"
									v-for="(chapter_item,chapter_index) in classDetails[class_item.course_id][class_item.open_id].chapter">
									<view class="title">{{chapter_item.name}}</view>
									<view class="children"
										v-for="(children_item,children_index) in chapter_item.children">
										<view class="name"><uni-icons size="24" color="#F1F3F4"
												:type="children_item.videoid?'videocam':'calendar'"></uni-icons>&nbsp;&nbsp;{{children_item.name}}
										</view>
										<view class="info">
											<view class="tag" v-if="children_item.videoid">
												时长:{{formatSecondsToTime(children_item.video_time)}}
											</view>
											<view class="tag" v-if="children_item.videoid">
												已学:{{decimalToPercentage(children_item.rec.progress)}}%
											</view>
											<view class="tag">
												作业:{{children_item.rec.praxise_has_count}}/{{children_item.rec.praxise_correct_count}}
											</view>
											<view class="tag">
												<template v-if="!children_item.videoid">
													<view class="brush grey">暂不支持刷作业</view>
												</template>
												<template v-else-if="decimalToPercentage(children_item.rec.progress)<100">
													<view class="brush" @click="brushPopupOpen(class_item.course_id,class_item.open_id,children_item.id,children_item.video_time)">刷课</view>
												</template>
												<template v-else="">
													<view class="brush success">已学完</view>
												</template>
											</view>
										</view>
									</view>
								</view>
							</template>
						</uni-collapse-item>
					</uni-collapse>

				</scroll-view>
			</swiper-item>
		</swiper>
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
				windowHeight: 0,
				headHeight: 0,
				current: 0,
				remainHeight: 0,
				list: [],
				APP: getApp(),
				login_token: "",
				msg: {
					type: "error",
					content: "",
					confirm() {},
					close() {},
					confirm_txt: "知道了",
					close_txt: "关闭",
				},
				collapseValue: {},
				classDetails: {},
				randomItemLossChildren:false,
				brushData:{},
				brushPopupIsMaskClick:true,
			}
		},
		methods: {
			formatSecondsToTime(seconds) {
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const remainingSeconds = seconds % 60;

				const formattedHours = hours.toString().padStart(2, '0');
				const formattedMinutes = minutes.toString().padStart(2, '0');
				const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

				return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
			},
			decimalToPercentage(decimalString) {
				// 将字符串转换为浮点数
				const decimal = parseFloat(decimalString);

				// 将浮点数乘以100，并格式化为百分比形式的字符串
				const percentage = (decimal * 100).toFixed(2);

				return percentage;
			},
			currentChange(e) {
				this.current = e.detail.current
			},
			headLiClick(index) {
				this.current = index
			},
			/**
			 * 获取课程详情
			 */
			getClassDetails(course_id, open_id,is_inc_chapter_complete=false) {
				uni.showLoading({
					title: '刷新中...',
					mask: true,
				});
				uni.request({
					url: this.APP.globalData.basicUrl + "/Index/getClassDetails",
					data: {
						token: this.login_token,
						course_id,
						open_id
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							this.$set(this.classDetails, course_id, {})
							this.$set(this.classDetails[course_id], open_id, res.data.data);
							if(is_inc_chapter_complete){
								this.list.forEach(function(val,key){
									val.course.forEach(function(class_item,class_key){
										if(class_item.course_id ==course_id && class_item.open_id == open_id){
											class_item.chapter_complete = class_item.chapter_complete +1;
										}
									})
								})
							}
						} else {
							this.loginLoading = false;
							this.msg.type = "error";
							this.msg.content = res.data.msg;
							this.$refs.alertDialog.open()
						}
					},
					fail: (res) => {
						uni.hideLoading();
						this.loginLoading = false;
						this.msg.type = "error";
						this.msg.content = "系统繁忙";
						this.$refs.alertDialog.open()
					}
				})
			},
			collapseChange(index) {
				if (!index) {
					return;
				}
				let course_id = this.list[this.current].course[index].course_id;
				let open_id = this.list[this.current].course[index].open_id;
				this.getClassDetails(course_id, open_id);
			},
			/**
			 * 刷课弹窗打开
			 */
			brushPopupOpen(course_id,open_id,id,video_time){
				this.brushData = {
					course_id,open_id,id,video_time
				};
				this.randomItemLossChildren = this.APP.getItemLossChildren();
				this.$refs.brushPopup.open("bottom")
			},
			/**
			 * 刷课请求
			 */
			brush(){
				this.brushPopupIsMaskClick = false;
				uni.request({
					url: this.APP.globalData.basicUrl + "/Index/brushClass",
					data: {
						token: this.login_token,
						course_id:this.brushData.course_id,
						open_id:this.brushData.open_id,
						id:this.brushData.id,
						video_time:this.brushData.video_time,
					},
					success: (res) => {
						this.brushPopupIsMaskClick = true;
						if (res.data && res.data?.code && res.data.code * 1 === 1) {
							this.getClassDetails(this.brushData.course_id,this.brushData.open_id,true);
							this.$refs.brushPopup.close()
						} else {
							this.loginLoading = false;
							this.msg.type = "error";
							this.msg.content = res.data.msg;
							this.$refs.alertDialog.open()
						}
					},
					fail: (res) => {
						this.brushPopupIsMaskClick = true;
						this.loginLoading = false;
						this.msg.type = "error";
						this.msg.content = "系统繁忙";
						this.$refs.alertDialog.open()
					}
				})
			},
			jumpArchive(){
				window.open("http://www.crotg.com/finding.html", '_blank');
			},
		},
		onLoad() {
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.windowHeight = res.windowHeight
					_this.headHeight = (res.screenWidth * 80) / 750
					_this.remainHeight = (res.screenWidth * 33) / 750
				}
			})
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
					url: this.APP.globalData.basicUrl + "/Index/getClassList",
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

		}
	}
</script>

<style>
	page {
		width: 100%;
		background: #282C35;
	}

	.swiper {
		width: 100%;
	}

	.swiper-item {
		margin: 0 auto;
		width: 100%;
		height: 100%;
		background: #282C35;
	}

	.head-view {
		text-align: center;
		background: #21242D;
		border-bottom: 1px solid #222;
		margin-bottom: 22rpx;
	}

	.head-view>.li {
		height: 52rpx;
		line-height: 52rpx;
		padding: 0 35rpx;
		color: #eee;
		display: inline-block;
		border-radius: 50rpx;
		background: #4B5364;
		margin: 12rpx 8rpx;
		font-size: 32rxp;
	}

	.head-view>.li.select {
		background: rgb(0, 72, 254);
	}

	.list {
		padding: 10rpx 20rpx;
	}

	.list .title {
		font-size: 28rpx;
		font-weight: 800;
		color: #fff !important;
	}

	.list .title::before {
		content: '';
		display: inline-block;
		background: #0048FE;
		width: 8rpx;
		height: 25rpx;
		border-radius: 4rpx;
		margin-right: 13rpx;
	}

	.list .children {
		padding: 10rpx;
		border-bottom: 1px #444 solid;
	}

	.list .children .name {
		font-size: 28rpx !important;
		color: #F1F3F4 !important;
	}

	.list .children .info {
		margin-top: 8rpx;
		display: flex;
		justify-content: space-between;
	}

	.list .children .info .tag {
		font-size: 28rpx !important;
		color: #aaa !important;
	}

	.list .children .info .tag .brush {
		border: #0048FE solid 1rpx;
		background: #0048FE;
		padding: 2rpx 10rpx;
		border-radius: 12rpx;
		color: #fff !important;
	}

	.list .children .info .tag .brush.success {
		border: #1BA035 solid 1rpx;
		color: #1BA035 !important;
		background: none;
	}
	.list .children .info .tag .brush.grey{
		border: #ABB2BF solid 1rpx;
		color: #ABB2BF !important;
		background: none;
	}
	.class-info{
		padding: 10rpx 20rpx;
		display: flex;
	}
	.class-info .left{
		width: 200rpx;
		height: 100rpx;
		border-radius: 5rpx;
		overflow: hidden;
	}
	.class-info .right{
		padding-left: 20rpx;
		width: 100%;
		height:100rpx;
	}
	.class-info .left .image{
		width: 100%;
		height: 100%;
	}
	.class-info .right .name{
		margin-top: 10rpx;
		color: #fff;
		width: 450rpx;
		font-size: 28rpx;
		white-space: nowrap; /* 防止文本换行 */
		overflow: hidden; /* 隐藏超出元素宽度的文本 */
		text-overflow: ellipsis; /* 显示省略号 */
	}
	.class-info .right .tags{
		margin-top: 10rpx;
		display: flex;
		justify-content: start;
	}
	.class-info .right .tags view{
		margin-right: 20rpx;
		color: #ABB2BF !important;
		background: none;
		font-size: 25rpx;
	}
	.brush-popup-view {
		width: 100%;
		background: #111316;
		height: 520rpx;
		border-radius: 30rpx 30rpx 0 0;
		box-shadow: 0 2px 10px 0 rgba(255,255,255, 0.1);
	}
	.brush-popup-view{
		padding-top: 25rpx;
	}
	.brush-popup-view .main{
		width: 92%;
		height: 350rpx;
		background: #21252B;
		border-radius: 30rpx;
		margin: 0 auto;
		padding-top: 15rpx;
		position: relative;
	}
	.brush-popup-view .main .title{
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		font-weight: 800;
	}
	.brush-popup-view .bottom{
		position: absolute;
		bottom: 0;
		left: 0;
		background: #0048FE;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 31rpx;
		text-align: center;
		color: #fff;
		font-weight: 800;
		letter-spacing: 20rpx;
	}
	.brush-popup-view .main .empty{
		text-align: center;
		font-size: 33rpx;
		color: #fff;
		width: 90%;
		margin: 0 auto;
		margin-top: 100rpx;
	}
	.brush-popup-view .main .empty span{
		color: #0048FE;
	}
	.brush-popup-view .main .info{
		display: flex;
		justify-content: space-around;
		padding: 0rpx 30rpx;
		margin-top: 10rpx;
	}
	.brush-popup-view .main .info .left{
		width: 280rpx;
		height: 280rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}
	.brush-popup-view .main .info .left >image{
		width: 100%;
		height: 100%;
	}
	.brush-popup-view .main .info .right{
		height: 280rpx;
		width: 100%;
		margin-left: 25rpx;
		color: #fff;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.brush-popup-view .main .info .right .item{
		margin-bottom: 5rpx;
	}
	.brush-popup-view .main .info .right .item::before{
		content: '';
		height: 15rpx;
		width:15rpx;
		border-radius: 50%;
		display: inline-block;
		background: #0048FE;
		margin-right: 8rpx;
	}
	.brush-popup-view .tips{
		font-size: 25rpx;
		color: #aaa;
		padding: 0 20rpx;
		text-align: center;
		margin-top: 5rpx;
	}
	.brush-popup-view .tips span{
		font-weight: 800;
	}
</style>