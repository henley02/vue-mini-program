<template>
  <div>
    <div class="container">
      <div class="userinfo">
        <div class='userinfo-img'>
          <image :src="memberUserInfo.user.avatar"/>
        </div>
        <text class='userinfo-text'>{{memberUserInfo.member ? memberUserInfo.member.name : '未登录'}}</text>
        <div class='userinfo-Info' v-if="!memberUserInfo.member" bindtap='Clicklogin'>点击登录</div>
        <div class='userinfo-user-Info' v-else>
          <div v-if="memberUserInfo.currentLevel.name">{{memberUserInfo.currentLevel.name}} | {{point}} </div>
          <div v-if="memberUserInfo.lackPoint && memberUserInfo.nextLevel.name">
            还需{{memberUserInfo.lackPoint}}分升级为{{memberUserInfo.nextLevel.name}}
          </div>
        </div>
        <div class='userinfo-qian' @tap='signIn'>{{memberUserInfo.hasSignIn ? '已签到' : '签到'}}</div>
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
          <navigator :url="item.url" class="m-cell m-cell-access" v-for="(item,index) in extendList" :key="index">
            <div class="m-cell-hd " style="color:#fd690c">
              <image :src="item.imageUrl" class='m-cell-img1'/>
            </div>
            <div class="m-cell-bd m-cell-primary">
              <p>{{item.name}}</p>
            </div>
            <div>{{item.value}}</div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
      </div>
    </div>

    <div class="m-panel-bd" style="margin-bottom:10rpx;">
      <div class="m-media-box m-media-box-small-appmsg">
        <div class="m-cells">
          <navigator v-for="(item,index) in list " :key="index" :url="item.url" class="m-cell m-cell-access">
            <div class="m-cell-bd m-cell-primary">
              <p>{{item.name}}</p>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
      </div>
    </div>
    <button @tap='exit' class='u-btn'>退出</button>
  </div>
</template>

<script>
  /**
   * 用户登录
   */
  import {fetchUserInfo, fetchPoint, signIn, exit, deleteUserOauth} from 'api/index.js';

  export default {
    data() {
      return {
        isClick: true,
        defaultHead: require('public/images/default-head.png'),
        point: 0, // 我的积分
        userInfo: {},
        extendList: [
          {name: '积分', imageUrl: require('public/images/user/integral.png'), value: 0, url: 'integral/integral'},
          {name: '优惠券', imageUrl: require('public/images/user/coupon.png'), value: 0, url: 'coupon/coupon'}
        ],
        list: [
          {name: '消费记录', url: 'pages/user/consumption-records/main'},
          {name: '积分兑换记录', url: '/pages/user/points-record/main'},
          {name: '我的账户', url: '/pages/user/user-account/main'},
          {name: '资料.地址管理', url: '/pages/address/list/main'},
          {name: '账户安全', url: '/pages/user/account-safety/main'}
        ],
        memberUserInfo: {
          user: {
            account: '',
            activeDate: '',
            class: '',
            id: '',
            isActive: '',
            isBindIm: '',
            isEmailBind: '',
            isMobileBind: '',
            isNeedCheck: '',
            isOnline: '',
            mobilePhone: '',
            name: '',
            pinyin: '',
            py: '',
            rowVersion: '',
            sourceId: '',
            sourceType: '',
            tenantId: ''
          },
          collectionNum: '', // 收藏数量
          couponEntityNum: '' // 优惠券数量
        },
        orderItems: [
          {
            status: 'UN_PAID',
            name: '待付款',
            url: 'bill',
            imageurl: require('public/images/paying.png')
          },
          {
            status: 'UN_SIGNED',
            name: '待收货',
            url: 'bill',
            imageurl: require('public/images/delivering.png')
          },
          {
            status: 'SIGNED',
            name: '待评价',
            url: 'bill',
            imageurl: require('public/images/evaluating.png')
          },
          {
            status: 'EVALUATION',
            name: '退售后',
            url: 'bill',
            imageurl: require('public/images/sold.png')
          }
        ]
      };
    },
    components: {},
    computed: {},
    methods: {
      /**
       * 退出
       */
      exit() {
        this.$bridge.dialog.confirm({
          title: '提示',
          content: '确定退出吗',
          confirmCallback: async () => {
            let res = await exit({id: this.userInfo.memberId});
            if (res.firstErrorMessage === '') {
              this.deleteUserOauth();
            } else {
              this.$bridge.dialog.alert(res.firstErrorMessage);
            }
          }
        });
      },
      /**
       * 删除用户授权
       */
      async deleteUserOauth() {
        let params = {
          deleteType: 'BY_USER',
          userIds: [this.memberUserInfo.user.id]
        };
        let res = await deleteUserOauth(params);
        if (res.firstErrorMessage === '') {
          this.$bridge.storage.remove('userInfo');
          wx.redirectTo({
            url: '/pages/user/login/main'
          });
        } else {
          this.$bridge.dialog.alert(res.firstErrorMessage);
        }
        console.log(res);
      },
      /**
       * 跳转到安全中心
       */
      goAccountSafety() {
        this.$bridge.link.goAccountSafety();
      },
      /**
       *  获取用户积分
       */
      async getPoint() {
        let params = {
          memberId: this.userInfo.memberId,
          passportId: this.userInfo.id
        };
        let res = await fetchPoint(params, {isLoading: false});
        this.point = res.point;
        this.extendList.find(item => item.name === '积分').value = this.point;
      },
      /**
       * 签到
       * @returns {Promise.<void>}
       */
      async signIn() {
        let res = await signIn({objectId: this.userInfo.memberId, passportId: this.userInfo.id, deviceType: 'MOBILE'});
        if (res.firstErrorMessage === '') {
          wx.showToast({
            title: '已签到',
            icon: 'success',
            duration: 1000
          });
          this.memberUserInfo.hasSignIn = true;
          this.getPoint();
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 获取用户信息
       * @returns {Promise.<void>}
       */
      async getUserINfo() {
        let operatingUnitId = this.$bridge.storage.get('operatingUnitId');
        let params = {
          passportId: this.userInfo.id,
          operatingUnitId: operatingUnitId,
          systemType: 'B2C',
          deviceType: 'MOBILE',
          storeId: '986901391685849088'
        };
        let res = await fetchUserInfo(params);
        if (!res.user.avatar) {
          res.user.avatar = this.defaultHead;
        }
        this.memberUserInfo = res;
        console.log(this.memberUserInfo);
        this.extendList.find(item => item.name === '优惠券').value = res.couponEntityNum;
      }
    },
    async onShow() {
      this.userInfo = this.$bridge.storage.get('userInfo');
      console.log(this.userInfo);
      if (!this.userInfo) {
        this.$bridge.link.goLogin();
      } else {
        this.getUserINfo();
        this.getPoint();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  @import "~public/css/login";

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
