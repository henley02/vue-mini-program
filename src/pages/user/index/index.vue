<template>
  <div>
    <div class="container">
      <div class="userinfo">
        <div class='userinfo-img'>
          <image :src="memberUserInfo.user.avatar ? memberUserInfo.user.avatar : '../../img/userImg.png'"/>
        </div>
        <text class='userinfo-text'>{{memberUserInfo.member ? memberUserInfo.member.name : '未登录'}}</text>
        <div class='userinfo-Info' v-if="!memberUserInfo.member" bindtap='Clicklogin'>点击登录</div>
        <div class='userinfo-user-Info' v-else>
          <div v-if="memberUserInfo.currentLevel.name">{{memberUserInfo.currentLevel.name}} | {{PointsInfo}} </div>
          <div v-if="memberUserInfo.lackPoint && memberUserInfo.nextLevel.name">
            还需{{memberUserInfo.lackPoint}}分升级为{{memberUserInfo.nextLevel.name}}
          </div>
        </div>
        <div class='userinfo-qian' bindtap='signIn'>{{memberUserInfo.hasSignIn == true ? '已签到' : '签到'}}</div>
      </div>
      <div class="m-panel-bd">
        <div class="m-media-box m-media-box-small-appmsg">
          <div class="m-cells">
            <navigator url="../orders/index" class="m-cell m-cell-access">
              <div class="m-cell-bd m-cell-primary">
                <p>全部订单</p>
              </div>
              <text class="m-cell-ft"></text>
            </navigator>
          </div>
        </div>
      </div>

      <div class="navs">
        <block v-for="(item,index) in orderItems" :key="index">
          <div class="nav-item" catchtap="onToOrderTap">
            <image :src="item.imageurl" class="nav-image"/>
            <text>{{item.name}}</text>
          </div>
        </block>
      </div>
    </div>
    <div class="m-panel-bd" style='margin-bottom:20rpx'>
      <div class="m-media-box m-media-box-small-appmsg">
        <div class="m-cells">
          <navigator url="../collect/collect" class="m-cell m-cell-access">
            <div class="m-cell-hd " style="color:#fd690c">
              <image src='../../img/shoucang.png' class='m-cell-img'></image>
            </div>
            <div class="m-cell-bd m-cell-primary">
              <p>收藏</p>
            </div>
            <div>{{collection}}</div>
            <text class="m-cell-ft"></text>
          </navigator>
          <navigator url="../integral/integral" class="m-cell m-cell-access">
            <div class="m-cell-hd " style="color:#fd690c">
              <image src='../../img/integrals.png' class='m-cell-img1'></image>
            </div>
            <div class="m-cell-bd m-cell-primary">
              <p>积分</p>
            </div>
            <div>{{PointsInfo}}</div>
            <text class="m-cell-ft"></text>
          </navigator>
          <navigator url="../coupon/coupon" class="m-cell m-cell-access">
            <div class="m-cell-hd " style="color:#fd690c">
              <image src='../../img/coupon.png' class='m-cell-img2'></image>
            </div>
            <div class="m-cell-bd m-cell-primary">
              <p>优惠券</p>
            </div>
            <div>{{Couponamount}}</div>
            <text class="m-cell-ft"></text>
          </navigator>
          <navigator url="../cards/index" class="m-cell m-cell-access">
            <div class="m-cell-hd " style="color:#fd690c">
              <image src='../../img/giftcardicon.png' class='m-cell-img3'></image>
            </div>
            <div class="m-cell-bd m-cell-primary">
              <p>礼品卡</p>
            </div>
            <div>{{GiftcardCount}}</div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
      </div>
    </div>

    <div class="m-panel-bd" style="margin-bottom:10rpx;">
      <div class="m-media-box m-media-box-small-appmsg">
        <div class="m-cells">
          <navigator url="../consumptionrecords/consumptionrecords" class="m-cell m-cell-access">

            <div class="m-cell-bd m-cell-primary">
              <p>消费记录</p>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
          <navigator url="../Pointsrecord/Pointsrecord" class="m-cell m-cell-access">
            <div class="m-cell-bd m-cell-primary">
              <p>积分兑换记录</p>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
          <navigator url="../Useraccount/Useraccount" class="m-cell m-cell-access">
            <div class="m-cell-bd m-cell-primary">
              <p>我的账户</p>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
          <navigator url="../Dataaddress/Dataaddress" class="m-cell m-cell-access">
            <div class="m-cell-bd m-cell-primary">
              <p>资料.地址管理</p>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
          <div class="m-cell m-cell-access" bindtap='security'>
            <div class="m-cell-bd m-cell-primary">
              <p>账户安全</p>
            </div>
            <text class="m-cell-ft"></text>
          </div>
          <navigator url="../Increasedticket/Increasedticket" class="m-cell m-cell-access">
            <div class="m-cell-bd m-cell-primary">
              <p>增票资质</p>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
      </div>
    </div>
    <button bindtap='exite' class='u-btn'>退出</button>
  </div>
</template>

