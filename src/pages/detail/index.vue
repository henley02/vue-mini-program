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
          <text>{{index}} / {{ProductInfo.pictureList.length}}</text>
        </div>
        <div class="m-banner-ad">
          <swiper autoplay="false" interval="3000" duration="300" current="0" bindchange='onSlideChangeEnd'>
            <swiper-item v-for="(item,index) in ProductInfo.pictureList" :key="index">
              <image class="slide-image" :src="item.url"/>
            </swiper-item>
          </swiper>
        </div>
        <div class="m-cells">
          <div class="m-info-box">
            <div>
              <div class='p-info'>{{ProductInfo.commodity.name}}</div>
              <div class='p-info-price'>
                <div class='p-price-text'>
                  <div class="m-info-price">￥
                    <text v-if="!According">{{Salespromotion ? Salespromotion : showPriceone}}</text>
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
          <div class="m-m-panel-sp-rbtn" catchtap="closesp">关闭</div>
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
        <div class="m-footer-btn-item" bindtap='collectionNew'>
          <div class="m-footer-btn-icon">
            <image style='width:34rpx;height:30rpx;' v-if="isCollected" src="../../img/Collected.png"></image>
            <image style='width:34rpx;height:30rpx;' v-else src="../../img/shouxin.png"></image>
          </div>
          <text>{{isCollected ? "已收藏" : "收藏"}}</text>
        </div>
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
        <div class="m-m-panel-sp-rbtn" catchtap="buynow" v-if="tab==0">确定</div>
        <div class="m-m-panel-sp-rbtn" catchtap="ckselectspbuynow" v-else>确定</div>
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
    <div class="m-panel-sp" :class="{'hide':selectsp==0}" bindtap="closesp" v-if="!conponflag">
      <div class="m-panel-sp-content"
           :class="{'bounceOutDown animated':selectct==0,'bozunceInUp animated':selectct!=0}">
        <div class="m-panel-sp-pinfo">
          <div class="m-panel-sp-pimg">
            <image :src="ProductInfo.commodity.pictureUrl"/>
          </div>
          <div class="m-panel-sp-pname">
            <!-- <div class='m-pprice'>¥{{showPrice}}</div> -->
            <div class='m-pprice'>¥{{Salespromotion ? Salespromotion : showPrice}}</div>
            <div class="m-pstock" v-if="repertoryquantity>0">库存{{repertoryquantity}}件</div>
            <div class="m-pstock" v-else>库存0件</div>
            <div class="p-pstock">请选择</div>
          </div>
          <icon type="cancel" class="m-panel-sp-icon" color="#888" catchtap="closesp"/>
        </div>
        <scroll-div class="m-panel-sp-listbox" scroll-y="true">
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">{{ProductInfo.spec1AttrList[0].attributeName}} </div>
            <div class="m-panel-sp-labellist">
              <block v-for="(item,index) in ProductInfo.spec1AttrList" :key="index">
                <label :class="{'m-panel-sp-sellabel':prduindex==i,'p-panel-sp':prduindex!=i}"
                       catchtap="selectsp">{{item.valueName}}</label>
              </block>
            </div>
          </div>
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">{{ProductInfo.spec2AttrList[0].attributeName}} </div>
            <div class="m-panel-sp-labellist">
              <block v-for="(item,index) in ProductInfo.spec2AttrList" :key="index">
                <label :class="{'m-panel-sp-sellabel':spec2AttrList==i}"
                       catchtap="spec2AttrList">{{item.valueName}}</label>
              </block>
            </div>
          </div>
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">{{ProductInfo.spec3AttrList[0].attributeName}} </div>
            <div class="m-panel-sp-labellist">
              <block v-for="(item,index) in ProductInfo.spec3AttrList" :key="index">
                <label :class="{'m-panel-sp-sellabel':spec3AttrList==i}"
                       catchtap="spec3AttrList">{{item.valueName}}</label>
              </block>
            </div>
          </div>
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">数量
            </div>
            <div class="m-panel-sp-labellist">
              <div class="u-cart-num">
                <div class="u-num-btn" catchtap="sub" :class="minusStatus">-</div>
                <input type="number" v-model="numval" bindblur="writenum"/>
                <div class="u-num-btn" catchtap="add">+</div>
              </div>
            </div>
          </div>
          <div style="height:163rpx;width:100%;"></div>
        </scroll-div>
      </div>
    </div>
  </div>

</template>

<script>
  /**
   * 芳聊馆首页
   */
  export default {
    data() {
      return {
        isShowToast: false,
        pictureEvaluationNumber: 0,
        evaluationNumber: 0,
        comments: [],
        operatingUnitId: 0,
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
        index: 1,
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
        According: false,
        tab: 0
      };
    },
    components: {},
    computed: {},
    methods: {},
    onLoad() {
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  .container {
    padding-top: rpx(30);
  }

  .banner {
    margin: 0 auto;
    width: 92%;
    height: rpx(297)
    border: 1px solid red;
    border-radius: rpx(10)
  }

  .banner-wrapper {
    padding-top: rpx(90);
  }

  .head-img {
    display: inline-block;
    width: rpx(120);
    height: rpx(120);
    border-radius: 50%;
  }
</style>
