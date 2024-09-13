<template>
	<view class="x-text" :scroll-y="true" :class="[classList]" :style="{
		color,
		'font-size': parseRpx(size),
		'-webkit-line-clamp': ellipsis,
		margin: parseRpx(margin)
		}">
		<u-icon v-if="icon" :name="icon" :size="iconSize" style="margin-right: 8rpx;"></u-icon>
		{{ value }}
	</view>
</template>

<script>
	export default {
		name: "x-text",
		props: {
			// 绑定值
			value: [String, Number],

			// 是否粗体 800
			bold: Boolean,

			// 是否块状
			block: Boolean,

			// 文本超出省略
			ellipsis: Number,
			
			// 图标
			icon: {
				type: [String,Boolean],
				default: false,
			},
			// 图标大小
			iconSize: {
				type: [String,Number],
				default: "inherit",
			},
			
			// 字体颜色
			color: {
				type: String,
				default: "#444",
			},

			// 字体大小
			size: {
				type: [String, Number],
				default: 24,
			},

			// 外间距
			margin: {
				type: [String, Number, Array],  //[上，右，下，左]
				default: 0
			},

			// 居中
			center: Boolean,
			
			// 靠右
			right: Boolean,
			
			// 靠左
			left: Boolean,
		},
		data() {
			return {

			};
		},
		computed: {
			classList() {
				let list = [];

				if (this.bold) {
					list.push("bold");
				}

				if (this.block) {
					list.push("block");
				}

				if (this.ellipsis > 0) {
					list.push("ellipsis");
				}

				if (this.center) {
					list.push("center");
				}
				
				if (this.right) {
					list.push("right");
				}
				
				if (this.left) {
					list.push("left");
				}

				return list.join(" ");
			},
		},
		methods: {
			parseRpx(val) {
				return this.isArray(val) ? val.map(this.parseRpx).join(" ") : this.isNumber(val) ? val + "rpx" : val;
			},
			isArray(value) {
				return Object.prototype.toString.call(value) === '[object Array]';
			},
			isNumber(value) {
				return Object.prototype.toString.call(value) === '[object Number]' && !isNaN(value);
			}
		}
	}
</script>
<style>

</style>