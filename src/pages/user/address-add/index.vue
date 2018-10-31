<template>
  <div class="wrapper">
    <h-input :label="`收件人`" :type="`text`" v-model="form.username" placeholder="您的姓名"
             maxlength="10"
             name="username"></h-input>

    <h-input :label="`手机号码`" :type="`number`" v-model="form.contactPhone" placeholder="您的号码"
             maxlength="10"
             name="contactPhone"></h-input>

    <div class="m-cell m-cell-select-before" bindtap="showbox">

      <div class="m-cell-hd">
        <label class="u-label">所在地区</label>
      </div>
      <div>
        <label class="label-a">{{area}}</label>
      </div>
      <image :src='arrowsRight' class='a-img'></image>
    </div>
    <h-input :label="`邮编`" :type="`number`" v-model="form.postCode" placeholder="6位数邮编"
             maxlength="6"
             name="postCode"></h-input>

    <div class='t-text-are'>
      <textarea placeholder='请填写详细地址,不少于5个字' type="text" bindinput='inputconaddress'
                v-model='form.receiptAddress' minlength="5"></textarea>
    </div>

    <div class='r-cell-con'>
      <text>默认</text>
      <div>
        <i class="aop-radio-icon" :class="{'active':form.isDefault===1}"></i>
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

  export default {
    data() {
      return {
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
    onLoad(options) {
      this.type = options.type;
      if (this.type === 1) {
      } else if (this.type === 2) {
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/css/login";
  body {
    background-color: rgb(244, 244, 244)
  }

  .wrapper {
    background-color: #fff;
  }

  .form-group {
    height: rpx(57);
  }

  .form-group .label {
    font-size: rpx(28)
  }

  .t-text-are {
    width: 100%;
    height: auto;
    background-color: #fff;
    font-size: rpx(28);
    margin-bottom: rpx(20);
  }

  .t-text-are textarea {
    width: 100%;
    height: rpx(200);
    padding-top: rpx(30);
    margin: 0 rpx(30);
  }

  .m-cell-bd input {
    position: relative;
    right: rpx(35);
    font-size: rpx(28);

  }

  .m-cell-select-before {
    display: flex;
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
    border-bottom: rpx(1 rpx) solid #EEEEEE;
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
</style>

