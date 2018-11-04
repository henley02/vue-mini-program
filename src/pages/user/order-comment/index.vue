<template>
  <div>
    <div class='m-cell-content' v-for="(good,index) in goods" :key="index">
      <div class='m-cell-img'>
        <image :src='good.pictureUrl' class='img'/>
        <div class='introduce'>
          <div class='c-introduce'>{{good.commodityTitle}}</div>
          <div class='many'>{{good.itemSpec1AttributeName}}: {{good.itemSpec1ValueName}}</div>
        </div>
      </div>
      <div class="m-start">
        <div class='container'>
          <div class='evaluate_contant'>
            <!--外层循环控制有几个评价条目  -->
            <block v-for="(item,itemIndex) in evaluate_contant" :key="itemIndex">
              <div class='evaluate_item'>
                <div class='evaluate_title'>{{item}}</div>
                <!--星星评价  -->
                <div class='evaluate_box'>
                  <!--内层循环展示每个评价条目的星星  -->
                  <block v-for="(star,starIndex) in good.stars" :key="starIndex">
                    <image class="star-image" :style="{left: item*60+'rpx'}"
                           :src="good.scores[idx] > item ?selectedSrc: normalSrc">
                      <div class="item" style="left:0rpx" bindtap="selectLeft"></div>
                      <div class="item" style="left:20rpx" bindtap="selectLeft"></div>
                    </image>
                  </block>
                </div>

              </div>
            </block>
          </div>
        </div>
      </div>
      <div class='c-share'>
        <textarea bindinput="bindContentInput" placeholder='分享您的购物过程~'
                  placeholder-style='font-size:28rpx;color: #999999;' :value='item.content'
                  class='c-writing'></textarea>
      </div>
      <div class="m-upImg">
        <div class="m-upImg-item">
          <image :src="addFileImg" bindtap="onAddImgTap"/>
        </div>

        <div class="m-upImg-item" catchtap="upImgs" style='background:#eee' v-for="(item,i) in imgList" :key="i">
          <image :src="item.filePath"></image>
          <image class='c-icon' :src="deleteImg" catchtap="deleteImg"/>
        </div>
      </div>

      <div class='c-select' bindtap='onAnonymousTap'>
        <div class="is-default" :class="{active:form.isDefault}" @tap="changeDefault"></div>
        <div class='anonymity'>匿名评价</div>
      </div>
    </div>
    <div>
      <div class='c-btn' bindtap="onSubmitTap">提交</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 订单评论
  * */
  import {fetchCommentDetail} from 'api/index';

  export default {
    name: 'consumption-records',
    data() {
      return {
        addFileImg: require('public/images/user/addpicture.png'),
        deleteImg: require('public/images/user/delete.png'),
        normalSrc: require('public/images/user/stargray.png'),
        selectedSrc: require('public/images/user/starcolor.png'),
        userInfo: {},
        orderId: '',
        evaluate_contant: ['评分'],
        goods: [],
        imgList: []
      };
    },
    methods: {
      async init() {
        let params = {
          id: this.orderId,
          passportId: this.userInfo.id
        };
        let res = await fetchCommentDetail(params);
        if (res.firstErrorMessage === '') {
          res.order.orderLineList.forEach((item) => {
            item.imgs = [];
            item.content = '';
            item.score = 0;
            item.isAnonymous = false;
            item.isAddtion = false;
            item.hasAttachment = false;
            item.hasAddtion = false;
            item.stars = [0, 1, 2, 3, 4];
            item.scores = [0, 1, 2, 3, 4];
          });
          this.goods = res.order.orderLineList;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onLoad(options) {
      this.orderId = options.orderId;
      if (!this.orderId) {
        // 订单异常点击确定后返回上一个页面
        this.$bridge.dialog.alert({
          content: '订单异常！',
          confirmCallback: () => {
            wx.navigateBack();
          }
        });
      } else {
        this.userInfo = this.$bridge.storage.get('userInfo');
        this.init();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .is-default
    display: inline-block;
    background-image: url("../../../public/images/address/select.png");
    background-repeat: no-repeat
    background-size: 100% 100%
    height: rpx(35)
    width: rpx(35)
    position: relative;
    top: rpx(6)
    &.active
      background-image: url("../../../public/images/address/selected.png");
</style>
