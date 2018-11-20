<template>
  <scroll-view class="m-logistic" v-if="orderLogisticsInfo.length > 0">
    <div class='l-logistic'>
      <image :src='pictureUrl' class='m-product'/>
      <div class='m-product-Info'>
        <div class="m-product-position" v-if="orderLogisticsInfo[0].logisticsStatus == 0">在途中 {{orderLogisticsContent}}</div>
        <div class="m-product-position" v-if="orderLogisticsInfo[0].logisticsStatus == 1">已发货 {{orderLogisticsContent}}</div>
        <div class="m-product-position" v-if="orderLogisticsInfo[0].logisticsStatus == 2">疑难件 {{orderLogisticsContent}}</div>
        <div class="m-product-position" v-if="orderLogisticsInfo[0].logisticsStatus == 3">已签收 {{orderLogisticsContent}}</div>
        <div class="m-product-position" v-if="orderLogisticsInfo[0].logisticsStatus == 4">已退货 {{orderLogisticsContent}}</div>
        <div class='m-product-express'>{{orderLogisticsInfo[0].carrierName}}:{{orderLogisticsInfo[0].freightOrderNumber}}</div>
      </div>
      <div class='m-produc-number'></div>
    </div>
    <block v-for="(item,index) in orderLogisticsInfo" :key="index">
      <div class="m-logistbox" style="padding-bottom: 50rpx; ">
        <div class='m-log-time' v-for="(items,i) in item.logisticsDetailList" :key="i">
          <div :class="{'m-logistitem-items':index===0,'m-logistitem-item':index===1,'m-logistitem':index!==0&& index!==1}">
            {{items.context}}
          </div>
          <div class='m-logistitem-cell'>
            <div v-if="index==0 || index==1" style='position:relative;left:20rpx'>{{items.time}}</div>
            <div v-if="index!=0 && index!=1">{{items.time}}</div>
            <image src='../../img/shou.png' class='m-logistitem-cell-img' v-if="index==0"/>
          </div>
        </div>
        <div/>
      </div>
    </block>
  </scroll-view>
</template>
<script type="text/ecmascript-6">
  /*
  *  物流详情
  * */
  import {fetchMembership, fetchMemberBalance} from 'api/index';

  export default {
    name: 'consumption-records',
    data() {
      return {
        userInfo: {},
        rest: '',
        total: ''
      };
    },
    methods: {
      async userAccount() {
        let params = {
          id: this.userInfo.memberId,
          passportId: this.userInfo.id
        };
        let res = await fetchMembership(params);
        if (res.firstErrorMessage === '') {
          this.total = res.member.calSpendAmount;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 查询可用余额
       * @returns {Promise.<void>}
       */
      async getBalance() {
        let params = {
          memberId: this.userInfo.memberId,
          passportId: this.userInfo.id
        };
        let res = await fetchMemberBalance(params);
        if (res.firstErrorMessage === '') {
          this.rest = res.balance;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.getBalance();
      this.userAccount();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .detail {
    display: flex;
    margin-top: rpx(28);
    background-color: white;
    height: rpx(156);
    padding: rpx(44) 0 0 rpx(30);
  }

  .total {
    width: rpx(400);
  }

  .name {
    font-size: rpx(24);
    padding-left: rpx(12);
  }

  .desc {
    padding-top: rpx(15);
    font-size: rpx(48);
    color: #000;
    font-weight: bold;
  }

  .red {
    color: #ea281a;
  }

  .tradingrecord {
    margin-top: rpx(20);
    background: white;
    height: rpx(90);
    display: flex;
    justify-content: space-between;
  }

  .tradingrecord_ {
    padding-top: rpx(23);
    padding-left: rpx(34);
    font-size: rpx(32);
  }

  image {
    height: rpx(24);
    width: rpx(13.4);
    padding-top: rpx(33);
    padding-right: rpx(33);
  }

  .m-cell-access {
    margin-top: rpx(20);
    background-color: #fff;
    padding: 0 rpx(34);
    height: rpx(90);
  }

  .m-cell-primary p {
    font-size: rpx(32);
  }
</style>
