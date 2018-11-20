<template>
  <scroll-view scroll-y="true" @scrolltolower="dropDown" :style="{height:scrollHeight}">
    <div class='all'>
      <div class='left'>
        <div class='current'>当前积分</div>
        <div class='in-total'>{{point}}</div>
      </div>
    </div>
    <div>
      <div class='detail'>积分明细</div>
      <div v-for="(item,index) in integralList" :key="index">
        <div class='updatetime'>{{item.month}}</div>
        <div class='orderdetail' v-for="(items,i) in item.list" :key="i">
          <image :src='integralImg' class='goods'/>
          <div class='order'>
            <div>
              <div class='number'>{{items.sourceType}}</div>
              <div class='time'>
                <text class='time1'>{{items.date}} </text>
                <text class='time2'>{{items.time}}</text>
              </div>
            </div>
            <div class='cost'>{{items.changeAmount}}</div>
          </div>
        </div>
      </div>
      <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
      <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
      <div v-if="integralList.length === 0 && isEnd">
        <image :src='noDataImg' class='shoppingcart'></image>
        <div class='text'>暂无积分明细</div>
      </div>
    </div>
  </scroll-view>
</template>
<script type="text/ecmascript-6">
  /*
  * 我的账户
  * */
  import {fetchPoint, fetchConsumptionRecords} from 'api/index';

  export default {
    name: 'consumption-records',
    data() {
      return {
        scrollHeight: '0px',
        integralImg: require('public/images/user/integral.png'),
        noDataImg: require('public/images/user/nopoints.png'),
        userInfo: {},
        point: 0,
        integralList: [],
        isLoading: false,
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        isEnd: false,
        canDropDown: true // 是否可以下拉加载
      };
    },
    methods: {
      /**
       * 下拉加载
       */
      dropDown() {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        this.fetchList();
      },
      async getPoint() {
        let res = await fetchPoint({memberId: this.userInfo.memberId, passportId: this.userInfo.id}, {isLoading: true});
        if (res.firstErrorMessage === '') {
          this.point = res.point;
        } else {
          this.$bridge.dialog.alert(res.firstErrorMessage);
        }
      },
      async fetchList() {
        this.isLoading = true;
        if (this.pageNumber === 1) {
          this.integralList = [];
        }
        let params = {
          currencyCode: 'POT',
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
        let res = await fetchConsumptionRecords(params, {isLoading: this.pageNumber === 1});
        let count = 0;
        res.memberTransactionSummaryList.forEach((item) => {
          count += item.list.length;
          item.list.forEach((it) => {
            it.changeAmount = Math.round(it.changeAmount);
          });
        });
        this.integralList = this.integralList.concat(res.memberTransactionSummaryList);
        let totalCount = 0;
        this.integralList.forEach((item) => {
          totalCount += item.list.length;
        });
        // 判断数据是否全部加载完
        if (totalCount >= res.totalCount || count < this.pageSize) {
          this.isEnd = true;
          this.canDropDown = false;
        } else {
          this.canDropDown = true;
          this.pageNumber++;
        }
        this.isLoading = false;
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      wx.getSystemInfo({
        success: (res) => {
          this.scrollHeight = res.windowHeight + 'px';
        }
      });
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.fetchList();
      this.getPoint();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .all {
    display: flex;
    background-color: white;
    margin-bottom: rpx(20);
    height: rpx(200);
  }

  .left {
    margin: rpx(40) 0 rpx(23) rpx(28);
    background-color: white;
    flex: 1
  }

  .current {
    font-size: rpx(25);
  }

  .in-total {
    font-size: rpx(62);
    color: rgb(234, 40, 26);
    padding-top: rpx(8);
  }

  .detail {
    font-size: rpx(25);
    padding: rpx(19) 0 rpx(18) rpx(30);
    background-color: white;
  }

  .updatetime {
    font-size: rpx(32);
    height: rpx(77);
    line-height: rpx(80);
    padding-left: rpx(31);
  }

  .orderdetail {
    display: flex;
    background-color: white;
    margin-top: rpx(13);
    height: rpx(150);
  }

  .goods {
    padding-top: rpx(30);
    padding-left: rpx(30);
    height: rpx(90);
    width: rpx(90);
  }

  .order {
    padding-left: rpx(28);
    display: flex;
    justify-content: space-between;
    width: rpx(584);

  }

  .number {
    padding-top: rpx(30);
    font-size: rpx(35);
  }

  .time {
    display: flex;
    padding-top: rpx(10);
    font-size: rpx(26);
    color: #999;
  }

  .time2 {
    padding-left: rpx(20);
  }

  .cost {
    line-height: rpx(149);
    font-weight: bold;
    font-size: rpx(36);
  }

  .shoppingcart {
    padding-top: rpx(321);
    padding-left: rpx(290);
    height: rpx(171);
    width: rpx(171);
  }

  .text {
    padding-top: rpx(30);
    padding-left: rpx(290);
    color: #999;
    font-size: rpx(32);
  }

</style>