<script>
  /**
   * 用户登录
   */
  import {fetchUserInfo} from 'api/index.js';

  export default {
    data() {
      return {
        memberUserInfo: {
          collectionNum: '', // 收藏数量
          couponEntityNum: '' // 优惠券数量
        }
      };
    },
    components: {},
    computed: {},
    methods: {
      async getUserINfo() {
        let userInfo = this.$bridge.storage.get('userInfo');
        let operatingUnitId = this.$bridge.storage.get('operatingUnitId');
        let params = {
          passportId: userInfo.id,
          operatingUnitId: operatingUnitId,
          systemType: 'B2C',
          deviceType: 'MOBILE',
          storeId: '986901391685849088'
        };
        let res = await fetchUserInfo(params);
        this.memberUserInfo = res;
        console.log(res);
      }
    },
    created() {
    },
    async onShow() {
      let userInfo = this.$bridge.storage.get('userInfo');
      console.log(userInfo);
      if (!userInfo) {
        this.$bridge.link.goLogin();
      } else {
        this.getUserINfo();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  @import "~public/css/login";

  /* pages/mine/mine.wxss */

  page {
    font-family: PingFang-SC-Regular;
  }

  .userinfo {
    width: 100%;
    height: rpx(288);
    background: -webkit-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75));
    background: linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75));
  }

  .account-bg {
    width: 100%;
    height: rpx(150);
  }

  .userinfo-avatar {
    width: rpx(108);
    height: rpx(350);
    margin: rpx(20);
    border-radius: 50%;
  }

  .userinfo-nickname {
    color: #fff;
  }

  /* 订单 */

  .order {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: rpx(90);
  }

  .myorder-text {
    font-size: rpx(30);
    color: gray;
    margin: rpx(20);
    width: 40%;
  }

  .myorderlook-text {
    font-size: rpx(30);
    color: gray;
    position: relative;
    right: rpx(20);
    width: 60%;
    text-align: right;
  }

  .next-image {
    width: rpx(20);
    height: rpx(25);
    position: relative;
    right: rpx(10);
  }

  .navs {
    display: flex;
    background: #fff;
    margin-bottom: rpx(20);
  }

  .m-cell {
    border-bottom: rpx(1) solid #eee;

  }

  .m-cell-ft {
    position: relative;
    left: -10rpx;
    top: rpx(2);
    height: rpx(24);
    width: rpx(13.4);
    padding-left: rpx(20);
  }

  .nav-item {
    width: 25%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: rpx(20);
  }

  .nav-item .nav-image {
    width: rpx(40);
    height: rpx(31);
    margin: rpx(5);
  }

  .nav-item text {
    margin-top: rpx(12);
    font-size: rpx(25);
    color: black;
  }

  /* 列表 */

  .m-cell-img {
    display: flex;
    width: rpx(43);
    height: rpx(40);
    align-self: center;
    top: rpx(5);
    padding-right: rpx(12);
  }

  .m-cell-img1 {
    display: flex;
    width: rpx(38);
    height: rpx(38);
    align-self: center;
    top: rpx(5);
    padding-right: rpx(12);
  }

  .m-cell-img2 {
    display: flex;
    width: rpx(36);
    height: rpx(30);
    align-self: center;
    top: rpx(5);
    padding-right: rpx(12);
  }

  .m-cell-img3 {
    display: flex;
    width: rpx(37);
    height: rpx(30);
    align-self: center;
    top: rpx(5);
    padding-right: rpx(12);
  }

  .m-cell-img_yuhu {
    display: flex;
    width: 19px;
    height: 19px;
    align-self: center;
    top: rpx(5);
  }

  .m-cell-bd p {
    margin-left: rpx(4);
  }

  .m-cell-hd {
    text-align: center;
    line-height: rpx(56);
  }

  .m-cell-primary {
    font-size: 14px;
  }

  .foucs-redpoint {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: red;
  }

  .userinfo-img {
    width: rpx(110);
    height: rpx(110);
    border-radius: rpx(10);
    position: relative;
    top: rpx(97);
    left: rpx(45);
  }

  .userinfo-img image {
    width: rpx(110);
    height: rpx(110);
    border-radius: rpx(10);

  }

  .userinfo-text {
    position: absolute;
    left: rpx(176);
    top: rpx(91);
    color: #fff;
    font-size: rpx(32);
  }

  .userinfo-Info {
    position: absolute;
    display: initial;
    left: rpx(179);
    top: rpx(142);
    border: rpx(1) #fff solid;
    font-size: rpx(28);
    color: #fff;
    width: rpx(168);
    height: rpx(52);
    line-height: rpx(52);
    text-align: center;
    border-radius: rpx(4);
  }

  .userinfo-qian {
    position: absolute;
    display: initial;
    left: rpx(594);
    top: rpx(183);
    border: rpx(1) #fff solid;
    font-size: rpx(29);
    color: #fff;
    width: rpx(109);
    height: rpx(61);
    line-height: rpx(61);
    text-align: center;
    border-radius: rpx(6);
  }

  .userinfo-user-Info {
    position: absolute;
    display: initial;
    left: rpx(179);
    top: rpx(143);
    font-size: rpx(24);
    color: #facfb7;
  }

  .u-btn {
    background-color: #ea281a;
    color: #fff;
    width: 85%
  }
</style>
