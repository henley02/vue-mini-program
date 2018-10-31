<template>
  <div>
    <div class="m-cells m-cells-form">
      <div class="m-cell">
        <div class="m-cell-hd">
          <label class="u-label">收件人</label>
        </div>
        <div class="m-cell-bd">
          <input class="u-input" type='text' v-model="form.contactName" placeholder="您的姓名"
                 placeholder-style='font-size: 28rpx;color: #999;'/>
        </div>
      </div>
      <div class="m-cell">
        <div class="m-cell-hd">
          <label class="u-label">手机号码</label>
        </div>
        <div class="m-cell-bd">
          <input class="u-input" type="number" v-model="form.contactPhone" placeholder="您的号码" maxlength='11'
                 placeholder-style='font-size: 28rpx;color: #999;'/>
        </div>

      </div>
      <div class="m-cell m-cell-select-before" bindtap="showbox">
        <div class="m-cell-hd">
          <label class="u-label">所在地区</label>
        </div>
        <div>
          <label class="label-a" :style="{color:area==='请选择'?'#999':'#000'}">{{area}}</label>
        </div>
        <image :src='arrowsRight' class='a-img'/>
      </div>
      <div class="m-cell">
        <div class="m-cell-hd">
          <label class="u-label">邮编</label>
        </div>
        <div class="m-cell-bd">
          <input class="u-input" type="number" v-model="form.postCode" placeholder="6位数邮编"
                 placeholder-style='font-size: 28rpx;color: #999;' maxlength='6'/>
        </div>
      </div>

    </div>
    <div class='t-text-are'>
      <textarea placeholder='请填写详细地址,不少于5个字' type="text" v-model="form.receiptAddress" fixed='true'
                minlength="5"></textarea>
    </div>
    <div class='r-cell-con'>
      <text>默认</text>
      <div class="right">
        <div class="is-default" :class="{active:form.isDefault}" @tap="changeDefault"></div>
        <text>设为默认</text>
      </div>
    </div>
    <div class='b-btn-sty'>
      <button class='btn' bindtap='submitbtn'>保存</button>
    </div>
  </div>
</template>

<script>
  /**
   * 修改登录密码、设置登录密码
   */
  import {fetchAddressById} from 'api/index';

  export default {
    data() {
      return {
        id: '', // 收货地址id
        userInfo: {},
        arrowsRight: require('public/images/arrows-right.png'),
        form: {
          countryId: '', // 国家id
          countryName: '', // 国家名称
          provinceId: '', // 省
          provinceName: '', // 省名称
          cityId: '', // 市id
          cityName: '', // 市名称
          districtId: '', // 区id
          districtName: '', // 区名称
          postCode: '', // 邮编
          address: '', // 详细地址
          receiptAddress: '', // 详细地址

          contactName: '', // 收件人
          contactPhone: '', // 收件人联系方式

          receiptName: '', // 收件人
          receiptPhone: '', // 收件人联系方式

          id: '',
          isDefault: false, // 是否默认
          memberId: '', //
          memberName: '', // 注册人的手机号码

          rowVersion: '1',
          tenantId: ''
        }
      };
    },
    computed: {
      area() {
        let str = this.form.provinceName + this.form.cityName + this.form.districtName;
        if (str === '') {
          return '请选择';
        } else {
          return str;
        }
      }
    },
    methods: {
      changeDefault() {
        this.form.isDefault = !this.form.isDefault;
      },
      async getAddressInfo() {
        if (this.id === '') {
          return;
        }
        let res = await fetchAddressById({ids: this.id.split(','), passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          this.form = res.result[0];
          console.log(this.form);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onLoad(options) {
      this.type = options.type;
      this.id = options.id;
      if (this.type === 1) {
      } else if (this.type === 2) {
      }
    },
    onShow() {
      this.userInfo = this.$bridge.storage.get('userInfo');
      if (this.id) {
        this.getAddressInfo();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/css/login";
  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: red;
    /* placeholder字体大小  */
    font-size: 12px;
    /* placeholder位置  */
    text-align: right;
  }

  body {
    background-color: rgb(244, 244, 244)
  }

  page {
    position: fixed;
  }

  .t-text-are {
    width: 100%;
    height: auto;
    background-color: #fff;
    font-size: rpx(28);
    margin-bottom: rpx(20);
  }

  .m-cell-bd input {
    position: relative;
    right: rpx(35);
    font-size: rpx(28);

  }

  .m-cell-select-before {
    display: flex;
  }

  .t-text-are textarea {
    height: rpx(200);
    padding-top: rpx(30);
    margin: 0 rpx(30);
    overflow: hidden;
    position: relative;
  }

  .r-cell-con {
    width: 100%;
    height: rpx(84);
    background-color: #fff;
    font-size: rpx(28);
    overflow: hidden;
    margin-bottom: rpx(30);
  }

  .r-cell-con text:nth-child(1) {
    margin-left: rpx(30);
    line-height: rpx(84);
  }

  .r-cell-con text:nth-child(2) {
    margin-left: rpx(13);
  }

  .btn {
    background: #ea281a;
    border-radius: rpx(8);
    height: rpx(78);
    color: #fff;
    font-size: rpx(32);
    width: 93%;
  }

  .b-btn-sty {
    width: 100%;
    height: rpx(100);
    line-height: rpx(100);
    text-align: center;
  }

  .label-a {
    font-size: rpx(28);
    color: #999999;
    position: relative;
    right: rpx(36);
  }

  .a-label {
    font-size: rpx(28);
    color: #333333;
    position: relative;
    right: rpx(30);

  }

  .m-cell {
    border-bottom: 1 rpx solid #EEEEEE;
  }

  .a-img {
    width: rpx(20);
    height: rpx(30);
    position: relative;
    top: 0;
    left: rpx(374);
  }

  .red {
    color: red;
  }

  .green {
    color: green;
  }

  .r-cell-con .right {
    position: relative;
    right: rpx(-540)
    top: rpx(-66)
  }

  .is-default
    display: inline-block;
    background-image: url("../../../public/images/address/select.png");
    background-repeat: no-repeat
    background-size: 100% 100%
    height: rpx(35)
    width: rpx(35)
    position: relative;
    top: rpx(6)
    &.active
      background-image: url("../../../public/images/address/selected.png");
</style>

