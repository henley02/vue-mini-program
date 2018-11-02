<template>
  <div></div>
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
</style>
