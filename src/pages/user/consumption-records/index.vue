<template>
  <scroll-view class="m-orderlist" scroll-with-animation="true" scroll-y @scrolltolower="dropDown"
               :style="{height:scrollHeight}">
    <div class="c-records" v-for="(item,index) in memberTranList" :key="index">
      <div class='updatetime'>{{item.week}}</div>
      <div class='orderdetail'>
        <div class='order'>
          <div style='word-wrap:break-word;word-break:break-all;display:block;'>
            <div class='number'>{{item.sourceType}}
              <text>{{item.sourceNumber}}消费</text>
            </div>
            <div class='time'>
              {{item.date}}\t{{item.time}}
            </div>
          </div>
        </div>
        <div class='cost'>{{item.changeAmount}}</div>
      </div>
    </div>
    <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
    <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
    <div v-if="memberTranList.length==0 && isEnd">
      <image :src='noData' class='shoppingcart'></image>
      <div class='text'>暂无消息记录</div>
    </div>
  </scroll-view>
</template>
<script type="text/ecmascript-6">
  /*
  * 消费记录
  * */
  import {fetchConsumptionRecords} from 'api/index.js';

  export default {
    name: 'consumption-records',
    data() {
      return {
        scrollHeight: '0px',
        userInfo: {},
        isLoading: false,
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        memberTranList: [],
        isEnd: false,
        canDropDown: true, // 是否可以下拉加载
        noData: require('public/images/gouwuche.png') // 没有商品列表的默认图片
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
      async fetchList() {
        this.isLoading = true;
        if (this.pageNumber === 1) {
          this.memberTranList = [];
        }
        let params = {
          currencyCode: 'CNY',
          passportId: this.userInfo.id,
          memberId: this.userInfo.memberId,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        let res = await fetchConsumptionRecords(params, {isLoading: this.pageNumber === 1});
        if (this.pageNumber === 1) {
          this.memberTranList = res.memberTransactionShowList;
        } else {
          this.memberTranList = this.memberTranList.concat(res.memberTransactionShowList);
        }
        // 判断数据是否全部加载完
        if (this.memberTranList.length >= res.totalCount || res.memberTransactionShowList.length < this.pageSize) {
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
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";

  .c-records {
    background: #FFFFFF;
  }

  .updatetime {
    padding-left: rpx(30);
    font-size: rpx(35);
    background: #f4f4f4;
    height: rpx(65);
    line-height: rpx(65);
    font-family: "PingFang-SC-";
  }

  .orderdetail {
    display: flex;
    margin-top: rpx(13);
    height: rpx(150);
    border-bottom: rpx(2) solid #dddddd;
  }

  .order {
    padding-left: rpx(28);
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    width: 60%;
  }

  .number {
    margin-top: rpx(-7)
    font-size: rpx(32);
    font-family: "PingFang-SC-";
    height: rpx(70);
    line-height: rpx(35);
  }

  .center {
    font-size: rpx(32);
    font-family: "PingFang-SC-";
  }

  .time {
    display: flex;
    font-size: rpx(32);
    color: #999999;
  }

  .cost {
    height: rpx(150);
    line-height: rpx(150);
    position: absolute;
    right: rpx(50);
    font-size: rpx(36);
    font-weight: 600;
    margin-top: rpx(-7)
    font-family: "PingFang-SC-";
  }

  .shoppingcart {
    padding-top: rpx(321);
    padding-left: rpx(290);
    height: rpx(171);
    width: rpx(171);
  }

  .text {
    padding-top: rpx(25);
    padding-left: rpx(298);
    color: #999999;
    font-size: rpx(28);
  }

  .c-records .orderdetail:last-child {
    border-bottom: none;
  }
</style>
