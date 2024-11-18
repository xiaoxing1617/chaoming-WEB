<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:"",
			}
		},
		onLoad(opt){
			let src = decodeURIComponent(opt.src);
			this.src = src;
		}
	}
</script>

<style>

</style>
