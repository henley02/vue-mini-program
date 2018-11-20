<template>
  <div class="container" :style="{backgroundImage:'url('+bg+')'}">
    <div class="header">
      <div>
        <div class="name-wrapper" @tap="showPopularityListPop">
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
        <div class="share" @tap="shareBtn()">
          <img :src="share"/>
          <div class="text">分享</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="index" @tap="goIndex">首页</div>
      <div class="decoration" @tap="showImgList()">装修</div>
      <div class="menu" @tap="goProductList">产品单</div>
    </div>
    <div class="img-list" v-if="isShowImgList">
      <div class="btn-list">
        <div class="cancel" @tap="cancel()">取消</div>
        <div class="confirm" @tap="confirm()">完成</div>
      </div>
      <scroll-view scroll-x="true" style="width: 100%; overflow-x: auto;">
        <ul>
          <li v-for="(item,index) in imgList" :key="index" class="item" @tap="onChange(item)">
            <div :style="{backgroundImage:'url('+item.imageUrl+')'}" class="img"></div>
          </li>
        </ul>
      </scroll-view>
    </div>
    <div class="popularity-list-pop" v-if="isShowPopularityListPop">
      <div class="modal-mask" @tap="hideModal" @touchmove="preventTouchMove"></div>
      <div v-if="popularityList.length>0" class="modal-dialog">
        <image :src="closeImg" class="close" @tap="hideModal"/>
        <div class="top">
          <image :src="popularityList[0].sourceMemberAvatarUrl" class="top-image"/>
          <div class="content">{{popularityList[0].sourceMemberName}}占领了网红指数贡献榜</div>
          <div class="tips">TIPS: 下单+20网红指数  点赞+1网红指数</div>
        </div>
        <div class="nav">
          <div class="left" :class="{'active':navType=='week'}" @tap="changePopularityTab('week')">周贡献榜</div>
          <div class="right" :class="{'active':navType=='total'}" @tap="changePopularityTab('total')">总贡献榜</div>
        </div>
        <scroll-view scroll-y="true" @scrolltolower="dropDown" class="list">
          <ul v-for="(item,index) in popularityList" :key="index">
            <li class="item">
              <div class="left">
                <div class="ranking">
                  <image v-if="index===0" :src="goldImg"/>
                  <image v-else-if="index===1" :src="silverImg"/>
                  <image v-else-if="index===2" :src="copperImg"/>
                  <div v-else="">{{index + 1}}</div>
                </div>
                <div class="head-img">
                  <image :src="item.sourceMemberAvatarUrl"/>
                </div>
                <div class="name">{{item.sourceMemberName}}</div>
              </div>
              <div class="exponent" :class="{'gold':index===0,'silver':index===1,'copper':index==2}">
                {{item.popularityBalance}}
              </div>
            </li>
          </ul>
        </scroll-view>
      </div>
      <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
      <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
      <div v-if="popularityList.length===0 && isEnd">
        <image :src='noDataImg'/>
        <div class='no-order-text'>暂无数据</div>
      </div>
    </div>
    <div v-if="isShowCanvas">
      <div class="share-mask"></div>
      <view class='canvas-box'>
        <canvas style="width:750rpx; height:940rpx;" canvas-id="shareCanvas"/>
        <div :src='imagePath'></div>
        <div class="btn-list">
          <div class="wx-friend">微信好友</div>
          <div class="save-img">保存图片</div>
        </div>
      </view>
    </div>
  </div>
</template>

