# liu-indexed-list适用于uni-app项目的通讯录、城市、地址索引列表组件
### 本组件目前兼容微信小程序、H5
### 本组件是通讯录、城市、地址索引列表组件，自带搜索功能，可自定义显示字段，用于通讯录列表、城市列表、地址列表等
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用示例
``` 
<template>
	<view class="page-main">
		<liu-indexed-list :dataList="dataList" @click="click"></liu-indexed-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [{
					id: '1',
					name: '刘**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2022/03/31/14/53/camp-7103189_1280.png'
				}, {
					id: '2',
					name: '税**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2021/07/22/11/25/rabbit-6485072_1280.jpg'
				}, {
					id: '3',
					name: '柴**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/35/cartoon-5190860_1280.jpg'
				}, {
					id: '4',
					name: '王**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/32/cartoon-5190837_1280.jpg'
				}, {
					id: '5',
					name: '马**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2023/03/07/12/45/child-7835677_1280.jpg'
				}, {
					id: '6',
					name: '韩**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2022/11/29/19/05/boho-7625140_1280.jpg'
				}, {
					id: '7',
					name: '张**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/32/cartoon-5190837_1280.jpg'
				}, {
					id: '8',
					name: '王**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/35/cartoon-5190860_1280.jpg'
				}, {
					id: '9',
					name: '张**',
					phone: '18198045576',
					img: 'https://cdn.pixabay.com/photo/2021/07/22/11/25/rabbit-6485072_1280.jpg'
				}, {
					id: '10',
					name: '李**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2022/03/31/14/53/camp-7103189_1280.png'
				}]
			}
		},
		methods: {
			//点击列表回调事件
			click(e) {
				console.log('点击列表回调：', e)
			}
		}
	}
</script>
```

### 属性说明
| 名称                         | 类型            | 默认值                 | 描述             |
| ----------------------------|--------------- | ---------------------- | ---------------|
| dataList                    | Array          | []                     | 数据源
| idKey                       | String         | id                     | 显示的主键key值
| nameKey                     | String         | name                   | 显示的名字key值
| phoneKey                    | String         | phone                  | 显示的电话key值
| imgKey                      | String         | img                    | 显示的头像key值
| radius                      | Number         | 4rpx                   | 头像圆角(rpx、px、%)
| @click                      | Function       |                        | 点击列表回调事件

