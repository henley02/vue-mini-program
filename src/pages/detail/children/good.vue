<template>
  <div>
    <div class='m-picture-number'>
      <text>{{sliderIndex}} / {{pictureList.length}}</text>
    </div>
    <div class="m-banner-ad">
      <swiper autoplay="false" interval="3000" duration="300" current="0" @change='changeSlider'>
        <swiper-item v-for="(item,index) in pictureList" :key="index">
          <image class="slide-image" :src="item.url"/>
        </swiper-item>
      </swiper>
    </div>
    <div class="m-cells">
      <div class="m-info-box">
        <div>
          <div class='p-info'>{{commodity.name}}</div>
          <div class='p-info-price'>
            <div class='p-price-text'>
              <div class="m-info-price">￥
                <text>{{Salespromotion ? Salespromotion : showPriceone}}</text>
              </div>
              <div class='p-info-text' v-if="Salespromotion < showPriceone || showPrice < showPriceone">促销价</div>
            </div>
            <div class="m-info-delprice">价格
              <text>￥{{showPriceone}}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-panel-ft" >
      <div class="m-cell m-cell-access m-cell-links" @tap='showSpecification'>
        <div class="m-cell-bd">
          <div class='p-cell-content'>规格</div>
          <text class='m-cell-content'>{{spec1ValueName}} {{spec2ValueName}} {{spec3ValueName}}</text>
        </div>
        <text class="m-cell-ft"></text>
      </div>
    </div>
    <div class="m-panel-ft">
      <div class="m-cell m-cell-access m-cell-links" @tap='showCouponList'>
        <div class="m-cell-bd">
          <div class='p-cell-content'>优惠券</div>
          <text> {{couponLength}}张可领取</text>
        </div>
        <text class="m-cell-ft"></text>
      </div>
    </div>
    <div class="m-panel-ft" style='margin-bottom:20rpx'>
      <div class="m-cell m-cell-access m-cell-links" @tap="goAddressList">
        <div class="m-cell-bd">
          <div class='p-cell-content'>送至</div>
          <text class='m-cell-content' v-if="address!=null&& address != 'undefined'">{{address}}</text>
        </div>
        <text class="m-cell-ft"></text>
      </div>
    </div>
    <div class="m-panel-ft">
      <div class="m-cell-access">
        <div class="m-cell-bd" v-if="evaluate.evaluationNumber!==0">
          <div class='p-cell-evaluate'>评价({{evaluate.evaluationNumber}})</div>
          <text class='p-evaluate-bd' @tap='changeTab(2)'>查看全部</text>
          <text class="m-cell-ft"></text>
        </div>
        <div class="m-cell m-cell-access m-cell-links" v-if="evaluate.evaluationNumber==0">
          <div class="m-cell-content">暂无评价</div>
        </div>
      </div>
    </div>
    <div class='p-panel' @tap='changeTab(1)'>查看全部图文详情</div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'good',
    props: {
      pictureList: {type: Array},
      commodity: {type: Object},
      couponLength: {},
      address: {},
      evaluate: {},
      spec1ValueName: {},
      spec2ValueName: {},
      spec3ValueName: {},
      Salespromotion: {},
      showPriceone: {},
      showPrice: {}
    },
    data() {
      return {
        sliderIndex: 1 // 轮播图的索引
      };
    },
    methods: {
      showCouponList() {
        this.$emit('showCouponList');
      },
      goAddressList() {
        this.$emit('goAddressList');
      },
      /**
       * 滚动大图
       */
      changeSlider(e) {
        this.sliderIndex = e.target.current + 1;
      },
      changeTab(index) {
        this.$emit('changeTab', index);
      },
      showSpecification() {
        this.$emit('showSpecification');
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .m-picture-number {
    width: rpx(117);
    height: rpx(63);
    background-color: #333;
    position: absolute;
    z-index: 2;
    right: rpx(30);
    top: rpx(600);
    opacity: 0.5;
    border-radius: rpx(30);
    text-align: center;
    color: #fff;
    line-height: rpx(58);
    font-size: rpx(30);
  }

  .m-banner-ad {
    width: rpx(750);
    height: rpx(750);
  }

  .m-banner-ad swiper {
    width: 100%;
    height: 100%;
  }

  .slide-image {
    width: 100%;
    height: 100%;
  }

  .m-cells {
    height: rpx(175);
    width: 100%;
    padding: rpx(25) 0 rpx(25) rpx(30);
    background: #fff;
    margin-bottom: rpx(20);
  }

  .m-cell::before {
    border-top: 0 solid #d9d9d9;
  }

  .m-info-box label {
    color: #EA281A;
    display: block;
    font-size: rpx(28);
  }

  .m-panel-ft {
    background: #fff;
  }

  .m-cell-content {
    color: #000000;
    text-align: left;
  }

  .m-cell-ft {
    padding-top: rpx(8);
  }

  .m-info-price {
    color: #EA281A;
    font-size: rpx(32);
  }

  .m-info-price text {
    font-size: rpx(48);
    font-weight: bold;
  }

  .p-info {
    font-family: PingFangSC-Regular;
    font-size: rpx(30);
    color: #000;
    line-height: rpx(0);
    min-height: 30px;
    text-align: left;
  }

  .p-price-text {
    display: flex;
  }

  .p-info-text {
    width: rpx(66);
    height: rpx(22);
    line-height: rpx(22);
    text-align: center;
    font-size: rpx(20);
    color: #ea281a;
    border: rpx(1) solid #EA281A;
    border-radius: rpx(4);
    margin: 14px 0 0 10px;
  }

  .m-info-delprice {
    font-size: rpx(24);
    color: #999999;
    padding-left: rpx(6);
  }

  .m-info-delprice text {
    text-decoration: line-through;
    font-size: rpx(24);
  }

  .p-cell-content {
    width: 70px;
  }

  .p-panel {
    background: #ffffff;
    width: 100%;
    height: rpx(98);
    margin-bottom: rpx(147);
    margin-top: rpx(20);
    font-size: rpx(28);
    text-align: center;
    line-height: rpx(98);
  }

  .m-cell-links {
    border-top: rpx(1) solid #eeeeee;
  }

</style>
