<template>
  <div class='wrapper'>
    <scroll-view class="m-logistic" v-if="list.length > 0">
      <div class='l-logistic userinfo'>
        <div class="header">
          <image :src='successImg' class='m-product'></image>
          <div class='m-product-Info'>
            <div class="m-product-position" v-if="refund.status == 'UN_APPROVED' ">待审核</div>
            <div class="m-product-position" v-if="refund.status == 'DISAGREED'">审核不通过</div>
            <div class="m-product-position" v-if="refund.status == 'AGREED'">审核通过
            </div>
            <div class="m-product-position" v-if="refund.status ==  'WAIT_RECEIPT'">待收货</div>
            <div class="m-product-position" v-if="refund.status == 'WAIT_REFUND'">待退款</div>
            <div class="m-product-position" v-if="refund.status == 'REFUND_FAILED'">退款失败</div>
            <div class="m-product-position" v-if="refund.status ==  'REFUND'">已退款</div>
            <div class="m-product-position" v-if="refund.status == 'CANCELLED'">已取消</div>
            <div class='m-product-express'>订单号: {{refund.orderNumber}}</div>
          </div>
          <div class='m-produc-number'></div>
        </div>
      </div>
      <block v-for="(item,index) in list" :key="index">
        <div class="m-logistbox">
          <div class='m-log-time'>
            <div :class="{'m-logistitem-item':index==0,'m-logistitem':index!==0}">
              <rich-text :nodes="item.content"></rich-text>
            </div>
            <div class='m-logistitem-cell'>
              <div :class="{'isFirst':index===0}">
                {{item.time}}
              </div>
            </div>
          </div>
          <div/>
        </div>
      </block>
      <div class='m-logistbox bot_sho'>
        <div class="refund_time">退款申请时间：{{list[0].time}}</div>
        <div class="refund_number">服务单号：{{refund.number}}</div>
      </div>
    </scroll-view>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 退款详情
  */
  import {fetchRefundDetail} from 'api/index.js';

  export default {
    name: 'user-manage',
    data() {
      return {
        successImg: require('public/images/user/suc_ss.png'),
        id: '',
        userInfo: {},
        list: [],
        refund: {}
      };
    },
    methods: {
      async init() {
        let res = await fetchRefundDetail({id: this.id, passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          res.objectLogList.forEach((item) => {
            item.time = this._dateFormat(item.time, 'yyyy-MM-dd hh:mm:ss');
          });
          this.list = res.objectLogList;
          this.refund = res.refund;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.id = this.$root.$mp.query.id || '';
      this.init();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .l-logistic {
    display: flex;
    padding: rpx(37) 0 rpx(36) rpx(37);
    background: #fff;
    height: rpx(218);
  }

  .header {
    width: 73%;
    margin: 0 auto;
  }

  .m-product-Info {
    margin-top: rpx(42);
    float: left;
  }

  .m-product-position {
    font-size: rpx(42);
    color: #fff;
    margin-bottom: rpx(43);
  }

  .m-product-express {
    font-size: rpx(28);
    color: #fff;
  }

  .m-product {
    float: left;
    width: rpx(120);
    height: rpx(120);
    margin-right: rpx(30);
    margin-top: rpx(47);
  }

  .m-logistbox {
    background-color: #fff;
  }

  .m-log-time {
    display: flex;
    flex-direction: row-reverse;
    font-size: rpx(28);
    justify-content: center;
  }

  .m-logistitem {
    font-size: rpx(28);
    padding: rpx(40) rpx(20) 0 rpx(60);
    line-height: rpx(40);
    color: #666;
    position: relative;
    width: rpx(460);
    min-height: rpx(117);
  }

  .m-logistitem::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: rpx(1);
    height: 100%;
    border-left: rpx(1) solid #c8c8cd;
    margin-left: rpx(20);
  }

  .m-logistitem::before {
    content: "";
    position: absolute;
    width: rpx(20);
    height: rpx(20);
    left: 0;
    top: 0;
    background-color: #d5d5d5;
    border-radius: 100%;
    margin-left: rpx(11);
    margin-top: rpx(50);
    z-index: 2;
  }

  .m-logistitem-item::before {
    content: "";
    position: absolute;
    width: rpx(40);
    height: rpx(40);
    left: -5rpx;
    top: 0;
    margin-left: rpx(35);
    margin-top: rpx(40);
    z-index: 2;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABHdJREFUWAnVmUuMDEEYx7/qnrUJVna9DfGOi3DwCGKHi4REEIblJC4uhF1kXBE3z117lUgkEo8dEiIknIxnIpE4cbBxYHaJIBGSzW5P+f792p6Z6umene5Z+jBdXfVVfb/+5uvqqn8LquGQUoo9z46tMqSxWRLN56GSkmRSSD4L/iXZJ0jkuT4viHp1od+/vvb8K2G2jcwxj1P9kc4d2UBk7CJJW5lqejUjsMN+EnSXSL+VTV18XE1f2FYFvPvp0dVDcuiMlJSq1pHKXgjKJUTi+I3WCy9V7aq6UMAcUf67C2c5BXaoBqm1jlPkNpGW4Yj3Bo0VCGz//Tc5qi1Bg9XSztH+wWnSFpQmWiUnO590HCJpPIwbFgymD/Zl+qwA5RvhdK6jU8pCe4W+sTUJoXVlU50dKgdKYNxlgQqXVB3qVaeRdrhnXWd3qb8yYDNnkQacUKXG9bxmMIOEvqk0p4uArdnAeF2PnA1z8/aDuMI7e5Q8dJi64p0NwoA6NhZL4axzjbMLjJdCXPOs16GqvLR5EbXN3kRTGyeWNYMJbE5DwikMSqPoTpz6uM8bZ6yl/Qt2Eb88aP3UlXTw9ekylzab+XY1I2w9aLK1zDLmCi8sXLWMmcB/ufunD3uXstV6gbkpUWgbbq1PqRQWXq/03iGeTn0AeLHFh4YlIr9mtvhYxVKtgr38oYce9T/394eVIbMKJPRgYeiFv2W0LX6wD/K5QEcNWmKNhsV3oGVEBrXAAgGsmr1TiAjJf5haYTEyWPFIJv3dRNMSBaxNkuQIy1iBI4TlCMtkwtww+gSydcoy2jtvG338/Zm631+jX0O/fSzV1VHCwgNYNWt3q3a4b/52mtTYTMsnLqaTSw5SU2Kc2lBRGzUsXICVc1j2KfyZVZ/+9LtNc8fPDA0dB6wFIvs0WzdwwbyFzndX6dOfL25VGOj4YLHFF3nMEhA6lMfPwV904m13aOg4YW3APEeYKm6tw0LXARYiSq8G+UgZXk9lEHQ9YIEDVoEFxc5cez6M5NTc0ESnlh6iWWOnubfzbeAHTRrTbK5nnUosZMKsDRz7MGeObn9PqiupmcKcqXUFd1NFenJjS+ywJhkzgtVeLeu3gnEtCxW00zeOyDpjQzxE2d01p3OHn/CmL7TIh/Q4seQAzR6X5FVUga58uE0P+oKXiMMA4UsQDbOpS+vQw93TQUUclOHXxYh05s05Wtg0h74P/KSvA9/DE1RpCTanixthVKRz7VnsUp3Gf+EMZTOb6ko7LHYOu5cZS7xwrkf3bLFoGS9FEbClsOhtHHbDazQaZYvBlF+LXmxFwACDliVIOzIakF6fYCjV1dBeBoxKqIaQPFEejQO+VcolWJTAaIA+C8mznukBX/Dppw2Di20qH5biYvwfnwxwK1Ye6SswvVS+tZG3WmPrkFUDP4MFRtiLYYouEA1Z6/LWj7gsxNMGoWci/+xVCmSlCetxLHGFWeV5+3OE+MOiuMePz80wEfX2RbmqCJd2xtLU79MtbFm140+20X66/Qvse/cGg19qRgAAAABJRU5ErkJggg==');
    background-repeat: no-repeat;
    background-size: contain;
  }

  .m-logistitem-item {
    font-size: rpx(28);
    padding: rpx(40) rpx(20) rpx(40) rpx(100);
    line-height: rpx(40);
    color: #888;
    position: relative;
    width: 64%;
    min-height: rpx(130);
  }

  .m-logistitem-item::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: rpx(1);
    height: 100%;
    border-left: rpx(1) solid #c8c8cd;
    margin-left: rpx(47);
  }

  .m-logistitem-cell {
    font-size: rpx(20);
    color: #999;
    width: rpx(126);
    margin-left: rpx(40);
    margin-top: rpx(49);
  }

  .m-logistitem-cell div {
    text-align: right
  }

  .isFirst {
    position: relative;
    left: rpx(3);
  }

  .m-produc-number {
    width: rpx(178);
    height: rpx(50);
    position: absolute;
    opacity: 0.7;
    top: rpx(162);
    left: rpx(37);
  }

  .userinfo {
    background: -webkit-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75));
    background: linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75));
  }

  .bot_sho {
    margin: rpx(50) 0 rpx(30) 0;
    width: 100%;
    height: rpx(115);
    font-size: rpx(26);
    padding-left: rpx(52);
  }

  .refund_time {
    line-height: rpx(70);
    height: 50%;
  }

  .refund_number {
    height: 50%;
    line-height: rpx(55);
  }
</style>
