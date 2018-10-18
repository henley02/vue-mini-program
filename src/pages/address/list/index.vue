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
          <div class="edit" @tap="EditAddress"></div>
          <div class="del" @tap="del(item.id)"></div>
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
  export default {
    data() {
      return {
        noData: require('public/images/address/address.png'),
        addImg: require('public/images/address/add.png'),
        type: '', // 1 选择收货地址 2
        list: [
          {
            'address': '123123131',
            'cityId': '120100',
            'cityName': '天津市',
            'contactName': '发放',
            'contactPhone': '13401455202',
            'countryId': '86',
            'countryName': '中国',
            'districtId': '120102',
            'districtName': '河东区',
            'id': '1051452293566042112',
            'isDefault': true,
            'memberId': '1051451870750838784',
            'memberName': '13401455202',
            'postCode': '226531',
            'provinceId': '120000',
            'provinceName': '天津市',
            'receiptAddress': '123123131',
            'receiptName': '发放',
            'receiptPhone': '13401455202',
            'rowVersion': '1',
            'tenantId': '852769418315444224'
          },
          {
            'address': '31312321',
            'cityId': '120100',
            'cityName': '天津市',
            'contactName': '1312',
            'contactPhone': '13232565656',
            'countryId': '86',
            'countryName': '中国',
            'districtId': '120102',
            'districtName': '河东区',
            'id': '1052748711576604672',
            'isDefault': false,
            'memberId': '1051451870750838784',
            'memberName': '13401455202',
            'postCode': '226531',
            'provinceId': '120000',
            'provinceName': '天津市',
            'receiptAddress': '31312321',
            'receiptName': '1312',
            'receiptPhone': '13232565656',
            'rowVersion': '0',
            'tenantId': '852769418315444224'
          }]
      };
    },
    components: {},
    methods: {
      add() {
        this.$bridge.link.navigateTo('/pages/address/add/main');
      },
      del(id) {
        this.$bridge.dialog.confirm({
          title: '温馨提示',
          content: '确认删除？',
          confirmCallback: () => {
            console.log(2);
          },
          cancelCallback: () => {
            console.log(1);
          }
        });
      }
    },
    created() {
    },
    onLoad(options) {
      this.type = options.type;
      if (this.type === 1) {
      } else if (this.type === 2) {
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  @import "~public/css/login";
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

  .m-ad-edit div {
    width: rpx(50);
    height: rpx(50);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .edit {
    background-image: url('./../../../public/images/address/edit.png');
  }

  .del {
    background-image: url('./../../../public/images/address/del.png');
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
