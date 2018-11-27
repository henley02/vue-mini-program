<template>
  <div class="container">
    <div class="order-hd">
      <div class="o-total-label">合计基金</div>
      <div class="o-total-money">¥{{data.commissionAmount}}</div>
    </div>
    <div class="order-list">
      <ul>
        <li v-for="(item,index) in goodsList" :key="index">
          <div class="order-intro">
            <div class="oi-tro-tit">{{item.commodityTitle}}</div>
            <div class="oi-tro-money">¥{{item.unitPrice}}</div>
            <div class="oi-tro-tip">{{item.itemSpecName}}</div>
          </div>
          <div class="order-r-money">
            <span
              :class="{'c-green':item.commissionAmount>=0,'c-red':item.commissionAmount>=0}">{{item.commissionAmount < 0 ? item.commissionAmount : '+' + item.commissionAmount}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="order-footer">
      <div class="of-row">姓名：{{data.memberName}}</div>
      <template v-if="sourceType === 'REFUND' || sourceType === 'REFUND_RETURN'">
        <div class="of-row">退单时间: {{data.submitTime}}</div>
        <div class="of-row">退单号: {{data.number}}</div>
      </template>
      <template v-else>
        <div class="of-row">订单时间: {{data.orderTime}}</div>
        <div class="of-row">订单号: {{data.number}}</div>
      </template>
    </div>
  </div>
</template>

<script>
  /**
   * 分销中心
   */
  import {fetchRefundDetail, fetchOrderDetail} from 'api/index.js';

  export default {
    data() {
      return {
        userInfo: {},
        data: {},
        goodsList: [],
        id: '',
        sourceType: ''
      };
    },
    components: {},
    computed: {},
    methods: {
      async getOrderDetail() {
        let params = {
          id: this.id,
          passportId: this.userInfo.id
        };
        let res = await fetchOrderDetail(params);
        if (res.firstErrorMessage === '') {
          res.order.orderTime = this._dateFormat(res.order.time, 'yyyy-MM-dd');
          this.goodsList = res.order.orderLineList;
          this.data = res.order;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      async getRefundDetail() {
        let res = await fetchRefundDetail({id: this.id, passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          res.refund.submitTime = this._dateFormat(res.refund.submitTime, 'yyyy-MM-dd');
          this.data = res.refund;
          this.goodsList = res.refund.refundLineList;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.sourceType = this.$root.$mp.query.sourceType;
      this.id = this.$root.$mp.query.id;
      this.userInfo = this.$bridge.storage.get('userInfo');
      if (this.sourceType === 'REFUND' || this.sourceType === 'REFUND_RETURN') {
        this.getRefundDetail();
      } else {
        this.getOrderDetail();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  /*order*/
  .order-hd {
    color: #333;
    font-size: 14px;
    padding: 20px 15px;
    background: #fff;
    border-bottom: 10px solid #f5f5f9;
  }

  .o-total-money {
    font-size: 24px;
    color: #EA281A;
  }

  .order-list {
    border-bottom: 10px solid #f5f5f9;
  }

  .order-list li {
    font-size: 14px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .order-list li:last-child {
    border-bottom: 0;
  }

  .order-intro {
    flex: 1;
    width: 0;
    padding-right: 12px;
  }

  .oi-tro-tit {
    color: #000;
    font-size: 17px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .oi-tro-money {
    color: #333;
  }

  .oi-tro-tip {
    color: #999;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-r-money {
    width: 20%;
    flex-shrink: 0;
    font-size: 18px;
    color: #1AAD19;
    text-align: right;
  }

  .c-green {
    color: #1AAD19;
  }

  .c-red {
    color: #EA281A;
  }

  .order-footer {
    color: #888;
    font-size: 12px;
    padding: 10px 15px;
  }
</style>