<script>
  import {fetchWFXMember, like, fetchPopularityList, updateWFXStorePictureUrl} from 'api/index';

  /**
   * 芳聊馆--店铺装修
   */
  export default {
    data() {
      return {
        imagePath: '',
        isShowCanvas: false,
        closeImg: require('public/images/close.png'),
        like: require('public/images/flg/shop-decoration/like.png'),
        share: require('public/images/flg/shop-decoration/share.png'),
        goldImg: require('public/images/flg/shop-decoration/gold.png'),
        silverImg: require('public/images/flg/shop-decoration/silver.png'),
        copperImg: require('public/images/flg/shop-decoration/copper.png'),
        noDataImg: require('public/images/user/nocoupon.png'),
        bg: '',
        temporaryBg: '',
        index: -1,
        userInfo: {},
        data: {},
        isShowImgList: false,
        isLiked: false,
        popularityList: [], // 排行榜
        navType: 'week',
        isShowPopularityListPop: false, // 是否展示排行榜的弹框
        imgList: [
          {imageUrl: 'https://cdn.xiniunet.com/img/store/bg1.png'},
          {imageUrl: 'https://cdn.xiniunet.com/img/store/bg2.png'},
          {imageUrl: 'https://cdn.xiniunet.com/img/store/bg3.png'},
          {imageUrl: 'https://cdn.xiniunet.com/img/store/bg4.png'}
        ],
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        isEnd: false,
        canDropDown: true // 是否可以下拉加载
      };
    },
    components: {},
    computed: {},
    methods: {
      preventTouchMove() {
      },
      /**
       * 下拉加载
       */
      dropDown() {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        this.getList();
      },
      /**
       * 切换周、总榜
       */
      changePopularityTab(type) {
        this.navType = type;
        this.pageNumber = 1;
        this.isEnd = false;
        this.canDropDown = true;
        this.popularityList = [];
        this.getList();
      },
      /**
       * 隐藏榜单
       */
      hideModal() {
        this.isShowPopularityListPop = false;
      },
      /**
       * 展示榜单
       */
      showPopularityListPop() {
        this.isShowPopularityListPop = true;
      },
      /**
       * 获取榜单的数据
       * @returns {Promise.<void>}
       */
      async getList() {
        let params = {
          storeId: this.data.storeId,
          passportId: this.userInfo.id,
          memberId: this.userInfo.memberId,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        };
        if (this.navType === 'week') {
          params.isWeek = true;
        } else {
          params.isWeek = false;
        }
        let res = await fetchPopularityList(params);
        this.popularityList = this.popularityList.concat(res.result);
        // 判断数据是否全部加载完
        if (this.popularityList.length >= res.totalAmount || res.result.length < this.pageSize) {
          this.isEnd = true;
          this.canDropDown = false;
        } else {
          this.canDropDown = true;
          this.pageNumber++;
        }
        this.isLoading = false;
      },
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
      /**
       * 背景列表选择框 -确定
       */
      async confirm() {
        this.$bridge.storage.save('shopDecoration' + this.userInfo.id, this.index);
        let res = await updateWFXStorePictureUrl({
          id: this.data.storeId,
          passportId: this.userInfo.id,
          storeBackgroundPictureUrl: this.bg,
          rowVersion: this.data.rowVersion
        });
        if (res.firstErrorMessage === '') {
          this.isShowImgList = false;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 背景列表选择框 - 选择某个背景图片
       */
      onChange(item) {
        this.bg = item.imageUrl;
      },
      /**
       * 获取微分销的信息
       */
      async fetchWFXMember() {
        let res = await fetchWFXMember({id: this.userInfo.memberId, passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          if (!res.wfxMember.storeBackgroundPictureUrl) {
            res.wfxMember.storeBackgroundPictureUrl = this.imgList[0].imageUrl;
          }
          this.data = res.wfxMember;
          this.bg = res.wfxMember.storeBackgroundPictureUrl;
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
      },
      shareBtn() {
        this.drawSharePic(this.bg, this.goldImg);
      },
      /**
       * 绘制分享的图片
       * @param goodsPicPath 商品图片的本地链接
       * @param qrCodePath 二维码的本地链接
       */
      drawSharePic(goodsPicPath, qrCodePath) {
        wx.showLoading({
          title: '正在生成图片...',
          mask: true
        });
        // y方向的偏移量，因为是从上往下绘制的，所以y一直向下偏移，不断增大。
        let yOffset = 20;
        const goodsTitle = '因为是从上往下绘制的，所以y一直向下偏移，不断增大';
        let goodsTitleArray = [];
        // 为了防止标题过长，分割字符串,每行18个
        for (let i = 0; i < goodsTitle.length / 18; i++) {
          if (i > 2) {
            break;
          }
          goodsTitleArray.push(goodsTitle.substr(i * 18, 18));
        }
        const price = '500';
        const marketPrice = '100';
        const title1 = '您的好友邀请您一起分享精品好货';
        const title2 = '立即打开看看吧';
        const codeText = '长按识别小程序码查看详情';

        const canvasCtx = wx.createCanvasContext('shareCanvas');
        // 绘制背景
        canvasCtx.setFillStyle('white');
        canvasCtx.fillRect(0, 0, 390, 800);
        // 绘制分享的标题文字
        canvasCtx.setFontSize(24);
        canvasCtx.setFillStyle('#333333');
        canvasCtx.setTextAlign('center');
        canvasCtx.fillText(title1, 195, 40);
        // 绘制分享的第二行标题文字
        canvasCtx.fillText(title2, 195, 70);
        // 绘制商品图片
        canvasCtx.drawImage(goodsPicPath, 0, 90, 390, 390);
        // 绘制商品标题
        yOffset = 490;
        goodsTitleArray.forEach(function (value) {
          canvasCtx.setFontSize(20);
          canvasCtx.setFillStyle('#333333');
          canvasCtx.setTextAlign('left');
          canvasCtx.fillText(value, 20, yOffset);
          yOffset += 25;
        });
        // 绘制价格
        yOffset += 8;
        canvasCtx.setFontSize(20);
        canvasCtx.setFillStyle('#f9555c');
        canvasCtx.setTextAlign('left');
        canvasCtx.fillText('￥', 20, yOffset);
        canvasCtx.setFontSize(30);
        canvasCtx.setFillStyle('#f9555c');
        canvasCtx.setTextAlign('left');
        canvasCtx.fillText(price, 40, yOffset);
        // 绘制原价
        const xOffset = (price.length / 2 + 1) * 24 + 50;
        canvasCtx.setFontSize(20);
        canvasCtx.setFillStyle('#999999');
        canvasCtx.setTextAlign('left');
        canvasCtx.fillText('原价:¥' + marketPrice, xOffset, yOffset);
        // 绘制原价的删除线
        canvasCtx.setLineWidth(1);
        canvasCtx.moveTo(xOffset, yOffset - 6);
        canvasCtx.lineTo(xOffset + (3 + marketPrice.toString().length / 2) * 20, yOffset - 6);
        canvasCtx.setStrokeStyle('#999999');
        canvasCtx.stroke();
        // 绘制最底部文字
        canvasCtx.setFontSize(18);
        canvasCtx.setFillStyle('#333333');
        canvasCtx.setTextAlign('center');
        canvasCtx.fillText(codeText, 195, 780);
        // 绘制二维码
        canvasCtx.drawImage(qrCodePath, 95, 550, 200, 200);
        canvasCtx.draw();
        // 绘制之后加一个延时去生成图片，如果直接生成可能没有绘制完成，导出图片会有问题。
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 390,
            height: 800,
            destWidth: 390,
            destHeight: 800,
            canvasId: 'shareCanvas',
            success: (res) => {
              this.shareImage = res.tempFilePath;
              this.showSharePic = true;
              wx.hideLoading();
            },
            fail: (res) => {
              wx.hideLoading();
            }
          });
        }, 2000);
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
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
      /*店名*/
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

      /*网红指数*/
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

      /*点赞、分享的按钮样式*/
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

  /*底部按钮首页、装修、菜单的样式*/
  .bottom
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
      background-repeat: no-repeat
      background-size: 100% 100%
    .index
      left: 20px
      background-image: url("data:image/png;base64,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");
    .decoration
      left: 88px
      background-image: url("data:image/png;base64,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");
    .menu
      position: fixed
      bottom: 10px
      right: 20px
      width: 60px
      height: 60px
      line-height: 60px
      border-radius: 50%
      text-align: center
      font-size: 18px;
      color: #FFFFFF;
      background-image: url('data:image/png;base64,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')
      background-size: 100% 100%
      background-repeat: no-repeat

  /*榜单的弹框*/
  .popularity-list-pop
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
      z-index: 101
      position: absolute
      bottom: 0
      left 0
      width: 100%
      height: 385px
      background: #fff
      border-radius: 8px 8px 0 0;
      .close
        position: absolute
        width: 16px;
        height: 16px;
        top: 15px;
        right: 15px;
      .top
        position: relative
        text-align: center;
        border-bottom: 1px solid #DDDDDD
        .top-image
          position: absolute
          top: -79px;
          margin-left: -40px;
          width: 79px;
          height: 79px
          border-radius: 50%
        .content
          margin-top: 52px
          font-size: 17px;
          color: #000;
        .tips
          margin-top: 5px;
          font-size: 12px;
          color: #888;
          margin-bottom: 15px
      .nav
        margin: 0 auto
        margin-top: 15px
        margin-bottom: 15px
        display: flex;
        flex-direction: row
        width: 164px
        height: 30px
        line-height: 30px
        .left
          border-radius: 10px 0 0 10px;
          border: 1px solid #FC9776;
          border-right: none
        .right
          border-radius: 0 10px 10px 0;
          border: 1px solid #FC9776;
          border-left: none
        .left, .right
          width: 50%
          text-align: center
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #EA281A;
          &.active
            color: #FFFFFF;
            background-image: linear-gradient(-90deg, #FC9978 0%, #EE3320 100%);
      .list
        height: 218px
        .item
          width: 100%
          height: 63px
          line-height: 63px
          display: flex
          justify-content: space-between
          align-items: center
          .left
            display: flex
            flex-direction: row
            align-items: center
            justify-content: center
            .ranking
              width: 40px;
              height: 40px;
              line-height: 40px
              margin: 0 15px;
              text-align: center
              image
                width: 100%
                height: 100%
            .head-img
              width: 43px
              height: 43px
              image
                width: 100%
                height: 100%
                border-radius: 50%
            .name
              margin: 0 15px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #6C553D;
          .exponent
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #8B8B8D;
            margin-right: 15px
          .gold
            font-family: AxureHandwriting;
            font-size: 21px;
            color: #FFD31A;
          .silver
            font-family: AxureHandwriting;
            font-size: 21px;
            color: #A4B8C4;
          .copper
            font-family: AxureHandwriting;
            font-size: 21px;
            color: #DF9548;

  /*背景列表的选择弹框*/
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
      width: 100%;
      font-size: 0;
      word-break: keep-all;
      white-space: nowrap;
      overflow-x: auto;
      .item
        width: 75px
        height: 80px
        margin: 15px
        display: inline-block;
        .img
          width: 100%
          height: 100%
          overflow: hidden;
          background-repeat: no-repeat;
          background-position: top;
          background-size: cover;
          vertical-align: top;

  .share-mask
    position: fixed;
    top: 0;
    left: 0
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.40);
    .canvas-box
      position: fixed;
      top: 999999 rpx;
      left: 0
    .btn-list
      width: 100%;
      height: 130px
      background: #FFFFFF;

</style>
