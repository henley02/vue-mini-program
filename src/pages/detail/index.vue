<template>
  <div class="container">
    <div class="navbar">
      <text v-for="(item,index) in navbar" :key="index" :class="{'active':currentTab==index}" class="item"
            bindtap="navbarTap">{{item}}
      </text>
    </div>
    <scroll-div scroll-y="true" class="s-container">
      <!-- 商品 -->
      <div v-if="currentTab==0">
        <div class='m-picture-number'>
          <text>{{sliderIndex}} / {{pictureList.length}}</text>
        </div>
        <div class="m-banner-ad">
          <swiper autoplay="false" interval="3000" duration="300" current="0" @change='changeSlider'>
            <swiper-item v-for="(item,index) in pictureList" :key="index">
              <image class="slide-image" :src="item.url"/>
            </swiper-item>
          </swiper>
        </div>
        <div class="m-cells">
          <div class="m-info-box">
            <div>
              <div class='p-info'>{{commodity.name}}</div>
              <div class='p-info-price'>
                <div class='p-price-text'>
                  <div class="m-info-price">￥
                    <text>{{Salespromotion ? Salespromotion : showPriceone}}</text>
                  </div>
                  <div class='p-info-text' v-if="Salespromotion < showPriceone || showPrice < showPriceone">促销价</div>
                </div>
                <div class="m-info-delprice">价格
                  <text>￥{{showPriceone}}</text>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="m-panel-ft" bindtap='ckselectsp2'>
          <navigator class="m-cell m-cell-access m-cell-links">
            <div class="m-cell-bd">
              <div class='p-cell-content'>规格</div>
              <text class='m-cell-content'>{{spec1ValueName}} {{spec2ValueName}} {{spec3ValueName}}</text>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
        <div class="m-panel-ft">
          <navigator class="m-cell m-cell-access m-cell-links" bindtap='coupon'>
            <div class="m-cell-bd">
              <div class='p-cell-content'>优惠券</div>
              <text> {{textIndex}}张可领取</text>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
        <div class="m-panel-ft" style='margin-bottom:20rpx'>
          <navigator url="../addresslist/addresslist" class="m-cell m-cell-access m-cell-links">
            <div class="m-cell-bd">
              <div class='p-cell-content'>送至</div>
              <text class='m-cell-content' v-if="address!=null&& address != 'undefined'">{{address}}</text>
            </div>
            <text class="m-cell-ft"></text>
          </navigator>
        </div>
        <div class="m-panel-ft">
          <div class="m-cell-access">
            <div class="m-cell-bd" v-if="commodityEvaluationNumberpice.evaluationNumber!==0">
              <div class='p-cell-evaluate'>评价({{commodityEvaluationNumberpice.evaluationNumber}})</div>
              <text class='p-evaluate-bd' bindtap='Lookatall'>查看全部</text>
              <text class="m-cell-ft"></text>

            </div>
            <div class="m-cell m-cell-access m-cell-links" v-if="commodityEvaluationNumberpice.evaluationNumber==0">
              <div class="m-cell-content">暂无评价</div>
            </div>
          </div>
        </div>
        <div class='p-panel' bindtap='ClickelseInfo'>查看全部图文详情</div>
      </div>
      <!-- 详情 -->
      <div v-if="currentTab==1">
        <div class="p-tab">
          <div class='p-show'></div>
          <div class="m-navbar">
            <div class="m-navbar-item" :class="{'m-navbar-item-on':tapindex==1}" bindtap="picDetail">
              商品介绍
            </div>
            <div class='p-navbar'></div>
            <div class="m-navbar-item" :class="{'m-navbar-item-on': tapindex==2}" bindtap="spcParam">
              规格参数
            </div>
          </div>
          <div :class="{'hide':tapindex!=1}">
            <rich-text :nodes="Therichtext"></rich-text>
          </div>
          <div class="g-flex-fott" :class="{'hide':tapindex != 2}">
            <div class="table">
              <block v-for="(item,index) in ProductInfo.commonAttrLis" :key="index">
                <div class="tr bg-g">
                  <div class="td">{{item.attributeName}}</div>
                  <div class="r-td">{{item.valueName}}</div>
                </div>
              </block>
            </div>
          </div>
          <div class='show'></div>
        </div>
      </div>
    </scroll-div>
    <!-- 优惠券 -->
    <div class="m-panel-sp" v-if="conponflag" style='z-index:999;'>
      <div class="m-panel-sp-content">
        <!-- <icon type="cancel" class="m-panel-sp-icon" color="#888" catchtap="closesp" /> -->
        <div class="m-panel-sp-listbox-item">
          <div class="m-cells-title">领取优惠券</div>
        </div>
        <div v-if="textIndex<=0">
          <image src='../../img/nocoupon.png' class='shoppingcart'></image>
          <div class='text'>无可用优惠券</div>
        </div>
        <scroll-div class="m-panel-sp-listbox" scroll-y="true">
          <block v-for="(item,index) in couponDefinition" :key="index">
            <block>
              <div class='y-cell'>
                <div class='y-img'>
                  <image src='../../img/couponquan.png'></image>
                  <div class='y-con' bindtap="onReceiveCouponTap">领取</div>
                  <div class='y-juan'>
                    <div>{{items.name}}</div>
                    <div>有效期至：{{filter.formatDay(items.endGetTime)}}</div>
                  </div>
                </div>
                <!-- <div class='p-line'></div> -->
              </div>
            </block>
          </block>
          <div style="height:96rpx;width:100%;"></div>
        </scroll-div>
        <div class="m-m-panel-sp-btn">
          <div class="m-m-panel-sp-rbtn" @tap="closesp">关闭</div>
        </div>
      </div>
    </div>
    <!-- 评价 -->
    <div v-if="currentTab==2">
      <div class='e-cell'>
        <div class='e-btn'>
          <div :class="{'e-btn-a':allindex==1,'e-btn-b':allindex!=1}" bindtap='all' style='margin-right:20rpx'>全部 {{evaluationNumber}}</div>
          <div :class="{'e-btn-a':allindex==2,'e-btn-b':allindex!=2}" bindtap='withpicture'>有图 {{pictureEvaluationNumber}}</div>
        </div>
        <!-- 评价信息 -->
        <scroll-div scroll-y="true" class="m-panel-bd m-orderlist" bindscrolltolower="scrollPage">
          <block v-for="(item,index) in comments" :key="index">
            <div class="m-media-box m-media-box-appmsg" v-if="!comment.isHide">
              <div class="m-media-box-bd" v-if="!comment.isHide">
                <div class='p-media'>
                  <label class="m-media-box-title" v-if="comment.isAnonymous == false">{{comment.memberName}}</label>
                  <label class="m-media-box-title" v-else>***</label>
                  <div class="m-time">{{filter.formatDay(comment.evaluationTime)}}</div>
                </div>
                <div class="m-media-box-desc">
                  <div class="m-media-box-info" style='width:144rpx'>
                    <div class="m-media-box-info-meta m-start" v-for="(item ,i) in [1, 2, 3, 4, 5]" :key="i">
                      <label class="iconfont icon-start" :class="{'sel':itemIndex<=comment.score}"></label>
                    </div>
                  </div>
                  <div style='padding-top:25rpx;color:#000000;font-size:28rpx;'>{{comment.content}}</div>
                  <div v-if="comment.attachmentList" class="m-media-list">
                    <image bindtap="onShowBigImageTap" v-for="(item,i) in comment.attachmentList" :src="item.filePath"
                           :key="i"/>
                  </div>
                  <div style='color:#000000;font-size:28rpx;margin-top:300rpx' v-for='(item,i) in comment.replyList'
                       :key="i">
                    <text>{{item.replyUserName}}:</text>
                    <text style='color:#666666'>{{item.replyContent}}</text>
                  </div>
                </div>
              </div>
            </div>
          </block>
          <div class='show'></div>
        </scroll-div>
      </div>
    </div>

    <div class="m-footer-btn" v-if="!btnflag">
      <div class="m-footer-btn-list">
      </div>
      <div class="m-footer-btn-mains" bindtap="ckselectsp">
        立即购买
      </div>
      <div class="m-footer-btn-main m-now" bindtap="ckselectsp1">
        加入购物车
      </div>
    </div>
    <div class="m-footer-btn" v-else>
      <div class="m-m-panel-sp-btn">
        <div class="m-m-panel-sp-rbtn" @tap="buynow" v-if="tab==0">确定</div>
        <div class="m-m-panel-sp-rbtn" @tap="ckselectspbuynow" v-else>确定</div>
      </div>
    </div>

    <!--以下为toast显示的内容-->
    <div class="toast_content_box" v-if="isShowToast">
      <div class="toast_content">
        <image src='../../img/outofrange.png' class='toast_content_img'></image>
        <div class="toast_content_text">
          {{toastText}}
        </div>
      </div>
    </div>
    <!-- 筛选规格 -->
    <!--<div class="m-panel-sp" :class="{'hide':selectsp==0}" bindtap="closesp" v-if="!conponflag">
      <div class="m-panel-sp-content"
           :class="{'bounceOutDown animated':selectct==0,'bozunceInUp animated':selectct!=0}">
        <div class="m-panel-sp-pinfo">
          <div class="m-panel-sp-pimg">
            <image :src="commodity.pictureUrl"/>
          </div>
          <div class="m-panel-sp-pname">
            &lt;!&ndash; <div class='m-pprice'>¥{{showPrice}}</div> &ndash;&gt;
            <div class='m-pprice'>¥{{Salespromotion ? Salespromotion : showPrice}}</div>
            <div class="m-pstock" v-if="repertoryquantity>0">库存{{repertoryquantity}}件</div>
            <div class="m-pstock" v-else>库存0件</div>
            <div class="p-pstock">请选择</div>
          </div>
          <icon type="cancel" class="m-panel-sp-icon" color="#888" @tap="closesp"/>
        </div>
        <scroll-div class="m-panel-sp-listbox" scroll-y="true">
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">{{spec1AttrList[0].attributeName}} </div>
            <div class="m-panel-sp-labellist">
              <block v-for="(item,index) in spec1AttrList" :key="index">
                <label :class="{'m-panel-sp-sellabel':prduindex==i,'p-panel-sp':prduindex!=i}"
                       @tap="selectsp">{{item.valueName}}</label>
              </block>
            </div>
          </div>
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">{{ProductInfo.spec2AttrList[0].attributeName}} </div>
            <div class="m-panel-sp-labellist">
              <block v-for="(item,index) in ProductInfo.spec2AttrList" :key="index">
                <label :class="{'m-panel-sp-sellabel':spec2AttrList==i}"
                       @tap="spec2AttrList">{{item.valueName}}</label>
              </block>
            </div>
          </div>
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">{{ProductInfo.spec3AttrList[0].attributeName}} </div>
            <div class="m-panel-sp-labellist">
              <block v-for="(item,index) in ProductInfo.spec3AttrList" :key="index">
                <label :class="{'m-panel-sp-sellabel':spec3AttrList==i}"
                       @tap="spec3AttrList">{{item.valueName}}</label>
              </block>
            </div>
          </div>
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">数量
            </div>
            <div class="m-panel-sp-labellist">
              <div class="u-cart-num">
                <div class="u-num-btn" @tap="sub" :class="minusStatus">-</div>
                <input type="number" v-model="numval" bindblur="writenum"/>
                <div class="u-num-btn" @tap="add">+</div>
              </div>
            </div>
          </div>
          <div style="height:163rpx;width:100%;"></div>
        </scroll-div>
      </div>
    </div>-->
  </div>

