<template>
  <div class="m-panel-sp" style='z-index:999;'>
    <div class="m-panel-sp-content">
      <div class="m-panel-sp-listbox-item">
        <div class="m-cells-title">领取优惠券</div>
      </div>
      <div v-if="couponDefinition.length === 0">
        <image :src='noCouponImg' class='shoppingcart'/>
        <div class='text'>无可用优惠券</div>
      </div>
      <scroll-view class="m-panel-sp-listbox" scroll-y="true">
        <block v-for="(item,index) in couponDefinition" :key="index">
          <block>
            <div class='y-cell'>
              <div class='y-img'>
                <image :src='couponBg'/>
                <div class="y-con" v-if="item.maxCount === item.sendCount" style="color:#ccc">已领完</div>
                <div class='y-con' v-else @tap="onReceiveCouponTap(item)">领取</div>
                <div class='y-juan'>
                  <div>{{item.name}}</div>
                  <div>有效期至：{{item.endGetTime}}</div>
                </div>
              </div>
            </div>
          </block>
        </block>
      </scroll-view>
      <div class="m-m-panel-sp-btn">
        <div class="m-m-panel-sp-rbtn" @tap="closeCouponList()">关闭</div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * 优惠券弹框
   */
  export default {
    name: 'coupon-list',
    props: {
      couponDefinition: {type: Array},
      textIndex: {type: Number}
    },
    data() {
      return {
        couponBg: require('public/images/user/coupon-bg.png'),
        noCouponImg: require('public/images/user/nocoupon.png')
      };
    },
    methods: {
      closeCouponList() {
        this.$emit('closeCouponList');
      },
      /**
       * 领取优惠券
       */
      async onReceiveCouponTap(item) {
        this.$emit('onReceiveCouponTap', item);
      }
    },
    created() {
    },
    mounted() {
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
