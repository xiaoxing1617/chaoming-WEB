(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-testList-testList"],{"1dd2":function(t,i,n){var e=n("b995");e.__esModule&&(e=e.default),"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var s=n("967d").default;s("10bd79fe",e,!0,{sourceMap:!1,shadowMode:!1})},3207:function(t,i,n){"use strict";n.r(i);var e=n("c428"),s=n.n(e);for(var a in e)["default"].indexOf(a)<0&&function(t){n.d(i,t,(function(){return e[t]}))}(a);i["default"]=s.a},"8c78":function(t,i,n){"use strict";n.d(i,"b",(function(){return s})),n.d(i,"c",(function(){return a})),n.d(i,"a",(function(){return e}));var e={uniPopup:n("ec42").default,uniPopupDialog:n("e6fa").default},s=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("v-uni-view",[n("v-uni-view",{staticClass:"refresh",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.getMeTestList.apply(void 0,arguments)}}},[t._v("刷新列表")]),t._l(t.list,(function(i,e){return n("v-uni-view",{staticClass:"li"},["not"==i.status?n("v-uni-view",{staticClass:"status"},[t._v("未开始")]):"wait"==i.status?n("v-uni-view",{staticClass:"status",staticStyle:{background:"#f00"}},[t._v("待考试")]):"proceed"==i.status?n("v-uni-view",{staticClass:"status",staticStyle:{background:"#0048FE"}},[t._v("考试中")]):"finish"==i.status?n("v-uni-view",{staticClass:"status",staticStyle:{background:"#1CAD1B"}},[t._v("已结束")]):t._e(),n("v-uni-view",{staticClass:"title"},[t._v(t._s(i.title))]),n("v-uni-view",{staticClass:"txt"},[t._v("考试ID："+t._s(i.id)+"（"+t._s(i.order)+"）")]),n("v-uni-view",{staticClass:"txt"},[t._v("开始时间："+t._s(i.open_start))]),n("v-uni-view",{staticClass:"txt"},[t._v("结束时间："+t._s(i.open_end))]),n("v-uni-view",{staticClass:"txt"},[t._v("总分："+t._s(i.total_score)+"分")]),n("v-uni-view",{staticClass:"txt"},[t._v("得分："+t._s(i.get_score)+"分")]),n("v-uni-view",{staticClass:"txt"},[t._v("时长："+t._s(i.time_length)+"分钟")]),i.is_support?"wait"==i.status?n("v-uni-view",{staticClass:"but",staticStyle:{background:"#f00"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.tips.apply(void 0,arguments)}}},[t._v("等待进入考试")]):"proceed"==i.status?n("v-uni-view",{staticClass:"but",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.getTestAnswer(i.id)}}},[t._v("解密答案")]):"finish"==i.status?n("v-uni-view",{staticClass:"but",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.getTestAnswer(i.id)}}},[t._v("查看答案")]):t._e():n("v-uni-view",{staticClass:"but",staticStyle:{background:"#4B5364"}},[t._v("不支持解密")])],1)})),n("uni-popup",{ref:"alertDialog",attrs:{type:"dialog"}},[n("uni-popup-dialog",{attrs:{type:t.msg.type,cancelText:t.msg.close_txt,confirmText:t.msg.confirm_txt,title:"提示",content:t.msg.content},on:{confirm:function(i){arguments[0]=i=t.$handleEvent(i),t.msg.confirm.apply(void 0,arguments)},close:function(i){arguments[0]=i=t.$handleEvent(i),t.msg.close.apply(void 0,arguments)}}})],1),n("uni-popup",{ref:"brushPopup"},[n("v-uni-view",{staticClass:"brush-popup-view"},[n("v-uni-view",{staticClass:"main"},[n("v-uni-view",{staticClass:"title"},[t._v(t._s(t.testAnswer.title))]),n("v-uni-view",{staticClass:"answer-list"},t._l(t.testAnswer.list,(function(i,e){return n("v-uni-view",{staticClass:"item"},[n("v-uni-view",{staticClass:"topic"},[n("span",[t._v(t._s(e+1)+".")]),t._v(t._s(i.title))]),n("v-uni-view",{staticClass:"answer"},[t._v(t._s(i.op))])],1)})),1)],1)],1)],1)],2)},a=[]},b2dd:function(t,i,n){"use strict";var e=n("1dd2"),s=n.n(e);s.a},b995:function(t,i,n){var e=n("c86c");i=e(!1),i.push([t.i,"uni-page-body[data-v-fd0b399c]{width:100%;background:#282c35}body.?%PAGE?%[data-v-fd0b399c]{background:#282c35}.refresh[data-v-fd0b399c]{width:90%;margin:%?10?% auto;margin-top:%?20?%;border-radius:%?50?%;padding:%?12?% %?20?%;text-align:center;font-size:%?29?%;font-weight:800;background:#0048fe;color:#fff;letter-spacing:%?7?%}.li[data-v-fd0b399c]{border-radius:%?12?%;color:#fff;width:95%;margin:%?20?% auto;background:#21242d;padding-bottom:%?20?%}.li>.status[data-v-fd0b399c]{border-radius:%?12?% 0 %?12?% 0;background:#4b5364;padding:%?4?% %?10?%;font-size:%?25?%;display:inline-block}.li>.title[data-v-fd0b399c]{font-weight:800;font-size:%?35?%;margin:%?10?% %?25?%}.li>.txt[data-v-fd0b399c]{font-weight:500;font-size:%?28?%;color:#abb2bf;margin:%?5?% %?25?%}.li>.but[data-v-fd0b399c]{width:90%;margin:%?10?% auto;margin-top:%?20?%;border-radius:%?50?%;padding:%?12?%;text-align:center;font-size:%?29?%;font-weight:800;background:#0048fe;letter-spacing:%?7?%}.brush-popup-view[data-v-fd0b399c]{width:100%;background:#111316;height:%?650?%;border-radius:%?30?% %?30?% 0 0;box-shadow:0 2px 10px 0 hsla(0,0%,100%,.1)}.brush-popup-view[data-v-fd0b399c]{padding-top:%?25?%}.brush-popup-view .main[data-v-fd0b399c]{width:92%;height:%?610?%;background:#21252b;border-radius:%?30?%;margin:0 auto;padding-top:%?15?%;position:relative}.brush-popup-view .main .title[data-v-fd0b399c]{color:#0048fe;text-align:center;font-size:%?33?%;font-weight:800;margin-bottom:%?10?%}.answer-list[data-v-fd0b399c]{height:%?540?%;overflow-y:scroll;color:#fff;padding:%?5?% %?15?%}.answer-list>.item[data-v-fd0b399c]{border-bottom:#282c35 solid %?1?%;margin:%?10?% auto;padding-bottom:%?15?%}.answer-list>.item .topic[data-v-fd0b399c]{font-size:%?30?%;background:#1b212b;border-radius:%?12?%;padding:%?8?% %?12?%;margin-bottom:%?5?%}.answer-list>.item .topic>span[data-v-fd0b399c]{color:#0048fe;font-weight:800;font-size:%?32?%}.answer-list>.item .answer[data-v-fd0b399c]{font-size:%?30?%;padding-left:%?10?%}",""]),t.exports=i},c428:function(t,i,n){"use strict";n("6a54"),Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,n("aa77"),n("bf0f");var e={data:function(){return{list:[],APP:getApp(),msg:{type:"error",content:"",confirm:function(){},close:function(){},confirm_txt:"知道了",close_txt:"关闭"},testAnswer:{title:"",list:[]}}},methods:{getTestAnswer:function(t){var i=this,n=this.list.find((function(i){return i.id===t}));this.testAnswer.title=n.title;this.APP.getUserInfo().then((function(t){var e=uni.getStorageSync("login_token");e?i.login_token=e:uni.setStorageSync("login_token",null),uni.showLoading({title:"请稍后...",mask:!0}),uni.request({url:i.APP.globalData.basicUrl+"/Index/viewTestAnswer",data:{token:i.login_token,test_id:n.id,index:n.order},success:function(t){var n;uni.hideLoading(),t.data&&null!==(n=t.data)&&void 0!==n&&n.code&&1*t.data.code===1?(i.testAnswer.list=t.data.data,i.$refs.brushPopup.open("bottom")):(i.msg.type="error",i.msg.content=t.data.msg,i.$refs.alertDialog.open())},fail:function(){uni.hideLoading(),this.msg.type="error",this.msg.content="系统繁忙",this.$refs.alertDialog.open()}})})).catch((function(t){i.msg.type="error",i.msg.content=t,i.msg.confirm_txt="去登录",i.msg.confirm=i.msg.close=function(){uni.navigateTo({url:"/pages/index/index"})},i.$refs.alertDialog.open()}))},tips:function(){this.msg.type="info",this.msg.content="您需要先进入考试才能解密获取本场考试的答案。（须知：朝明在线或本程序出现问题时可能无法解密成功）",this.$refs.alertDialog.open()},getMeTestList:function(){var t=this;this.APP.getUserInfo().then((function(i){var n=uni.getStorageSync("login_token");n?t.login_token=n:uni.setStorageSync("login_token",null),uni.showLoading({title:"请稍后...",mask:!0}),uni.request({url:t.APP.globalData.basicUrl+"/Index/getMeTestList",data:{token:t.login_token},success:function(i){var n;uni.hideLoading(),i.data&&null!==(n=i.data)&&void 0!==n&&n.code&&1*i.data.code===1?t.list=i.data.data:(t.loginLoading=!1,t.msg.type="error",t.msg.content=i.data.msg,t.$refs.alertDialog.open())},fail:function(){uni.hideLoading(),this.loginLoading=!1,this.msg.type="error",this.msg.content="系统繁忙",this.$refs.alertDialog.open()}})})).catch((function(i){t.loginLoading=!1,t.msg.type="error",t.msg.content=i,t.msg.confirm_txt="去登录",t.msg.confirm=t.msg.close=function(){uni.navigateTo({url:"/pages/index/index"})},t.$refs.alertDialog.open()}))}},onLoad:function(){this.getMeTestList()}};i.default=e},c7f4:function(t,i,n){"use strict";n.r(i);var e=n("8c78"),s=n("3207");for(var a in s)["default"].indexOf(a)<0&&function(t){n.d(i,t,(function(){return s[t]}))}(a);n("b2dd");var o=n("828b"),r=Object(o["a"])(s["default"],e["b"],e["c"],!1,null,"fd0b399c",null,!1,e["a"],void 0);i["default"]=r.exports}}]);