<template>
  <div>
    <div>
      <div class='userContainer' @tap='selectAddress' v-if="address.id">
        <image :src='stripedImg' class='v-cell'/>
        <div class='useDesStyle'>
          <text class='nameStyle2'>{{address.contactName}}</text>
          <text class='nameStyle'>{{address.contactPhone}}</text>
        </div>
        <div class='c-address'>
          <image class='addressSty' :src='positionImg'/>
          <text class='detail-address'>
            {{address.provinceName}}{{address.cityName}}{{address.districtName}}{{address.detailedaddress}}
          </text>
        </div>
        <image :src='arrowsRightImg' class='i-img'/>
      </div>
      <div class='userContainer user-addre' @tap='selectAddress' v-else>
        <image :src='stripedImg' mode="aspectFill" class='v-cell'/>
        <div class="m-cell-address">
          <image class='addressSty' src="../../../../public/images/location.png" style='padding-right:20rpx;'/>
          <text>您还没有添加地址，点击添加地址吧</text>
        </div>
      </div>
      <div class="m-product-all">
        <div class="m-product-list" v-for="(item,index) in cartDetailList" :key="index">
          <navigator class="m-product-item">
            <div class="m-product-img" style='width:178rpx;height:178rpx'>
              <image :src="item.pictureUrl"/>
            </div>
            <div class="m-product-info">
              <div class="m-product-name" style='padding-top:8rpx'>
                <div class='m-sty-name' style='color:black'>{{item.commodityTitle}}</div>
                <div class='m-sty-name'>
                  规格:{{item.itemSpec1AttributeName}} {{item.itemSpec1ValueName}} {{item.itemSpec2AttributeName}} {{item.itemSpec2ValueName}} {{item.itemSpec3AttributeName}} {{item.itemSpec3ValueName}}
                </div>
              </div>
              <div class="m-product-price" style='color:#ea281a;padding-bottom:30rpx'>
                <div>
                  <label>￥</label>{{item.unitPrice}}
                </div>
                <div class='m-te'>x{{item.quantity}}</div>
              </div>
            </div>
          </navigator>
        </div>
      </div>
      <!-- 备注 -->
      <div class="m-cell p-cell" style='font-size:28rpx;margin-top:20rpx;'>
        <div class="m-cell-bd">
          <input class="u-textarea" maxlength="45" v-model="memberMessage" bindinput="inputRemark"
                 placeholder='选填：给商家留言(45字以内)'/>
        </div>
      </div>
      <div class="total-info" @tap="showPayList">
        <div class="m-cell" style='margin-bottom:20rpx'>
          <div class="m-cell-bd">
            <text>支付方式</text>
          </div>
          <div class="m-cell-ft m-order-typetxt" v-if="payType==0">请选择</div>
          <div class="m-cell-ft m-order-typetxt" v-if="payType==1">余额支付</div>
          <div class="m-cell-ft m-order-typetxt" v-if="payType==2">微信支付</div>
          <div class="arrow m-cell-access">
            <div class="m-cell-ft "></div>
          </div>
        </div>

        <div class="m-cell" catchtap="suitcouponlist" style='border-bottom:1rpx solid #EEEEEE;'>
          <div class="m-cell-bd">
            <text>优惠券</text>
          </div>
          <block v-if="benefitAmount> 0">
            <div style='color:#EA281A'>-￥{{benefitAmount}}</div>
          </block>
          <block v-else>
            <div class="m-cell-ft m-order-typetxt" style='color:#EA281A'
                 v-if="couponDetailList.length > 0">{{couponDetailList.length}}张可用
            </div>
            <div class="m-cell-ft m-order-typetxt" v-else>暂无可用</div>
            <div class="arrow m-cell-access">
              <div class="m-cell-ft "></div>
            </div>
          </block>
        </div>
        <div class="m-cell" catchtap="interesting" style='border-bottom:1rpx solid #EEEEEE;'>
          <div class="m-cell-bd">
            <text>积分</text>
          </div>
          <div class="m-cell-ft m-order-typetxt" v-if="!pointflag">
            可用{{maxPoint}}积分抵扣,共{{myPoint}} 分
          </div>
          <div class="m-cell-ft m-order-typetxt" v-else>已使用{{numval}}积分,抵扣￥{{pointRulepick}}</div>
          <div class="arrow m-cell-access">
            <div class="m-cell-ft "></div>
          </div>
        </div>
        <navigator catchtap='sergiftcard'>
          <div class="m-cell" style='margin-bottom:20rpx'>
            <div class="m-cell-bd">
              <text>礼品卡</text>
            </div>
            <div class="m-cell-ft m-order-typetxt" style='color:#EA281A' v-if="Giftcardamount>0">-{{Giftcardamount}}
            </div>
            <div class="arrow m-cell-access">
              <div class="m-cell-ft "></div>
            </div>
          </div>
        </navigator>

        <div class="m-cell" style='margin-bottom:20rpx' catchtap='HuoDong'>
          <div class="m-cell-bd">
            <text>参与活动</text>
          </div>
          <div class="m-cell-ft m-order-typetxt">省
            <text style='color:#ea281a'>￥{{benefitAmounts}}</text>
            元
          </div>
          <div class="arrow m-cell-access">
            <div style='width:32rpx;'></div>
          </div>
        </div>

        <div class="m-cell" catchtap='SHopp'>
          <div class="m-cell-bd">
            <text>商品金额</text>
          </div>
          <div class="m-cell-ft m-order-typetxt">￥{{goods_amount}}</div>
        </div>

        <div class="m-cell" style='margin-bottom:100rpx;' catchtap='toaoMEN'>
          <div class="m-cell-bd">
            <text>运费</text>
          </div>
          <div class="m-cell-ft m-order-typetxt">￥{{totalFeightFee}}</div>
        </div>
      </div>

      <div class="m-footer-btn">
        <div class="m-footer-btn-listS">实付款：￥{{amount}}</div>
        <div class="m-footer-btn-main m-now" bindtap="orderNewcommit" v-if="!btnflag">
          提交订单
        </div>
        <div class="m-footer-btn-main m-now" v-else>
          提交订单
        </div>
      </div>
    </div>
    <!-- 优惠券模板 -->
    <div class="m-panel-sp " v-if="conponflag">
      <div class="m-panel-sp-content"
           :class="{'bounceOutDown animated':selectct==0,'bozunceInUp animated':selectct!=0}">
        <icon type="cancel" class="m-panel-sp-icon" color="#888" catchtap="closesps"/>
        <div class="m-panel-sp-listbox-item">
          <div class="m-cells-title">选择优惠券</div>
        </div>
        <div v-if="couponDetailList.length<=0">
          <image src='../../img/nocoupon.png' class='shoppingcart'></image>
          <div class='text'>无可用优惠券</div>
        </div>
        <scroll-view class="m-panel-sp-listbox" scroll-y="true" v-if="couponDetailList.length>0">
          <div class='y-cell' v-for="(item,index) in couponDetailList" :key="index">
            <div class="quan" catchtap="ckitvendor" style="float: left;margin-top:58rpx;padding:0 16rpx;">
              <icon :type="item.IsCheck && fid==index?'success':'circle'"
                    :color="item.IsCheck && fid==index?'#EA281A':'#d5d5d5'"
                    catchtap='change'/>
            </div>
            <div class='y-img' catchtap='ShiYong'>
              <div class='y-cells-bach'>
                <image src='../../img/copyxs.png' style='width:100%;height:100%'/>
                <div class='y-juan'>
                  <div>{{item.couponEntity.couponName}}</div>
                  <div>
                    有效期{{filter.formatDay(item.couponEntity.usefulStart)}}至{{filter.formatDay(item.couponEntity.usefulEnd)}}
                  </div>
                </div>
                <div class='y-con'>￥{{item.benefitAmount}}</div>
              </div>
            </div>
          </div>
          <div style="height:96rpx;width:100%;"></div>
        </scroll-view>
        <div class="m-m-panel-sp-btn">
          <div class="m-m-panel-sp-rbtn" catchtap="Shutdown">确定</div>
        </div>
      </div>
    </div>
    <!--积分模板-->
    <div class="m-panel-sp " v-if="inteflag">
      <div class="m-panel-sp-content"
           :class="{'bounceOutDown animated':selectct==0,'bozunceInUp animated':selectct!=0}">
        <icon type="cancel" class="m-panel-sp-icon" color="#888" catchtap="closespinter"/>
        <scroll-view class="m-panel-sp-listbox" scroll-y="true">
          <div class="m-panel-sp-listbox-item">

            <div class="m-cells-title">使用积分</div>
            <div class='m-inter'>
              <div>总积分:\t{{PointsInfo}}</div>
              <div>本次最多可使用积分:\t{{maxPoint}}</div>
            </div>
          </div>
          <!--加减-->
          <div class="u-cart-num">
            <div class="u-num-btn" catchtap="sub">-</div>
            <input type="number" value="numval" bindblur="writenum" disabled='disabled'/>
            <div class="u-num-btn" catchtap="add">+</div>
          </div>
          <div class='m-inter-cell' catchtap='largestuse'>最大使用</div>
        </scroll-view>
        <div class="m-m-panel-sp-btn">
          <div class="m-m-panel-sp-rbtn" catchtap="buynow">确定</div>
        </div>
      </div>
    </div>
    <!-- 支付模态框 -->
    <div class="auth-pop" v-if="flagm">
      <div class="auth-box">
        <div class='auth-box-title'>输入支付密码</div>

        <div class='auth-box-meny'>￥{{amount}}</div>
        <div class="m-panel-bd" style='border-bottom:1rpx solid #DDDDDD;'>
          <div class="m-media-box m-media-box-small-appmsg">
            <navigator class="m-cell m-cell-access" style='font-size:28rpx;background:#F4F4FB;'>
              <div class="m-cell-bd m-cell-primary" style='position:relative;right:154rpx;'>
                <p>支付方式</p>
              </div>
              <div>余额支付</div>
              <text class="m-cell-ft"></text>
            </navigator>
          </div>
        </div>
        <form bindsubmit="formSubmit">
          <div class='content'>
            <block v-for="(item,index) in 6" :key="index">
              <input class='iptbox' :value="Value.length>=index+1?Value[index]:''" disabled catchtap='Tap'/>
            </block>
          </div>
          <input name="password" type="password" class='ipt' maxlength="6" :focus="isFocus" bindinput="Focus"/>

        </form>
        <image src="../../img/close.png" class='auth-box-img' catchtap='bindimg'/>
      </div>
    </div>
    <!-- 选择支付方式 -->
    <div class="auth-pop" v-if="isShowPayList">
      <div class="auth-box" style='background:#FFFFFF;position:relative;top:-40rpx'>
        <div class='auth-box-zhi'>选择支付方式</div>
        <div class='a-cell-content' bindtap='balancepaid'>
          <image src='../../img/yue.png' class='a-cell-con-img'></image>
          <div class='a-cell-tetx'>
            <div class='a-cell-title'>余额支付</div>
            <div class='a-cells-te'>使用你的账号余额支付</div>
          </div>
        </div>
        <div class='a-cell-content' bindtap='WeChatPay'>
          <image src='../../img/weixin.png' class='a-cell-con-img'></image>
          <div class='a-cell-tetx' style='margin-top:23rpx;'>
            <div class='a-cell-title'>微信支付</div>
          </div>
        </div>
        <image src="../../img/close.png" class='auth-box-imgs' catchtap='bindimgs'></image>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 确认订单
   */
  import {fetchOrderInfo, fetchDefaultAddress, fetchAddressById} from 'api/index';

  export default {
    data() {
      return {
        positionImg: require('public/images/location.png'),
        stripedImg: require('public/images/user/striped.png'),
        arrowsRightImg: require('public/images/right.png'),
        memberMessage: '', // 买家留言
        userInfo: {},
        myPoint: '', // 当前可用积分
        maxPoint: [], // 本次最多使用积分
        pointRule: [], // 积分使用规则
        cartDetailList: [], // 购物清单列表
        totalAmount: [], // 商品总额
        selectBenefitList: [], // 可选优惠活动列表
        couponDetailList: [], // 不参加优惠活动的时候可以使用的优惠券
        supplierAndAmountList: [], // 供应商对应优惠金额
        enableElectronicInvoice: [], // 是否启用电子发票
        argumentsStr: '', // 请求数据
        payType: 0, // 支付类型
        locationId: '',
        address: {}, // 收货地址
        isShowPayList: false // 是否展示支付列表
      };
    },
    components: {},
    computed: {},
    methods: {
      showPayList() {
        this.isShowPayList = true;
      },
      selectAddress() {
        this.$bridge.link.navigateTo(`/pages/user/address-list/main?type=1`);
      },
      async fetchAddressById() {
        let res = await fetchAddressById({ids: this.locationId.split(','), passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          console.log(res.result[0]);
          this.address = res.result[0];
        }
      },
      async getDefaultAddress() {
        let res = await fetchDefaultAddress({
          ip: '127.0.0.1',
          memberId: this.userInfo.memberId,
          passportId: this.userInfo.id
        });
        if (res.firstErrorMessage === '' && res.location.provinceName) {
          this.address = res.location;
        }
      },
      async getOrderInfo() {
        let params = {
          passportId: this.userInfo.id,
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          systemType: 'B2C',
          deviceType: 'MOBILE',
          list: this.argumentsStr
        };
        let res = await fetchOrderInfo(params);
        if (res.firstErrorMessage === '') {
          res.cartDetailList.forEach((item) => {
            item.unitPrice = item.unitPrice.toFixed(2);
          });
          res.totalAmount = res.totalAmount.toFixed(2);
          let {myPoint, maxPoint, pointRule, cartDetailList, totalAmount, selectBenefitList, couponDetailList, supplierAndAmountList, enableElectronicInvoice} = res;
          this.myPoint = myPoint;
          this.maxPoint = maxPoint;
          this.pointRule = pointRule;
          this.cartDetailList = cartDetailList;
          this.totalAmount = totalAmount;
          this.selectBenefitList = selectBenefitList;
          this.couponDetailList = couponDetailList;
          this.supplierAndAmountList = supplierAndAmountList;
          this.enableElectronicInvoice = enableElectronicInvoice;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onUnload() {
    },
    onLoad() {
      this.$bridge.storage.remove('locationId');
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.argumentsStr = this.$root.$mp.query.data;
      this.locationId = this.$bridge.storage.get('locationId');
      if (this.locationId === '') {
        this.getDefaultAddress();
      } else {
        this.fetchAddressById();
      }
      this.getOrderInfo();
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body
    background-color: rgb(244, 244, 244);
    height: 100%;

  .v-cell {
    width: 100%;
    height: 3px;
  }

  .userContainer {
    display: flex;
    flex-direction: column;
    height: 75px;
    background: #fff;
  }

  .useDesStyle {
    padding: rpx(20) 0 0 rpx(63);
    font-family: PingFang-SC-Regular;
    font-size: rpx(32);
    color: #333;
    font-weight: bold;
  }

  .nameStyle {
    padding-left: rpx(44);
  }

  .c-address {
    padding: rpx(14) 0 0 rpx(26);
    font-size: rpx(28);
    display: flex;
  }

  .addressSty {
    width: rpx(20);
    height: rpx(26);
    padding-top: rpx(8);
  }

  .detail-address {
    padding-left: rpx(20);
  }

  .bootom-img {
    width: 100%;
    height: rpx(4);
  }

  .i-img {
    width: rpx(20);
    height: rpx(30);
    position: relative;
    top: rpx(-53);
    left: rpx(706);
  }

  .m-product-all {
    margin-top: rpx(20);
    background: #fff;
  }

  .m-te {
    color: #666;
    font-size: rpx(32);
  }

  .m-product-price {
    display: flex;
    justify-content: space-between;
    margin-right: rpx(30);
  }

  .m-product-price label {
    padding-left: rpx(20);
  }

  .total-info {
    font-size: rpx(28);
    margin-top: rpx(20);
    padding-bottom: rpx(40);
  }

  .m-sty-name {
    width: 70%;
    margin-left: rpx(203);
    color: #999;
  }

  .m-cells {
    font-size: rpx(28);
    margin-top: rpx(20);
  }

  /*textarea start*/

  .u-textarea {
    display: block;
    border: 0;
    width: rpx(680);
    font-size: 1em;
  }

  .p-cell {
    font-size: 14px;
    margin-top: 10px;
    padding: rpx(20);
  }

  .u-textarea-counter {
    color: #b2b2b2;
    text-align: right;
  }

  .u-cell-warn .u-textarea-counter {
    color: #e64340;
  }

  .m-footer-btn {
    border-top: rpx(1) solid #eee;
    line-height: rpx(100);
  }

  .m-footer-btn-main {
    width: 25%;
    height: 100%;
    float: right;
    background-color: #ea281a;
    color: #fff;
    line-height: rpx(100);
    font-size: rpx(32);
  }

  .m-footer-btn-listS {
    color: #ea281a;
    font-size: rpx(30);
    text-align: left;
    padding-left: rpx(30);
    float: left;
  }

  /*选择规格遮罩 start*/

  .m-panel-sp {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .m-panel-sp-content {
    height: rpx(780);
    background-color: #fff;
    position: absolute;
    width: 100%;
    bottom: 0;
    box-shadow: 0px rpx(-10) rpx(15) rgba(0, 0, 0, 0.35);
  }

  .m-panel-sp-pinfo {
    height: rpx(196);
    border-bottom: rpx(1) solid #d5d5d5;
    box-sizing: border-box;
    padding: rpx(20);
    position: relative;
  }

  .m-panel-sp-pimg {
    width: rpx(200);
    height: rpx(200);
    position: absolute;
    top: rpx(-50);
    background-color: #fff;
    border-radius: rpx(8);
    box-sizing: border-box;
    padding: rpx(10);
    box-shadow: 0 0 rpx(10) rgba(0, 0, 0, 0.35);
    float: left;
  }

  .m-panel-sp-pimg image {
    width: 100%;
    height: 100%;
  }

  .m-panel-sp-pname {
    float: left;
    margin-left: rpx(216);
    font-size: rpx(28);
    line-height: rpx(40);
  }

  .m-panel-sp-pname .m-pprice {
    color: #db384c;
    font-size: rpx(32);
    line-height: rpx(50);
    font-weight: bold;
  }

  .m-panel-sp-icon {
    position: absolute;
    right: rpx(10);
    top: rpx(10);
    z-index: 3;
  }

  .m-panel-sp-listbox {
    height: rpx(604);
  }

  .m-panel-sp-listbox-item {
    box-sizing: border-box;
    padding: rpx(10) rpx(20);
  }

  .m-panel-sp-listbox-item .m-cells-title {
    color: black;
    margin: rpx(20) rpx(10);
    padding: 0;
  }

  .m-panel-sp-labellist label {
    display: inline-block;
    font-size: rpx(24);
    padding: rpx(10) rpx(15);
    border-radius: rpx(8);
    margin: rpx(10);
    color: #888;
    border: rpx(1) solid #d5d5d5;
  }

  .m-panel-sp-sellabel {
    color: #db384c !important;
    border: rpx(1) solid #db384c !important;
  }

  .y-cells-bach {
    width: 85%;
    height: rpx(158);
    margin-left: rpx(83);
    color: #fff;
  }

  .y-img {
    width: 100%;
    height: rpx(190);
  }

  .y-con {
    width: 27%;
    height: rpx(146);
    text-align: center;
    line-height: rpx(146);
    position: relative;
    top: rpx(-319);

  }

  .y-juan {
    width: 73%;
    height: rpx(146);
    position: relative;
    top: rpx(-164);
    left: rpx(180);
  }

  .y-juan view:nth-child(1) {
    margin-top: rpx(14);
    padding-left: rpx(10);
    padding-top: rpx(17);
    font-size: rpx(34);

  }

  .y-juan view:nth-child(2) {
    font-size: rpx(24);
    padding-left: rpx(10);
    margin-top: rpx(10);

  }

  .y-juan view:nth-child(3) {
    font-size: rpx(24);
    padding-left: rpx(10);
  }

  .m-inter {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: rpx(28);
    margin-top: rpx(58);
  }

  /*商品数量加减*/

  .u-cart-num {
    position: relative;
    z-index: 2;
    left: rpx(25);
  }

  .u-cart-num {
    display: inline-block;
    border: rpx(1) solid #d5d5d5;
    height: rpx(56);
    line-height: rpx(54);
    border-radius: rpx(4);
    box-sizing: border-box;
    margin-top: rpx(15);
    text-align: center;
  }

  .u-num-btn {
    float: left;
    width: rpx(88);
  }

  .u-cart-num input {
    float: left;
    width: rpx(80);
    height: rpx(54);
    border-left: rpx(1) solid #d5d5d5;
    border-right: rpx(1) solid #d5d5d5;
    font-size: rpx(28);
  }

  .m-inter-cell {
    width: rpx(137);
    height: rpx(62);
    border: rpx(1) solid #ea281a;
    color: #ea281a;
    font-size: rpx(28);
    line-height: rpx(63);
    text-align: center;
    position: relative;
    left: rpx(300);
    top: rpx(-69);
  }

  .m-m-panel-sp-btn {
    height: rpx(100);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 10;
  }

  .m-m-panel-sp-lbtn {
    float: left;
    width: 50%;
    border-top: rpx(1) solid #d5d5d5;
    text-align: center;
  }

  .m-m-panel-sp-rbtn {
    width: 100%;
    float: left;
    background-color: #db384c;
    line-height: rpx(100);
    color: #fff;
    text-align: center;
  }

  .auth-pop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    z-index: 999;
  }

  .auth-box {
    width: rpx(640);
    background-color: #f4f4fb;
    box-shadow: 0 rpx(10) rpx(30) rgba(0, 0, 0, 0.5);
    height: rpx(515);
    border-radius: rpx(4);
    position: relative;
    top: rpx(-222);
  }

  .auth-box-title {
    margin-top: rpx(40);
    font-size: rpx(32);
    font-family: PingFangSC-Semibold;
  }

  .auth-box-meny {
    margin-top: rpx(40);
    font-size: rpx(72);
  }

  .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    float: left;
    position: relative;
    top: rpx(51);
    left: rpx(26);
    background: #fff;
    border-radius: rpx(4);
  }

  .iptbox {
    width: rpx(94.5);
    height: rpx(94);
    border: rpx(1) solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .ipt {
    width: 0;
    height: 0;
  }

  .btn-area {
    width: 80%;
    background-color: orange;
    color: white;
  }

  .auth-box-img {
    width: rpx(20);
    height: rpx(20);
    position: relative;
    top: rpx(-355);
    right: rpx(16);
    z-index: 2;
  }

  /*支付方式*/

  .auth-box-zhi {
    margin-top: rpx(27);
    font-size: rpx(32);
    color: #999;
  }

  .a-cell-con-img {
    width: rpx(100);
    height: rpx(100);
  }

  .a-cell-content {
    display: flex;
    flex-direction: row;
    margin-left: rpx(47);
    margin-top: rpx(28);
  }

  .a-cell-title {
    font-size: rpx(35);
    color: black;
  }

  .a-cell-tetx {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: rpx(54);
    margin-left: rpx(26);
    width: 72%;
  }

  .a-cells-te {
    font-size: rpx(28);
    color: #666;
    width: 92%;
  }

  .m-panel-sp-listbox {
    height: rpx(604);
  }

  .auth-box-imgs {
    width: rpx(20);
    height: rpx(20);
    position: absolute;
    top: rpx(38);
    right: rpx(40);
    z-index: 2;
  }

  .shoppingcart {
    position: relative;
    top: rpx(160);
    height: rpx(171);
    width: rpx(171);
    left: rpx(290);
  }

  .text {
    position: relative;
    top: rpx(180);
    color: #999;
    font-size: rpx(28);
    text-align: center;
  }

  .m-cell-address {
    font-size: rpx(28);
    line-height: rpx(136);
    padding-left: rpx(34);
  }

</style>
