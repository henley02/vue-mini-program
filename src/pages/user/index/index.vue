<template>
  <div class="container" v-if="!isLoading">
    <div class="userInfo">
      <div class='userInfo-img'>
        <image :src="memberUserInfo.user.avatar"/>
      </div>
      <text class='userInfo-text'>{{memberUserInfo.member.name}}</text>
      <div class='userInfo-user-Info'>
        <div v-if="memberUserInfo.currentLevel && memberUserInfo.currentLevel.name">{{memberUserInfo.currentLevel.name}} | {{point}} </div>
        <div v-if="memberUserInfo.lackPoint && memberUserInfo.nextLevel.name">
          还需{{memberUserInfo.lackPoint}}分升级为{{memberUserInfo.nextLevel.name}}
        </div>
      </div>
      <div class='userInfo-signIn' @tap='signIn'>{{memberUserInfo.hasSignIn ? '已签到' : '签到'}}</div>
    </div>

    <div class="m-panel-bd">
      <div class="m-media-box m-media-box-small-appmsg">
        <div class="m-cells">
          <navigator class="m-cell m-cell-access" url="/pages/user/order-list/main">
            <div class="m-cell-bd m-cell-primary">
              <div>全部订单</div>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
      </div>
    </div>
    <div class="">
      <div class="navs">
        <block v-for="(item,index) in orderItems" :key="index">
          <div class="nav-item" @tap="goOrderList(item)">
            <image :src="item.imageUrl" class="nav-image"/>
            <text>{{item.name}}</text>
          </div>
        </block>
      </div>
    </div>
    <div class="m-panel-bd" style='margin-bottom:20rpx'>
      <div class="m-media-box m-media-box-small-appmsg">
        <div class="m-cells">
          <navigator :url="item.url" class="m-cell m-cell-access"
                     v-for="(item,index) in extendList" :key="index">
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
        isLoading: true,
        isClick: true,
        defaultHead: require('public/images/default-head.png'),
        point: 0, // 我的积分
        userInfo: {},
        extendList: [
          {name: '积分', imageUrl: require('public/images/user/integrals.png'), value: 0, url: '/pages/user/integral/main'},
          {name: '优惠券', imageUrl: require('public/images/user/coupon.png'), value: 0, url: '/pages/user/coupon/main'}
        ],
        list: [
          {name: '积分兑换记录', url: '/pages/user/points-record/main'},
          {name: '我的账户', url: '/pages/user/user-account/main'},
          {name: '资料.地址管理', url: '/pages/user/user-manage/main'},
          {name: '账户安全', url: '/pages/user/account-safety/main'}
        ],
        memberUserInfo: {
          user: {
            account: '',
            activeDate: '',
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
          }
        },
        orderItems: [
          {
            status: 'UN_PAID',
            name: '待付款',
            imageUrl: require('public/images/paying.png')
          },
          {
            status: 'UN_SIGNED',
            name: '待收货',
            imageUrl: require('public/images/delivering.png')
          },
          {
            status: 'SIGNED',
            name: '待评价',
            imageUrl: require('public/images/evaluating.png')
          },
          {
            status: 'EVALUATION',
            name: '退售后',
            imageUrl: require('public/images/sold.png')
          }
        ]
      };
    },
    methods: {
      goOrderList(item) {
        this.$bridge.link.navigateTo(`/pages/user/order-list/main?type=${item.status}`);
      },
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
          this.getUserINfo(2);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 获取用户信息
       * @returns {Promise.<void>}
       */
      async getUserINfo(time) {
        if (time === 1) {
          this.isLoading = true;
        }
        let operatingUnitId = this.$bridge.storage.get('operatingUnitId');
        let params = {
          passportId: this.userInfo.id,
          operatingUnitId: operatingUnitId,
          systemType: 'B2C',
          deviceType: 'MOBILE',
          storeId: '986901391685849088'
        };
        let res = await fetchUserInfo(params, {isLoading: time === 1});
        if (res.code === '21') {
          this.$bridge.link.goLogin();
          return false;
        }
        if (!res.user.avatar) {
          res.user.avatar = this.defaultHead;
        }
        this.memberUserInfo = res;
        this.extendList.find(item => item.name === '优惠券').value = res.couponEntityNum;
        if (time === 1) {
          this.isLoading = false;
        }
      }
    },
    async onShow() {
      this.userInfo = this.$bridge.storage.get('userInfo');
      if (!this.userInfo) {
        this.$bridge.link.goLogin();
      } else {
        this.getUserINfo(1);
        this.getPoint();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";

  .container
    background-color: rgb(244, 244, 244)

  .userInfo {
    width: 100%;
    height: rpx(288);
    background: -webkit-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75));
    background: linear-gradient(to right, rgb(230, 70, 74), rgb(248, 117, 75));
  }

  .userInfo-img {
    width: rpx(110);
    height: rpx(110);
    border-radius: rpx(10);
    position: relative;
    top: rpx(97);
    left: rpx(45);
  }

  .userInfo-img image {
    width: rpx(110);
    height: rpx(110);
    border-radius: rpx(10);
  }

  .userInfo-text {
    position: absolute;
    left: rpx(176);
    top: rpx(91);
    color: #fff;
    font-size: rpx(32);
  }

  .userInfo-user-Info {
    position: absolute;
    display: initial;
    left: rpx(179);
    top: rpx(143);
    font-size: rpx(24);
    color: #facfb7;
  }

  .userInfo-signIn {
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

  .m-cell-img1 {
    display: flex;
    width: rpx(38);
    height: rpx(38);
    align-self: center;
    top: rpx(5);
    padding-right: rpx(12);
  }

  .m-cell-hd {
    text-align: center;
    line-height: rpx(56);
  }

  .m-cell-bd p {
    margin-left: rpx(4);
  }

  .m-cell-primary div {
    font-size: rpx(28);
  }

  .u-btn {
    background-color: #ea281a;
    color: #fff;
    width: 85%
  }
</style>
