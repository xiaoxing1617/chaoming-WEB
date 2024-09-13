<template id="xingCommon">
	<view>
		<u-toast ref="toast" />
		<u-modal ref="modal" @confirm="modalConfirm()" @cancel="modalCancel()" cancelColor="#aaa"
			:showCancelButton="modal.showCancelButton" :cancelText="modal.cancelText" :confirmText="modal.confirmText"
			:showTitle="modal.showTitle" :title="modal.title" v-model="modal.show" :content="modal.content"
			:zIndex="modal.zIndex"></u-modal>
	</view>
</template>

<script>
	export default {
		name: "xingCommon",
		data() {
			return {
				initModal: {
					show: false,
					zIndex: 1075,
					showTitle: false,
					title: "",
					content: "",
					confirmText: "确认",
					cancelText: "取消",
					showCancelButton: false,
					confirm: () => {},
					cancel: () => {},
				},
				modal: {},
			};
		},
		methods: {
			toast(params){
				this.$refs.toast.show(params)
			},
			modalConfirm() {
				this.modal.confirm();
			},
			modalCancel() {
				this.modal.cancel();
			},
			openModal(obj) {
				this.modal.show = false;
				let modal = {
					...this.initModal,
					...obj
				}
				modal.show = true;
				this.$set(this, "modal", modal)
			}
		},
	}
</script>

<style lang="scss">

</style>