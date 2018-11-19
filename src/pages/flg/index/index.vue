<template>
  <scroll-view scroll-y="true" @scrolltolower="dropDown" class="container" style='height:100%;'>
    <div class="notification-wrapper"
         v-if="data.distributorStatus==='PENDING_APPROVAL' || data.distributorStatus==='DISAGREED' || data.distributorStatus==='AGREED_AND_DISABLED'">
      <img :src="notification"/>
      <text v-if="data.distributorStatus==='PENDING_APPROVAL'">您的入馆申请正在审核中, 请耐心等待!</text>
      <text v-if="data.distributorStatus==='DISAGREED'">您的入馆申请未通过，再次申请成功率更大噢</text>
      <text v-if="data.distributorStatus==='AGREED_AND_DISABLED'">您的芳聊馆已失效，可联系管理员进行激活</text>
    </div>
    <div class="banner">
      <img :src="bgIndex" class="bg-index"/>
      <div class="content-wrapper" @tap="goShopDecoration()">
        <img :src="data.avatarUrl" class="head-img"/>
        <div v-if="data.distributorStatus && data.distributorStatus==='AGREED'">
          <div class="name">{{data.storeName}}</div>
          <div style="display:flex;flex-direction: row">
            <div class="desc opened">进入我的馆</div>
            <img class="share" :src="shareImg"/>
          </div>
        </div>
        <div v-else="">
          <div class="name">等待馆主开馆</div>
          <div class="desc" @tap="open()">点我开馆</div>
        </div>
      </div>
    </div>
    <div class="activity" v-if="wfxSetting.notice">
      <div class="name">活动</div>
      <div class="content" @tap="showNotice(wfxSetting.notice)">{{wfxSetting.notice}}</div>
    </div>
    <div class="list">
      <div class="title">
        <div class="icon"></div>
        <div class="name">好馆推荐</div>
      </div>
      <ul v-if="topList.length>0" class="clearfix">
        <li v-for="(item,index) in topList" :key="index" class="item">
          <div class="img" :style="{backgroundImage:'url('+item.storeBackgroundPictureUrl+')'}"></div>
          <div class="name">{{item.name}}</div>
          <div class="zhishu">网红指数  {{item.popularityIndex}}</div>
        </li>
      </ul>
      <div v-if="topList.length==0 && isEnd">
        <image :src='noData' class='shoppingcart'></image>
        <div class='text'>成为第一个开馆的人</div>
      </div>
    </div>
    <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
    <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
    <!--权益的弹框-->
    <div v-if="isShowRights" class="right-pop">
      <div class="modal-mask" @tap="toggleRightsPop" @touchmove="preventTouchMove"></div>
      <div class="modal-dialog">
        <div class="image-wrapper">
          <image :src="rightsImg"/>
        </div>
        <div class="modal-title">开店权益</div>
        <scroll-view class="modal-content" scroll-y="true" style='height:70px;'>
          <rich-text :nodes="wfxSetting.right"></rich-text>
        </scroll-view>
        <div class="modal-footer">
          <div class="btn-cancel" @tap="toggleRightsPop" data-status="cancel">取消</div>
          <div class="btn-confirm" @tap="confirmRightsPop" data-status="confirm">确定</div>
        </div>
      </div>
    </div>
    <!--开馆-输入馆名-->
    <div v-if="showModal" class="entry-distributor-name">
      <div class="modal-mask" @tap="hideModal" @touchmove="preventTouchMove"></div>
      <div class="modal-dialog">
        <div class="modal-title">输入店铺名称</div>
        <div class="modal-content">
          <div class="modal-input">
            <input placeholder-class="input-holder" type="text" maxlength="10" v-model="distributorName" class="input"
                   placeholder="不超过10个字"/>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn-cancel" @tap="onCancel" data-status="cancel">取消</div>
          <div class="btn-confirm" @tap="onConfirm" data-status="confirm">确定</div>
        </div>
      </div>
    </div>
    <!--点击活动的弹框-->
    <div v-if="isShowNotice" class="entry-distributor-name">
      <div class="modal-mask" @tap="hideShowNotice" @touchmove="preventTouchMove"></div>
      <div class="modal-dialog">
        <div class="modal-title">活动</div>
        <image :src="closeImg" class="close" @tap="hideShowNotice"/>
        <div class="modal-content">
          <div class="modal-input">
            <div>{{wfxSetting.notice}}</div>
          </div>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script>
  import {
    fetchWFXMember,
    fetchTopStore,
    fetchWFXOperationSetting,
    applyWFXDistributor
  } from 'api/index';

  /**
   * 芳聊馆首页
   */
  export default {
    data() {
      return {
        isShowNotice: false,
        memberUserInfo: {},
        wfxSetting: {
          notice: '', // 活动
          right: '', // 权益
          popularityByLike: 0, // 点赞增加人气数量
          popularityByOrder: 0 // 订单增加人气数量
        },
        distributorName: '',
        rightsImg: require('public/images/flg/index/rights.png'),
        notification: require('public/images/flg/index/notification.png'),
        bgIndex: require('public/images/flg/index/bg-index.png'),
        shareImg: require('public/images/flg/index/share.png'),
        closeImg: require('public/images/close.png'),
        userInfo: {},
        isLoading: false,
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        isEnd: false,
        canDropDown: true, // 是否可以下拉加载
        topList: [],
        isOpen: true,
        showModal: false, // 是否展示开店输入店名的弹框
        isShowRights: false, // 是否显示权益的弹框
        data: {
          memberName: '', // 会员名称
          avatarUrl: '', // 头像路径
          distributorStatus: '', // 微分销状态,
          storeId: '', // 微分销店铺Id
          storeName: '', // 微分销店铺名称
          storeBackgroundPictureId: '', // 店铺背景图片Id
          storeBackgroundPictureUrl: '', // 店铺背景图片Url
          storeIntroduction: '', // 店铺简介
          popularityIndex: '', // 人气指数
          salesQuantityCount: '' // 商品销量
        }
      };
    },
    methods: {
      hideShowNotice() {
        this.isShowNotice = false;
      },
      showNotice() {
        this.isShowNotice = true;
      },
      /**
       * 点我开馆
       * 如果有店铺权益就弹出店铺权益框
       * 如果没有，就弹出输入店名的框
       */
      open() {
        if (this.data.distributorStatus === 'PENDING_APPROVAL') {
          this.$bridge.dialog.alert({content: '您的入馆申请正在审核中，请耐心等待！'});
          return;
        }
        if (this.wfxSetting.right) {
          this.toggleRightsPop();
        } else {
          this.showDialogBtn();
        }
      },
      /**
       * 权益弹框 -- 确认
       */
      confirmRightsPop() {
        this.isShowRights = false;
        this.showDialogBtn();
      },
      /**
       * 显示、隐藏权益弹框
       */
      toggleRightsPop() {
        this.isShowRights = !this.isShowRights;
      },
      /**
       * 输入店名的弹窗
       */
      showDialogBtn: function () {
        this.showModal = true;
      },
      /**
       * 弹出框蒙层截断touchmove事件
       */
      preventTouchMove: function () {
      },
      /**
       * 隐藏模态对话框
       */
      hideModal: function () {
        this.showModal = false;
      },
      /**
       * 对话框取消按钮点击事件
       */
      onCancel: function () {
        this.hideModal();
      },
      /**
       * 对话框确认按钮点击事件
       */
      onConfirm: function () {
        this.apply();
        this.hideModal();
      },
      /**
       * 申请成为微分销
       */
      async apply() {
        let params = {
          passportId: this.userInfo.id,
          id: this.data.id,
          distributorName: this.distributorName,
          memberRowVersion: this.data.memberRowVersion,
          rowVersion: this.data.rowVersion
        };
        let res = await applyWFXDistributor(params);
        if (res.firstErrorMessage === '' && res.result) {
          this.$bridge.dialog.alert({content: '提交成功，您的申请已经在排队处理中'});
          this.data.distributorStatus = 'PENDING_APPROVAL';
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 跳转到店铺装修
       */
      goShopDecoration() {
        if (this.data.distributorStatus === 'AGREED') {
          this.$bridge.link.navigateTo('/pages/flg/shop-decoration/main');
        }
      },
      /**
       * 下拉加载
       */
      dropDown() {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        this.fetchTopStore();
      },
      /**
       * 获取微分销设置信息
       */
      async fetchWFXOperationSetting() {
        let res = await fetchWFXOperationSetting({});
        if (res.firstErrorMessage === '') {
          this.wfxSetting = res;
        }
      },
      /**
       * 获取商铺推荐
       * @returns {Promise.<void>}
       */
      async fetchTopStore() {
        this.isLoading = true;
        if (this.pageNumber === 1) {
          this.topList = [];
        }
        let params = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          passportId: this.userInfo.id
        };
        let res = await fetchTopStore(params, {isLoading: this.pageNumber === 1});
        if (res.firstErrorMessage === '') {
          // 如果没有配置默认图 就用第一张图
          res.result.forEach((item) => {
            if (!item.storeBackgroundPictureUrl) {
              item.storeBackgroundPictureUrl = 'https://cdn.xiniunet.com/img/store/bg1.png';
            }
          });
          this.topList = this.topList.concat(res.result);
          // 判断数据是否全部加载完
          if (res.result.length < this.pageSize) {
            this.isEnd = true;
            this.canDropDown = false;
          } else {
            this.canDropDown = true;
            this.pageNumber++;
          }
          this.isLoading = false;
        }
      },
      /**
       * 获取微分销会员信息
       * @returns {Promise.<void>}
       */
      async fetchWFXMember() {
        let res = await fetchWFXMember({
          id: this.userInfo.memberId,
          passportId: this.userInfo.id
        }, {isLoading: this.pageNumber === 1});
        if (res.firstErrorMessage === '') {
          this.data = res.wfxMember;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      if (!this.userInfo) {
        this.$bridge.link.goLogin();
      } else {
        this.fetchWFXMember();
        this.fetchTopStore();
        this.fetchWFXOperationSetting();
      }
      this.wxInfo = this.$bridge.storage.get('wxInfo');
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .container
    .notification-wrapper
      width: 345px;
      margin: 0 auto;
      height: 36px
      background: #FDFCEC;
      display: flex;
      align-items: center
      img
        margin-left: 15px
        width: 15px
        height: 16px
      text
        margin-left: 10px
        font-size: 14px;
        color: #F86E21;

  .banner
    position: relative
    width: 345px;
    margin: 0 auto;
    margin-top: 15px;
    height: rpx(297);
    border-radius: rpx(10);
    .bg-index
      width: 100%;
      height: 100%;
      border-radius: rpx(10);
    .content-wrapper
      position: absolute
      width: 250px;
      height: 100px;
      top: 25px;
      left: 45px
      display: flex;
      align-items: center;
      .head-img
        display: inline-block;
        width: rpx(120);
        height: rpx(120);
        border-radius: 50%;
      .name
        margin-left: 15px
        font-size: 18px
        color: #333
      .desc
        margin-left: 15px
        margin-top: 5px
        width: 82px
        height: 30px
        line-height: 30px
        border-radius: 50px;
        background: #F8ABAE;
        box-shadow: 0 rpx(1) rpx(4) 0 rgba(0, 0, 0, 0.16);
        font-size: 13px;
        color: #FFFFFF;
        text-align: center
        &.opened
          width: 95px
      .share
        margin-top: 5px
        margin-left: 10px
        width: 30px
        height: 30px
        background: #F8ABAE;
        box-shadow: 0 rpx(1) rpx(4) 0 rgba(0, 0, 0, 0.16);
        border-radius: 50%;

  .activity
    width: 345px;
    margin: 0 auto;
    margin-top: 13px;
    display: flex;
    align-items: center;
    height: 40px;
    font-size: 14px;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAroAAABYCAMAAAAtMKSLAAABCFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAwMAAAAAAAD5tLf//f35sbT3wsTswcOrmJiMgYFjXV3zxMbburv6uLv5vL750tP7+vp9bW1NR0fy8vLnwcHTsbTqwsO6oaH9/f3yxMbvycro6Ojb29vV1dX6uLr+/v76vsD3wMP40ND2ztD4+PjGpKf+/v7709T9/f3z8/P81tf95uf84+X12dno0dL39/f////4q67819j95uf92tv81tf+6en92dr929z+5+j829z93d7+6+z+6On+6uv+6+v95+j70NH7zs/+5eb70tP7zc7/9/f93t/+4OH/8/P+7+//+/v/8fH+7e3+4uP+5OWcb0BSAAAAOHRSTlMDAAkRAQYMCg8NDvv+/tONLSEZtFr38OPXHhWadkp/NOKrmndbUPjy6NzXyMND7ezlpfDs3bd3t3GR+5IAAAcsSURBVHja7N1pU9pAHMfxNJbNUYqAWO+jtvbw6H1QwcgtiCK37/+ddNkk/hsSYjXUJNPft5kmhBkffWZnySk9ubOndhJC/7hbbHe7vIMuyKJQIr4PomuzTfBkhB6pBM/m+yC6ptuJWoUxXVcXEHqEVF1nTJFNvn54JT+4gq2m7mwvpV4sP3v+ax7l0X9UveDV6ew+rhwc7m1uZVRN8PXDK/nCZfraYmrZVge66J6VPemenN7VycFeLqszX7zSbLiKpm6+nwy1oIseWMGzs9O/6cvLLVVTXHj96Npw114+49RAFz28etlRwRyFK3xYPT3hi7dZ+m5lc93GewddGnJlllkScEEXBahR4FqJrbV9bfLk8RVte33+uJ1lMg28fnQtuOqiBRd0UYD65XKz3OSLIGtvj0/u0UpOtfDOpktyta13tjTQRQEaOsjednKvvqc1L7uSW66iL9KPM9BFAep40y3ez+6XnK647UouuSyb+kWBLgpQsn5buU6Euyf3bG+duexKLrnpF39KA10UpJogy+MrIly4NXl2cibiG87oe/HdYcZlV3LKldnxG4c00EVB6hl1o+7uWngVZImv7/a3NJOddqUpubmpIwugi4KU5HINwddei9oOntRswp1PO1N2Jeds4XhaLuiiQPUNz6oW0+JZkS+0PqP9PPruJp//lKY5g5OumOe6ZgugiwI1MDwrF4kmRWR5RJr/G/A/tSrmu0SXBt2EknX/QgNdFKyh4Vm3eJ9q4k8drSsJGnYlkiurKbc00EXBSjYMr+pVYbJULPGlSLn38c1x3mxDlW27RFeSZG3RQxroooB1yGvDaPDFXJdtomJtVylV+OLcX6wO8lavNVmSiK416LItr3NooIuC1muYCbZEuF2qENdihUZb/oHvEvtFpU7e7m2aiWGX6Irpgud1C6CLAte32AqyVFvAJKZE2bFd6uWpn2LKQHTFoOs9XQBdFLz+ecOrNlGdJkz7qhO51Gsx7BJdKaFkvI/ogi6ai93zBufL/3NUtqi65rrUdSfvaDerWMOuZA262pK3NNBF86h37pnRLVWrlWqFL7QuVWnUHQ/yU73SrGFXsgbdtRmDLuiiudSpcam18xpfaM0bl7hUk2uVGIv4x1He1ad1a9iVrEH35QxpoIvmU3JY88zoVmdVHuRd0bArWYcXZg26oIvm1cAT73DQqV8LqdfVa75Ure2u0cl7tisOMth02eYsaaCL5ley03e67XeSYv/wpmvTFevuzVB84dk+s+jy+YKsv58lDXTRnPX2hv1RrTbqD3vcLe3v9Y2bcbfbHd8Y/Z6HW+qzLk9mDJL5I23miTTQRVHrrTg+xun6n44AXRS5XrNbulpqpjTQRZFrQxN0J9eMqcszpYEuilyrqixxuJOp7s5saaCLoldGSZh02fZsaaCLotc+s+n6XL8Auih6vbLp6j6/0kAXRa8N3aQr6z53U4Iuil5Huizo+h5gAF0UvVZVi+6Cz7U3oIui1+6CTdfnNDDoouj1QdCVOF0faaCLoleS05VAF8UvQRcTBhS/PizgZxqKZbsLODiGYtmqKuOUBIpjR7qME8Eojm3ouPwGxbJXDBc9oli2zxK41BzFMXGpOW7wQbHLvMEHt1Wi2LWh4WZ2FMsmN7PjESIofpmPEMGDm1DsMh/chMfloTg06I3q7XbbGPUG5qExPKQUxaFOrW13026sioeU4tHQKPINbLiFdoEv7R/i0dB4ID+Kep2Cs6/igfx4DQqKer3CVOagi5dPoYjXaRacfRNHxvDKPxTxBpZcKide+YcXraKIN/pTbbPQbH4XhxfwemsU8TrNqb66Xm/Nh11J1rymDKCLwmtkkx1XTltXV1etnCZL5qBLdMWUIeWWBrootJL1erPO4XYvr8z2xHThli7ZVbIvXNJAF4VWr9nkdm9suBeH64qQS3TtKUOCpd9MSwNdFFr9Oq97YXeQYQkxXZimK+weTx/dBV0UWiPDMKq3clfSQq6DLtmVWW7KLuii0GoYRrdlum1drOwwmeQSXbJ77JwzgC4KLcMoXLZarYsWp3uQJrlE1zlnSDt+q4EuCq3zxmnL6jBDswWiO203m/pFgS4KrdHYlru3TnKJrsuuoi/SeTXQRaHVP7lsTWYMH3O6QnKJrtuurG29s6WBLgqt4aVoKa3JJNeTLtll6qJ1pAF0UWgZl7yVnMpIrgddsmvhzSwJvKCLQqvL4W5nTbgk15suDbwJRVt7yfGCLgqt4srmuqYkaMidRZfs2njVzffPQReF09vPW6oFl+T60yW8MtPXFlPLoIseu9WN11mdyQTXk64vXoVp6s72UurF8rPnoIv+cckPu6tHG6/2M6rGFILrT9cbr5QQfJmuqwsIPUKqrjPBNiERXB+63nh5Ei/BkxF6pBI8SbgluPegS3o5X4Qeuafk9kF0iS8I/94ooAuAJzbC6RIAiyqK9Tu3lu0AAAAASUVORK5CYII=');
    background-size: 100% 100%;
    .name
      width: 56px
      text-align: center
      color: #FFF;
    .content
      width: 275px;
      margin-left: 10px;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;

  .list
    width: 345px;
    margin: 0 auto;
    margin-top: 6px
    .title
      display: flex
      align-items: center
      height: 25px
      line-height: 25px
      .icon
        display: inline-block
        height: 20px;
        line-height: 25px
        border-left: 3px solid #333;
        width: 5px;
      .name
        display: inline-block
        font-size: 18px;
        color: #333;
    ul
      width: 100%
      .item
        position: relative;
        width: 50%
        float: left;
        display: inline-block
        margin-top: 15px;
        overflow: hidden;
        .img
          width: 165px;
          height: 165px;
          overflow: hidden;
          background-repeat: no-repeat;
          background-position: top;
          background-size: cover;
          vertical-align: top;
        .name
          margin-top: 5px;
          font-size: 14px;
          color: #333;
        .zhishu
          font-size: 12px;
          color: #EA281A;

  /**
    弹框开始
   */
  .entry-distributor-name, .right-pop
    .modal-mask
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: #000;
      opacity: 0.5;
      overflow: hidden;
      z-index: 100;
      color: #fff;
    .modal-dialog
      width: 270px;
      overflow: hidden;
      position: fixed;
      top: 50%;
      left: 0;
      z-index: 101;
      background: #fff;
      margin: rpx(-180) rpx(105);
      border-radius: 7px;
    .show-btn
      margin-top: 50px;
      color: #22cc22;
    .modal-title
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #000;
      letter-spacing: 0;
      line-height: 18px;
      text-align: center;
      margin-top: 20px;
    .modal-footer
      display: flex;
      flex-direction: row;
      height: 50px;
      border-top: 1px solid #dedede;
      font-size: 18px;
      line-height: 50px;
    .btn-cancel
      width: 50%;
      color: #000;
      text-align: center;
      border-right: 1px solid #dedede;
    .btn-confirm
      width: 50%;
      color: #108EE9;
      text-align: center;

  .entry-distributor-name
    .modal-content
      padding: 25px 16px;
    .modal-input
      display: flex;
      background: #fff;
      font-size: 14px;
    .input
      width: 100%;
      height: 36px;
      font-size: 14px;
      line-height: 36px;
      padding: 0 10px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #dedede;
      color: #333;
    input-holder
      color: #666;
      font-size: 14px;

  .close
    position: absolute
    width: 16px;
    height: 16px;
    top: 15px;
    right: 15px;

  .right-pop
    .modal-title
      margin: 10px 0;
    .modal-content
      font-size: 15px;
      color: #888888;
    .image-wrapper
      text-align: center
      image
        margin: 0 auto
        margin-top: 10px
        width: 86px;
        height: 79px;
</style>
