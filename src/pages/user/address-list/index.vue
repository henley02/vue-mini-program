<template>
  <div class="wrapper">
    <div class='adds-list'>
      <div class="m-ad-item" v-for="(item,index) in list" :key="index" v-if="list.length">
        <div class="m-ad-l" @tap="SelectAddress(item)">
          <div class="m-ad-i-top">
            <text>{{item.contactName}}</text>
            <label>{{item.contactPhone}}</label>
            <text class="m-ad-icons" v-if="item.isDefault">默认</text>
          </div>
          <div class="m-ad-i-bot">
            <text>{{item.provinceName}}{{item.cityName}}{{item.districtName}}</text>
          </div>
        </div>
        <div class="m-ad-edit">
          <label class="iconfont icon-edit" @tap="editAddress(item.id)"></label>
          <label class="iconfont icon-delete" @tap="del(item.id,index)"></label>
        </div>
      </div>
      <!-- 无数据时展示 -->
      <div v-if="list.length==0" class="no-data">
        <image :src="noData"></image>
        <div class='text'>暂无收货地址</div>
      </div>
    </div>
    <div class="u-btn-sty" @tap="add">
      <image :src="addImg" class='addNew'></image>
      <div>新增地址</div>
    </div>
  </div>
</template>

<script>
  /**
   * 收货地址--列表
   */
  import {fetchAddressList, delAddress} from 'api/index.js';

  export default {
    data() {
      return {
        noData: require('public/images/address/address.png'),
        addImg: require('public/images/address/add.png'),
        type: '', // 1 选择收货地址 2
        list: [],
        pageNumber: 1,
        pageSize: 10,
        userInfo: {}
      };
    },
    components: {},
    methods: {
      editAddress(id) {
        this.$bridge.link.navigateTo(`/pages/user/address-add/main?id=${id}`);
      },
      async getData() {
        let params = {
          passportId: this.userInfo.id,
          memberId: this.userInfo.memberId,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        };
        let res = await fetchAddressList(params, {isLoading: this.pageNumber === 1});
        if (res.firstErrorMessage === '') {
          if (this.pageNumber === 1) {
            this.list = res.result;
          } else {
            this.list = this.list.concat(res.result);
          }
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
        console.log(res);
      },
      add() {
        this.$bridge.link.navigateTo('/pages/user/address-add/main');
      },
      del(id, index) {
        this.$bridge.dialog.confirm({
          title: '温馨提示',
          content: '确认删除？',
          confirmCallback: async () => {
            let res = await delAddress({passportId: this.userInfo.id, id: id});
            if (res.firstErrorMessage === '') {
              wx.showToast({
                title: '删除成功'
              });
              this.list.splice(index, 1);
            } else {
              this.$bridge.dialog.alert({content: res.firstErrorMessage});
            }
          },
          cancelCallback: () => {
            console.log(1);
          }
        });
      }
    },
    created() {
    },
    onShow() {
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.getData();
    },
    onLoad(options) {
      this.type = options.type;
      if (this.type === 1) {
      } else if (this.type === 2) {
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  @import "~public/css/login";
  body {
    background-color: rgb(244, 244, 244)
  }

  .m-ad-item {
    display: flex;
    flex-direction row;
    background-color: #fff;
    padding: rpx(24) rpx(20) rpx(24) rpx(30);
    border-bottom: rpx(1) solid #d5d5d5;
  }

  .m-ad-l {
    width: 90%;
    display: inline-block;
  }

  .m-ad-edit {
    width: rpx(100);
    height: rpx(100);
  }

  .m-ad-edit label {
    width: rpx(40);
    height: rpx(50);
    line-height: rpx(50);
    font-size: rpx(35);
    display: block;
    vertical-align: middle;
    text-align: center;
    color: #888;
  }

  .u-btn-sty {
    width: 100%;
    height: rpx(100);
    text-align: center;
    line-height: rpx(100);
    position: fixed;
    bottom: 0;
    color: #ea281a;
    background: #fff;
    font-size: rpx(28);
    font-family: PingFangSC-Semibold;
  }

  .u-btn-sty div {
    display: inline-block;
  }

  .m-ad-i-top {
    font-size: rpx(32);
    line-height: rpx(40);
    width: rpx(546);
    margin-left: rpx(68);
    white-space: normal;
  }

  .m-ad-i-top text {
    margin-right: rpx(20);
  }

  .m-ad-i-bot {
    font-size: rpx(28);
    color: #888;
    line-height: rpx(40);
    margin-top: rpx(10);
    margin-left: rpx(66);
  }

  .m-ad-icons {
    display: inline-block;
    color: #db384c;
    font-size: rpx(26);
    border: rpx(1) #db384c solid;
    width: rpx(90);
    height: rpx(40);
    line-height: rpx(40);
    border-radius: rpx(10);
    text-align: center;
    margin-left: rpx(45);
  }

  .addNew {
    height: rpx(25);
    width: rpx(25);
    padding-right: rpx(12.3);
  }

  .no-data {
    display: flex;
    padding-top: rpx(323);
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    width: 100%;
  }

  .no-data image {
    display: block;
    margin: 0 auto;
    height: rpx(171);
    width: rpx(171);
  }

  .no-data .text {
    padding-top: rpx(24);
    color: #999;
    font-size: rpx(28);
  }

</style>
