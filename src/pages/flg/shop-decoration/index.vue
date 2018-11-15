<template>
  <div class="container" :style="{backgroundImage:'url('+bg+')'}">
    <div class="header">
      <div>
        <div class="name-wrapper">
          <div class="name">{{data.storeName}}</div>
        </div>
        <div class="popularity-index">
          <text class="title">网红指数</text>
          <text class="val">{{data.popularityIndex}}</text>
        </div>
      </div>
      <div class="operation">
        <div class="like" @tap="likeBtn()" v-if="!isLiked">
          <img :src="like"/>
          <div class="text">点赞</div>
        </div>
        <div class="share">
          <img :src="share"/>
          <div class="text">分享</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="index" @tap="goIndex">首页</div>
      <div class="decoration" @tap="showImgList()">装修</div>
      <div class="menu" @tap="goProductList">菜单</div>
    </div>
    <div class="img-list" v-if="isShowImgList">
      <div class="btn-list">
        <div class="cancel" @tap="cancel()">取消</div>
        <div class="confirm" @tap="confirm()">完成</div>
      </div>
      <scroll-view scroll-x="true" width="100%">
        <ul>
          <li v-for="(item,index) in imgList" :key="index" class="item" @tap="onChange(item,index)">
            <img :src="item.image"/>
          </li>
        </ul>
      </scroll-view>
    </div>

  </div>
</template>

<script>
  import {fetchWFXMember, like} from 'api/index';

  /**
   * 芳聊馆--店铺装修
   */
  export default {
    data() {
      return {
        like: require('public/images/flg/shop-decoration/like.png'),
        share: require('public/images/flg/shop-decoration/share.png'),
        bg: '',
        temporaryBg: '',
        index: -1,
        userInfo: {},
        data: {},
        isShowImgList: false,
        isLiked: false,
        imgList: [
          {image: require('public/images/flg/1.png'), index: 0},
          {image: require('public/images/flg/2.jpg'), index: 1}
        ]
      };
    },
    components: {},
    computed: {},
    methods: {
      async likeBtn() {
        let params = {
          passportId: this.userInfo.id,
          storeId: this.data.storeId,
          sourceMemberId: this.userInfo.memberId,
          sourceMemberName: this.userInfo.userName
        };
        let res = await like(params);
        if (res.firstErrorMessage === '' && res.result) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000
          });
          this.isLiked = true;
        } else {
          if (res.firstErrorMessage === '您今天已为该店铺点过赞啦') {
            this.isLiked = true;
          }
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      confirm() {
        this.$bridge.storage.save('shopDecoration' + this.userInfo.id, this.index);
        this.isShowImgList = false;
      },
      onChange(item, index) {
        this.bg = item.image;
        this.index = index;
      },
      async fetchWFXMember() {
        let res = await fetchWFXMember({id: this.userInfo.memberId, passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          this.data = res.wfxMember;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      goIndex() {
        this.$bridge.link.goIndex();
      },
      cancel() {
        this.bg = this.temporaryBg;
        this.isShowImgList = false;
      },
      showImgList() {
        this.temporaryBg = this.bg;
        this.isShowImgList = true;
      },
      goProductList() {
        this.$bridge.link.navigateTo('/pages/flg/product-list/main');
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      console.log(this.userInfo);
      this.index = this.$bridge.storage.get('shopDecoration' + this.userInfo.id) || 0;
      this.bg = this.imgList[this.index].image;
      this.fetchWFXMember();
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .container
    position: relative;
    width: 100%
    height: 100%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    vertical-align: top;
    .header
      display: flex;
      justify-content: space-between

  .name-wrapper
    margin: 0 auto;
    margin-top: 10px
    margin-left: 15px
    font-size: 12px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    background: #fff;
    padding: 0 8px;
    border-radius: 6px;
    box-shadow: 0 0 0 6px rgba(255, 206, 231, .79);
    .name
      border-radius: 6px;
      padding: 0 8px;
      background: #FFFFFF;

  .popularity-index
    display: flex;
    justify-content: space-between;
    margin-top: 6px
    margin-left: 15px
    width: 154px
    height 35px
    line-height: 35px
    background: rgba(0, 0, 0, 0.08);
    .title
      margin-left: 8px
      font-size: 12px;
      font-weight: 500
      color: #FFF;
    .val
      margin-right: 8px
      font-size: 12px;
      color: #F7676D;
      font-weight: 500

  .operation
    margin-top: 12px
    height: 38px
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px 0 0 4px;
    font-size: 10px;
    color: #FFFFFF;
    display: flex
    align-items: center
    .share, .like
      display: inline-block
      width: 50px;
      text-align: center
    img
      margin-top: 3px
      width: 17px
      height: 17px
    .text
      height: 14px;
      margin-top: -3px;

  .index, .decoration
    position: fixed
    bottom: 20px
    width: 44px
    height: 44px
    text-align: center
    line-height: 44px
    border-radius: 50%
    font-size: 14px;
    color: #FFFFFF;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.12);

  .index
    left: 20px
    background: #FCB94B;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.20);

  .decoration
    left: 88px
    background: #8FB92B;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.20);

  .menu
    position: fixed
    bottom: 10px
    right: 20px
    width: 60px
    height: 60px
    line-height: 60px
    border-radius: 50%
    text-align: center
    background: #3DB6E5;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.20);
    font-size: 18px;
    color: #FFFFFF;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.20);

  .img-list
    width: 100%
    height: 157px
    position: fixed
    bottom: 0
    background: #FFFFFF;
    box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.20);
    .btn-list
      margin: 0 auto
      width: 100%
      border-bottom: 1px solid #ccc;
      height: 45px
      line-height: 45px
      display: flex
      justify-content: space-between
      .cancel, .confirm
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #8B8B8D;
      .cancel
        margin-left: 20px
        color: #8B8B8D;
      .confirm
        margin-right: 20px
        color: #108EE9;
    ul
      margin: 0 auto
      display: flex
      flex-direction: row
      .item
        flex-shrink: 0
        width: 75px
        height: 80px
        margin: 15px
        img
          width: 100%
          height: 100%
</style>
