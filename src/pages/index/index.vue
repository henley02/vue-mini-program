<template>
  <div class="container">
    <div class="search-wrapper">
      <div class="weui-search-bar">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input type="text" class="weui-search-bar__input" placeholder="搜索商品" v-model="inputVal" :focus="inputFocus"
                   @input="bindKeyInput(e)" confirm-type="search" @confirm="inputConfirm(event)" @blur="inputBlur"/>
            <div class="weui-icon-clear" v-if="inputVal.length > 0" @tap="clearInput">
              <icon type="clear" size="14"></icon>
            </div>
          </div>
          <label class="weui-search-bar__label" v-if="!inputShowed" @tap="howInput">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <div class="weui-search-bar__text">搜索商品</div>
          </label>
        </div>
        <div class="weui-search-bar__cancel-btn" v-if="inputShowed" @tap="hideInput">取消</div>
      </div>
    </div>
    <div class="goods">
      <scroll-view class="menu-wrapper" :scroll-into-view="navId" scroll-with-animation="true" scroll-y>
        <ul class="menu-ul">
          <li v-for="(item,index) in classifyList" class="menu-item" :key="index" @click="selectMenu(item)">
            <div class='img'>
              <image :src='item.pictureUrl'></image>
            </div>
            <span class="text" :class="{'current':currentCategoryID===item.id}">{{item.categoryName}}</span>
          </li>
        </ul>
      </scroll-view>
      <div class="right-wrapper">
        <div class="filtrate-wrapper">
          <div class="filter-item">综合</div>
          <div class="filter-item">销量</div>
          <div class="filter-item">价格</div>
        </div>

      </div>
      <scroll-view class="foods-wrapper" scroll-with-animation="true" scroll-y
                   @scroll="onScroll">
        <ul>
          <li @click="selectFood(item,$event)" v-for="(item,index) in goods" class="food-item" :key="index">
            <div class="icon">
              <img :src="item.pictureUrl">
            </div>
            <div class="content border-1px">
              <div class="name-wrapper">
                <div class="name">{{item.name}}</div>
              </div>
              <div class="price">
                <span class="now">￥{{item.showPrice}}</span>
              </div>
              <div class="extra">
                <span class='many'>{{item.saleQuantity}}条成交</span>
              </div>
              <div class="cartcontrol-wrapper">
                <!--<cartcontrol @add="addFood" :food="food"></cartcontrol>-->
              </div>
            </div>
          </li>
        </ul>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import card from '@/components/card';
  import {getProductClassify, getGoodList, getMerchant} from 'api/index';
  import {tenantId} from 'public/config/index.js';

  export default {
    data() {
      return {
        classifyList: [],
        data: {
          pageSize: 10,
          operatingUnitId: '',
          pageNumber: 1
        },
        currentCategoryID: -1,
        goods: [],

        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        inputVal: '',
        inputShowed: false,
        inputFocus: false,
        userInfo: {},
        navId: '', // 导航模块对应的id，用来联动内容区域
        navulHeight: 0, // 导航里ul高度
        navItemHeight: 0, // 每个导航高度
        listHeight: [], // foods内部块的高度
        contentHeight: [] // 内容区域scroll-view高度
      };
    },

    components: {
      card
    },
    computed: {},
    watch: {
      currentIndex() {
        if (this.contentHeight < this.navulHeight) {
          let h = this.currentIndex * this.navItemHeight;
          if (h > this.contentHeight) {
            // 导航滑动
            this.navId = `nav_${this.currentIndex}`;
          } else {
            this.navId = 'nav_0';
          }
        }
      }
    },
    methods: {
      selectMenu(item) {
        this.currentCategoryID = item.id;
        this.data.pageNumber = 1;
        this.fetchGoodList();
      },
      onScroll(e) {
        console.log(e);
        let scrollTop = e.target.scrollTop;
        let length = this.listHeight.length;
        if (scrollTop >= this.listHeight[length - 1] - this.contentHeight) {
          return;
        } else if (scrollTop > 0 && scrollTop < this.listHeight[0]) {
          this.currentIndex = 0;
        }
        for (let i = 0; i < length; i++) {
          if (scrollTop >= this.listHeight[i - 1] && scrollTop < this.listHeight[i]) {
            this.currentIndex = i;
          }
        }
      },
      getFoodHeight() {
        var query = wx.createSelectorQuery();
        let h = 0;
        query.selectAll('.food-list-hook').boundingClientRect((rects) => {
          rects.forEach((rect) => {
            h += rect.height;
            this.listHeight.push(h);
          });
        });
        query.select('.foods-wrapper').boundingClientRect((rect) => {
          this.contentHeight = rect.height;
        });
        query.select('.menu-ul').boundingClientRect((rect) => {
          this.navulHeight = rect.height;
        });
        query.select('.menu-item').boundingClientRect((rect) => {
          this.navItemHeight = rect.height;
        }).exec();
      },
      /**
       * 根据分类id获取对应的商品列表
       */
      async fetchGoodList() {
        let params = {
          categoryIds: this.currentCategoryID.split(' '),
          operatingUnitId: this.data.operatingUnitId,
          systemType: 'B2C',
          deviceType: 'MOBILE',
          pageNumber: this.data.pageNumber,
          pageSize: this.data.pageSize,
          tenantId: tenantId
        };
        let res = await getGoodList(params);
        if (this.data.pageNumber === 1) {
          this.goods = res.result;
        } else {
          this.goods.concat(res.result);
        }
      },
      /**
       * 获取商家信息
       */
      async getMerchantInfo() {
        let params = {
          deviceType: 'MOBILE',
          systemType: 'B2C',
          tenantId: tenantId
        };
        let res = await getMerchant(params);
        this.data.operatingUnitId = res.systemSite.operatingUnitId;
      },
      /**
       * 获取分类列表
       */
      async fetchProductInfo() {
        let res = await getProductClassify({tenantId: tenantId});
        this.classifyList = res.result;
        this.currentCategoryID = res.result[0].id;
        await this.getMerchantInfo();
        this.fetchGoodList();
      },
      inputBlur() {
        // this.inputFocus = false;
      },
      /**
       * 清空搜索框内容
       */
      clearInput() {
        this.inputVal = '';
      },
      /**
       * 显示隐藏搜索框
       */
      howInput() {
        this.inputShowed = true;
        this.inputFocus = true;
      },
      hideInput() {
        this.inputVal = '';
        this.inputShowed = false;
        this.inputFocus = false;
      },
      bindKeyInput(e) {
      },
      inputConfirm(e) {
        console.log('确认');
        this.$bridge.dialog.confirm({
          title: 'aaaa',
          content: this.inputVal,
          confirmCallback: () => {
            console.log('dianji ');
          }
        });
      },
      bindViewTap() {
        this.$bridge.link.navigateTo('../logs/main');
      },
      clickHandle(msg, ev) {
        console.log('clickHandle:', msg, ev);
      }
    },
    onShow() {
      this.fetchProductInfo();
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  @import "~weui-wxss/dist/style/widget/weui-searchbar/weui-searchbar.wxss";

  .search-wrapper
    display: flex;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
    .weui-search-bar
      padding: rpx(20) rpx(30)
    .weui-search-bar
      width: 100%;
      background-color: #fff
      border-top: none
      border-bottom: rpx(1) solid #DDD
      .weui-search-bar__label
      .weui-search-bar__input
      .weui-search-bar__box
        background: #eee

  .goods
    display: flex
    position: absolute
    top: rpx(96);
    bottom: 0px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 rpx(164)
      width: rpx(164)
      border-right: 1px solid #ccc
      .menu-item
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        height: rpx(164);
        width: rpx(164);
        text-align: center
        line-height: 14px
        .img
          text-align: center;
          image
            width: rpx(56)
            height: rpx(56)
        .text
          justify-content: center;
          width: 100%
          vertical-align: middle
          font-size: rpx(24)
          color: #000
          border-left: 4px solid #fff;
          &.current
            color: #ea281a
            border-left: 4px solid #ea281a;

  .right-wrapper
    width: 100%
    display: flex
    flex-direction: column
    .filtrate-wrapper
      display: flex
      flex-direction: row
      border-bottom: rpx(1) solid #DDD
      .filter-item
        width: 33.3%
        padding: rpx(20) 0;
        font-size: rpx(24)
        color: #666666;
        text-align: center

  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: rpx(20) 0 rpx(20) rpx(10)
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: rpx(15)
        img
          width: rpx(178);
          height: rpx(178);
          margin-top: rpx(11);
      .content
        border-1px(rgba(7, 17, 27, 0.1))
        flex: 1
        height: 95px;
        .name-wrapper
          width: rpx(362);
          height: rpx(100);
          font-size: rpx(28);
          padding-top: rpx(8);
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
        .extra
          .many
            padding-left: rpx(8)
            color: #999
            font-size: rpx(24)
        .price
          font-size: rpx(24)
          .now
            padding-bottom: rpx(8)
            font-size: rpx(32)
            color: #ea281a
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>
