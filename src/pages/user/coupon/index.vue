<template>
  <div class="wrapper">
    <div class="m-product-all">
      <div class="m-tab">
        <div class="m-navbar">
          <div class="m-navbar-item" :class="{'m-navbar-item-on':tabIndex===index}" @tap="changeTab(index)"
               v-for="(item,index) in tabList" :key="index">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
    <scroll-view class='m-ordrelist' @scrolltolower="dropDown" scroll-y="true" style='height:100%;'>
      <div class='y-img' v-for="(item,index) in list " :key="index" @tap='tabIndex === 0 && goIndex()'>
        <image :src='img0' v-if="tabIndex === 0"/>
        <image :src='img1' v-else/>
        <div class='y-con'>{{item.profitConfig.reliefAmount}}元</div>
        <div class='y-juan' v-if="tabIndex === 0">
          <div>{{item.couponName}}</div>
          <div>有效期至：{{item.startTime}}~{{item.endTime}}</div>
        </div>
        <div class='y-juan' v-else>
          <div style='color:black'>{{item.couponName}}</div>
          <div style='color:#999'>有效期至：{{item.endTime}}</div>
        </div>
        <div class='button' v-if="tabIndex !==0" @tap.stop="goIndex()">去逛逛</div>
      </div>
      <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
      <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>

      <div v-if="list.length === 0 && isEnd">
        <image :src='noDataImg' class='shoppingcart'></image>
        <div class='text'>暂无优惠券</div>
      </div>
    </scroll-view>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 我的账户
  * */
  import {fetchCouponList} from 'api/index';

  export default {
    name: 'consumption-records',
    data() {
      return {
        tabIndex: 0,
        img0: require('public/images/user/copy.png'),
        img1: require('public/images/user/usedCoupon.png'),
        noDataImg: require('public/images/user/nocoupon.png'),
        tabList: [
          {name: '待使用', index: 0},
          {name: '已使用', index: 1},
          {name: '已过期', index: 2}
        ],
        userInfo: {},
        list: [],
        isLoading: false,
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        isEnd: false,
        canDropDown: true // 是否可以下拉加载
      };
    },
    methods: {
      goIndex() {
        this.$bridge.link.goIndex();
      },
      changeTab(index) {
        this.tabIndex = index;
        this.pageNumber = 1;
        this.isEnd = false;
        this.canDropDown = true;
        this.fetchList();
      },
      async fetchList() {
        this.isLoading = true;
        if (this.pageNumber === 1) {
          this.list = [];
        }
        let params = {
          systemTypeList: ['ALL', 'B2C'],
          passportId: this.userInfo.id,
          memberId: this.userInfo.memberId,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        if (this.tabIndex === 0) {
          params.isAvailable = true;
        }
        if (this.tabIndex === 1) {
          params.isUsed = true;
        }
        if (this.tabIndex === 2) {
          params.isUsed = false;
          params.isUsefulEndOut = true;
        }
        let res = await fetchCouponList(params, {isLoading: this.pageNumber === 1});
        res.result.forEach((item) => {
          item.startTime = this._dateFormat(item.usefulStart, 'yyyy-MM-dd');
          item.endTime = this._dateFormat(item.usefulEnd, 'yyyy-MM-dd');
          item.profitConfig = JSON.parse(item.profitConfig);
        });
        this.list = this.list.concat(res.result);
        // 判断数据是否全部加载完
        if (res.result.length < this.pageSize) {
          this.isEnd = true;
          this.canDropDown = false;
        } else {
          this.canDropDown = true;
          this.pageNumber++;
        }
        this.isLoading = false;
      },
      /**
       * 下拉加载
       */
      dropDown() {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        this.fetchList();
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.fetchList();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .y-img {
    width: 100%;
    height: rpx(158);
    margin-bottom: rpx(20);
    margin-left: rpx(30);
    margin-right: rpx(30);

  }

  .y-img image {
    width: rpx(693);
    height: rpx(158);
  }

  .y-con {
    position: relative;
    top: rpx(-126);
    color: #fff;
    font-size: rpx(48);
    text-align: center;
    width: rpx(172);

  }

  .y-juan {
    position: relative;
    top: rpx(-190);
    left: rpx(226);
    color: #fff;

  }

  .y-juan div:nth-child(1) {
    font-size: rpx(32);
  }

  .y-juan div:nth-child(2) {
    font-size: rpx(24);
    position: relative;
    top: rpx(2);

  }

  /*全部商品 end*/

  .m-tab {
    position: relative;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 6;
  }

  .m-navbar {
    position: fixed;
    top: 0;
    height: rpx(94);
    line-height: rpx(60);
    width: 100%;

  }

  .m-navbar-item {
    padding: rpx(20) 0;
    font-size: rpx(24);
  }

  .m-navbar-item:after {
    border: none;
  }

  .m-navbar-item.m-navbar-item-on {
    background-color: #fff;
    color: #db384c;
  }

  .m-navbar-item.m-navbar-item-on::before {
    content: " ";
    position: relative;
    left: 0;
    bottom: 0;
    right: 0;
    height: rpx(6);
    border-bottom: rpx(6) solid #db384c;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 3;
  }

  .button {
    position: relative;
    top: rpx(-244);
    left: rpx(555);
    font-size: rpx(24);
    width: rpx(122);
    color: white;
    border-radius: rpx(4);
    height: rpx(38);
    text-align: center;
    background-image: linear-gradient(89deg, #CCCCCC 0%, #999999 100%);
  }

  .shoppingcart {
    position: relative;
    top: rpx(415);
    left: rpx(290);
    height: rpx(171);
    width: rpx(171);
  }

  .text {
    position: relative;
    top: rpx(435);
    text-align: center;
    color: #999999;
    font-size: rpx(28);
  }

  .m-ordrelist {
    padding-top: rpx(120);
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
</style>
