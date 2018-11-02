<template>
  <div class="myaccount">
    <div class='detail'>
      <div class='total'>
        <text class='name'>消费总额</text>
        <div class='desc red'>￥{{total}}</div>
      </div>
      <div class='rest'>
        <text class='name'>可用余额</text>
        <div class='desc'>￥{{rest}}</div>
      </div>
    </div>
    <navigator url="/pages/user/consumption-records/main" class="m-cell m-cell-access">
      <div class="m-cell-bd m-cell-primary">
        <p>查看最近交易记录</p>
      </div>
      <text class="m-cell-ft"></text>
    </navigator>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 我的账户
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