</template>

<script>
  /**
   * 商品详情
   */
  import {fetchProductDetail, setLocation, fetchDefaultAddress, fetchCommoditySkuInfo} from 'api/index.js';

  export default {
    data() {
      return {
        userInfo: {},
        pictureList: [], // 轮播图
        sliderIndex: 1, // 轮播图的索引
        commodity: {},
        spec1AttrList: [],

        isShowToast: false,
        pictureEvaluationNumber: 0,
        evaluationNumber: 0,
        comments: [],
        numval: 1, // 购买数量
        minusStatus: 'disabled ', // 购买数量少于1时不能点击
        selectsp: 0,
        selectct: 0,
        flag: false,
        ProductInfo: [], // 商品信息
        itemid: 0,
        inventoryInfo: [],
        prduindex: 0,
        quantity: 0, // 库存数量
        spec2AttrList: 0,
        spec3AttrList: 0,
        attributeId: 0, //  类型id
        spec2AttrListId: 0, //  类型id
        spec3AttrListId: 0, // 类型id
        conponflag: false,
        spec1ValueName: '',
        spec2ValueName: '',
        spec3ValueName: '',
        list: [],
        commodityEvaluationNumberpice: [], // 获取评价的数量
        btn: 0, // 区别立即购买和加入购物车
        memberDefalutLocationInfo: [], // 会员地址
        commodityPartscount: 0, // 获取商品配件

        spec3AttributeId: '',
        itemId: '',
        navbar: ['商品', '详情', '评价'],
        currentTab: 0,
        btnflag: false,
        materialId: [],
        randId: '',
        selected: false,
        address: '', // 地址
        repertory: [], // 库存
        repertoryquantity: 0, // 库存数量
        isCollected: false,
        couponCount: 0,
        showpice: '',
        tapindex: 1,
        topNum: 0,
        originalprice: '', // 原价
        Salespromotion: '', //  促销价
        couponDefinition: [],
        textIndex: 0,
        allindex: 1,
        pagenumber: 1,
        pagesize: 10,
        flags: false,
        inputval: 0,
        showPriceone: 0,
        Therichtext: '',
        tab: 0
      };
    },
    components: {},
    computed: {},
    methods: {
      /**
       * 获取商品物料的优惠券
       */
      async inventory() {
        console.log(2);
        let params = {
          id: this.id,
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          systemType: 'B2C',
          deviceType: 'MOBILE'
        };
        if (this.userInfo) {
          params.passportId = this.userInfo.id;
          params.memberId = this.userInfo.memberId;
        }
        let res = await fetchCommoditySkuInfo(params);
        if (res.firstErrorMessage === '') {
          this.repertory = res.balanceList;
          this.repertoryquantity = res.balanceList[0].quantity;
          for (let x in res.itemOuList) {
            this.originalprice = parseFloat(res.itemOuList[0].unitPrice);
            this.Salespromotion = parseFloat(res.itemOuList[0].currentPrice);
            if (res.itemOuList[x].itemId === this.id) {
              this.couponDefinition = res.itemOuList[x].couponDefinitionList;
              for (let j in res.itemOuList[x].couponDefinitionList) {
                if (res.itemOuList[x].couponDefinitionList[j] !== '') {
                  this.textIndex++;
                }
              }
            }
          }
        }
      },
      /**
       * 滚动大图
       */
      changeSlider(e) {
        this.sliderIndex = e.target.current + 1;
      },
      /**
       * 获取商品详情
       */
      async init() {
        let params = {
          id: this.id,
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          systemType: 'B2C',
          deviceType: 'MOBILE'
        };
        if (this.userInfo) {
          params.passportId = this.userInfo.id;
        }
        let res = await fetchProductDetail(params);
        if (res.firstErrorMessage !== '') {
          this.$bridge.dialog.alert({
            content: res.firstErrorMessage,
            confirmCallback: () => {
              wx.navigateBack();
            }
          });
        } else {
          let {pictureList, commodity, spec1AttrList} = {...res};
          this.pictureList = pictureList;
          this.commodity = commodity;
          this.spec1AttrList = spec1AttrList;

          this.ProductInfo = res;
          this.showPrice = res.itemList[0].unitPrice;
          this.showPriceone = res.commodity.showPrice;
          let content = this.ProductInfo.commodityText.replace(/\\<img/gi, '<img class="rich-img" '); // 防止富文本图片过大
          this.Therichtext = content;
          if (this.spec1AttrList && this.spec1AttrList.length > 0) {
            this.spec1ValueName = res.spec1AttrList[0].valueName || '';
            this.attributeId = res.spec1AttrList[0].valueId || 0;
          } else {
            this.itemId = res.itemList[0].itemEbusiness.detailList[0].itemId;
          }
          if (res.spec2AttrList && res.spec2AttrList.length > 0) {
            this.spec2ValueName = res.spec2AttrList[0].valueName || '';
            this.spec2AttrListId = res.spec2AttrList[0].valueId || 0;
          }
          if (res.spec3AttrList && res.spec3AttrList.length > 0) {
            this.spec3ValueName = res.spec3AttrList[0].valueName;
            this.spec3AttrListId = res.spec3AttrList[0].valueId;
            this.spec3AttributeId = res.spec3AttrList[0].valueId;
          }
        }
      },
      /**
       * 获取会员默认地址(登录了)
       */
      async getMemberDefaultAddress() {
        let res = await fetchDefaultAddress({
          ip: '127.0.0.1',
          memberId: this.userInfo.memberId,
          passportId: this.userInfo.id
        });
        if (res.firstErrorMessage === '') {
          this.address = res.address;
          this.memberDefalutLocationInfo = res;
          this.address = res.location.provinceName + res.location.cityName + res.location.districtName;
        }
      },
      /**
       * 获取地理定位 (没有登录)
       */
      getLocation() {
        wx.getLocation({
          success: async (data) => {
            if (data.errMsg === 'getLocation:ok') {
              let params = {
                location: data.longitude + ',' + data.latitude
              };
              let res = await setLocation(params);
              if (res.firstErrorMessage === '') {
                this.address = res.address;
              }
            }
          }
        });
      }
    },
    onShow() {
      this.id = this.$root.$mp.query.id || '';
      this.init();
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.inventory();
      if (!this.userInfo) {
        this.getLocation();
      } else {
        this.getMemberDefaultAddress();
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244)
  }

  .m-orderlist {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 500px;
  }

  .s-container {
    margin-top: 48px;
  }

  .toast_mask {
    opacity: 0.5;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 888;
  }

  /*toast*/
  .toast_content_box {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 999;
    top: 10px;
  }

  .toast_content {
    width: 120px;
    background: #333333;
    border-radius: 8px;
    height: 93px;

  }

  .toast_content_img {
    width: rpx(53);
    height: rpx(51);
    padding: 20px 47px 5px;
  }

  .toast_content_text {
    height: 100%;
    width: 100%;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }

  .navbar {
    display: flex;
    background: #fff;
    justify-content: center;
    font-size: 15px;
    position: fixed;
    z-index: 11;
    width: 100%;
    padding-left: 13px;
  }

  .navbar .item {
    position: relative;
    text-align: center;
    line-height: 48px;
    margin-right: 23px;
  }

  .navbar .item.active:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 7px;
    right: 0;
    height: 4px;
    width: 19px;
    background: #ea281a;
    border-radius: 10px;
  }

  .p-pstock {
    font-size: 12px;
    margin-top: 3px;
  }

  .active {
    font-size: 18px;
  }

  .m-banner-ad {
    width: rpx(750);
    height: rpx(750);
  }

  .m-banner-ad swiper {
    width: 100%;
    height: 100%;
  }

  .slide-image {
    width: 100%;
    height: 100%;
  }

  .m-cells {
    height: rpx(175);
    width: 100%;
    padding: rpx(25) 0 rpx(25) rpx(30);
    background: #fff;
    margin-bottom: rpx(20);
  }

  .p-cell-content {
    width: 70px;
  }

  .m-cell-bd {
    font-size: 14px;
    color: #666666;
    text-align: left;
    display: flex;
  }

  .p-cell-evaluate {
    height: 39px;
    padding-left: 13px;
    line-height: 39px;
  }

  .p-evaluate-bd {
    margin-left: rpx(460);
    line-height: rpx(78);

  }

  .p-info {
    font-family: PingFangSC-Regular;
    font-size: rpx(30);
    color: #000;
    line-height: rpx(0);
    min-height: 30px;
    text-align: left;
  }

  .m-info-box label {
    color: #EA281A;
    display: block;
    font-size: rpx(28);
  }

  .m-footer-btn {
    border-top: rpx(1) solid #dddddd;
  }

  .m-footer-btn-list {
    width: 40%;
  }

  .m-footer-btn-mains {
    font-size: rpx(28);
    width: rpx(224);
    border-left: rpx(1) solid #dddddd;
  }

  .m-footer-btn-main {
    font-size: rpx(28);
    width: rpx(225);
  }

  .m-footer-btn-icon {
    top: rpx(8);
  }

  .p-price-text {
    display: flex;
  }

  .p-info-text {
    width: rpx(66);
    height: rpx(22);
    line-height: rpx(22);
    text-align: center;
    font-size: rpx(20);
    color: #ea281a;
    border: rpx(1) solid #EA281A;
    border-radius: rpx(4);
    margin: 14px 0 0 10px;

  }

  .m-info-price {
    color: #EA281A;
    font-size: rpx(32);
  }

  .m-info-price text {
    font-size: rpx(48);
    font-weight: bold;
  }

  .m-info-delprice {
    font-size: rpx(24);
    color: #999999;
    padding-left: rpx(6);

  }

  .m-info-delprice text {
    text-decoration: line-through;
    font-size: rpx(24);

  }

  .m-panel-ft {
    background: #fff;
  }

  .m-cell::before {
    border-top: 0 solid #d9d9d9;
  }

  .m-cell-content {
    color: #000000;
    text-align: left;
  }

  .m-cell-ft {
    padding-top: rpx(8);
  }

  .p-show {
    width: 100%;
    height: rpx(2);
  }

  .p-tab {
    width: 100%;
    z-index: 6;

  }

  .m-navbar {
    position: relative;
  }

  .p-navbar {
    position: relative;
    top: rpx(33);
    border-left: rpx(1) solid #DDDDDD;
    height: rpx(28);
  }

  .m-navbar-item {
    font-size: rpx(28);
  }

  .m-navbar-item:after {
    border: none;
  }

  .m-navbar-item.m-navbar-item-on {
    background-color: #fff;
    color: #EA281A;
  }

  .m-navbar-item.m-navbar-item-on::before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: rpx(6);
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .m-detail {
    min-height: rpx(500);
  }

  /*Panel start*/

  .m-panel {
    background-color: #fff;
    margin-top: rpx(20);
    position: relative;
    overflow: hidden;
  }

  .m-panel:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .m-panel:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .m-panel-hd {
    padding: 14px 15px 10px;
    color: #999;
    font-size: 13px;
    position: relative;
  }

  .m-panel-hd:after {
    content: " ";
    position: absolute;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }

  /*选择规格遮罩 start*/

  .m-panel-sp {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 12;
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
    display: flex;
  }

  .m-panel-sp-pimg {
    width: rpx(178);
    height: rpx(178);
    border-radius: rpx(8);
    padding: rpx(30);
    float: left;
  }

  .m-panel-sp-pimg image {
    width: 100%;
    height: 100%;
    border: rpx(1) solid #EEEEEE;
  }

  .m-panel-sp-pname {
    margin-top: rpx(40);

  }

  .m-panel-sp-pname .m-pprice {
    color: #EA281A;
    font-size: rpx(32);
  }

  .m-panel-sp-icon {
    position: absolute;
    right: rpx(30);
    top: rpx(16);
  }

  .m-pstock {
    font-size: rpx(24);
    margin-top: rpx(36);
  }

  .p-pstock {
    font-size: rpx(24);
    color: #666666;
  }

  .m-panel-sp-listbox {
    height: rpx(604);
  }

  .m-panel-sp-listbox-item {
    box-sizing: border-box;
    padding: 0 rpx(20);
  }

  .m-panel-sp-listbox-item .m-cells-title {
    color: black;
    margin: rpx(20) rpx(10);
    padding: 0;
  }

  .m-cells-title text {
    color: #999999;
    font-size: rpx(24);
  }

  .m-panel-sp-labellist label {
    display: inline-block;
    font-size: rpx(28);
    height: rpx(68);
    width: rpx(180);
    line-height: rpx(68);
    text-align: center;
    border-radius: rpx(8);
    margin-right: rpx(20);
  }

  .p-panel-sp {
    background: #F8F8F8;
  }

  .m-panel-sp-sellabel {
    color: #EA281A !important;
    border: rpx(1) solid #EA281A !important;
  }

  .m-m-panel-sp-btn {
    height: rpx(98);
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
    background-color: #ea281a;
    line-height: rpx(100);
    color: #fff;
    text-align: center;
    font-size: rpx(28);

  }

  .y-cell {
    margin: 0 rpx(30);
  }

  .p-cell-ft {
    padding-left: rpx(6);
  }

  /* 底部结算按钮 */

  /*购物车加减按钮 start*/

  .u-cart-num {
    display: inline-block;
    border: rpx(1) solid #d5d5d5;
    height: rpx(68);
    line-height: rpx(68);
    border-radius: rpx(4);
    text-align: center;
    width: rpx(314);
    font-size: rpx(40);
    color: #999999;

  }

  .u-num-btn {
    float: left;
    width: rpx(104);
  }

  .u-cart-num input {
    float: left;
    width: rpx(103);
    height: rpx(62);
    border-left: rpx(1) solid #d5d5d5;
    border-right: rpx(1) solid #d5d5d5;
    font-size: rpx(28);
    padding-top: rpx(6);
    color: #333 !important;

  }

  .y-img image {
    width: 100%;
    height: rpx(158);
  }

  .y-img {
    width: 100%;
    height: rpx(190);
    position: relative;
  }

  .y-con {
    position: absolute;
    top: rpx(62);
    left: 83%;
    color: #fff;
    z-index: 2;
  }

  .y-juan {
    position: absolute;
    top: rpx(35);
    left: rpx(42);
    color: #fff;
  }

  .y-juan view:nth-child(1) {
    font-size: rpx(32);
    color: #fff;
    font-weight: 600;
    margin-bottom: rpx(8);
  }

  .y-juan view:nth-child(2) {
    font-size: rpx(24);
    color: #fff;
  }

  .e-cell {
    position: relative;
    top: rpx(97);
  }

  .e-btn {
    display: flex;
    padding: rpx(30);
    background: #fff;
    border-bottom: rpx(1) solid #eee;
    border-top: rpx(1) solid #eee;
    padding-left: rpx(30);
  }

  .e-btn-a {
    background-color: #ea281a;
    color: #fff;
    text-align: center;
    font-size: rpx(24);
    flex-direction: row;
    margin: 0;
    border-radius: rpx(8);
    padding: rpx(11) rpx(30);
  }

  .e-btn-b {
    background-color: #fdeeee;
    color: #333333;
    text-align: center;
    font-size: rpx(24);
    flex-direction: row;
    margin: 0;
    border-radius: rpx(8);
    padding: rpx(11) rpx(30);
  }

  .m-media-box-title {
    font-size: rpx(28);
  }

  .scroll-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: rpx(30) rpx(30) 0 rpx(30);
    margin-bottom: rpx(20);
  }

  .m-media-box-info-meta {
    padding-right: rpx(5);
  }

  .m-media-box-appmsg {
    background-color: #fff;
    margin-bottom: rpx(20);
    padding: rpx(40) rpx(30);
  }

  .m-comment .m-media-box-hd {
    border-radius: 100%;
    overflow: hidden;
    vertical-align: top;
  }

  .m-media-box-thumb {
    border-radius: 100%;
  }

  .m-media-box-desc {
    display: block;
    overflow: visible;
    text-overflow: clip;
  }

  .m-comment .m-media-box-info-meta {
    font-size: rpx(24);
    font-weight: 100;
  }

  .m-start label {
    font-size: rpx(24);
  }

  .m-tiem {
    float: right;
  }

  .sel {
    color: #db384c;
    font-size: rpx(24);
  }

  .m-media-list {
    float: left;
    width: 100%;
  }

  .m-media-list image {
    width: rpx(200);
    height: rpx(200);
    box-sizing: border-box;
    margin: rpx(20) rpx(20) 0 0;
    border: rpx(1) solid #eee;
  }

  .p-media {
    display: flex;
    justify-content: space-between;
  }

  .m-time {
    padding-right: rpx(20);
    font-size: rpx(24);
    color: #999999;
  }

  .p-panel {
    background: #ffffff;
    width: 100%;
    height: rpx(98);
    margin-bottom: rpx(147);
    margin-top: rpx(20);
    font-size: rpx(28);
    text-align: center;
    line-height: rpx(98);
  }

  .m-cell-links {
    border-top: rpx(1) solid #eeeeee;

  }

  .g-flex-fott {
    margin-top: rpx(122);
  }

  .table {
    margin: rpx(23);

  }

  .tr {
    display: flex;
    width: 100%;
  }

  .td {
    width: rpx(234);
    padding-left: rpx(31);
    border: rpx(1) solid #EEEEEE;
    height: rpx(80);
    line-height: rpx(80);
    font-size: rpx(24);
    border-right: 0;
    border-bottom: 0;
    color: #666666;
  }

  .bg-g {
    background: #fff;
    font-size: rpx(24);

  }

  .r-td {
    width: rpx(466);
    border: rpx(1) solid #EEEEEE;
    height: rpx(80);
    line-height: rpx(80);
    padding-left: rpx(31);
    border-bottom: 0;
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
    color: #999999;
    font-size: rpx(28);
    text-align: center;
  }

  .u-tap-btn {
    position: fixed;
    right: rpx(20);
    bottom: rpx(150);
    z-index: 4;
  }

  .u-go-home {
    border-radius: 100%;
    width: rpx(80);
    height: rpx(80);
    border: 1px solid #eee;
    font-size: rpx(20);
    text-align: center;
    background-color: #fff;
    box-shadow: 0 rpx(4) rpx(8) rgba(0, 0, 0, 0.35);
    z-index: 2;
    opacity: 0.8;
    line-height: rpx(80);
    margin-bottom: rpx(20);
  }

  .u-go-home .iconfont {
    font-size: rpx(40);
  }

  .show {
    height: rpx(105);
    width: 100%;
  }

  .m-picture-number {
    width: rpx(117);
    height: rpx(63);
    background-color: #333;
    position: absolute;
    z-index: 2;
    right: rpx(30);
    top: rpx(600);
    opacity: 0.5;
    border-radius: rpx(30);
    text-align: center;
    color: #fff;
    line-height: rpx(58);
    font-size: rpx(30);
  }

  rich-text .rich-img {
    width: 100%;
    height: auto;
  }
</style>
