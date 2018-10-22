<template>
  <div class="container">
    <div class="search-wrapper">
      <div class="weui-search-bar" @tap="goSearch()">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <input type="text" class="weui-search-bar__input" placeholder="搜索商品"/>
          </div>
          <label class="weui-search-bar__label">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <div class="weui-search-bar__text">搜索商品</div>
          </label>
        </div>
      </div>
    </div>
    <div class="m-tab">
      <div class="m-navbar">
        <div class="m-navbar-item" :class="{'m-navbar-item-on':tapindex==1}" bindtap="allOrders">
          <label class="m-sort">综合
            <image src="../../img/select2x.png" class='sorg' style='width:10rpx;height:10rpx' v-if='tapindex==1'/>
          </label>
        </div>
        <div class="m-navbar-item" :class="{'m-navbar-item-on':tapindex==2}" bindtap="toBePaid">
          销量
        </div>
        <div class="m-navbar-item" @tap="sortByPrice()" :class="{'m-navbar-item-on':tapindex==3}">
          <label class="m-sort" v-if="sort==0">价格
            <image src="../../img/transimg.png" class='sorg'/>
          </label>
          <label class="m-sort" v-else-if="sort==1">价格
            <image src="../../img/pricedown.png" class='sotr'/>
          </label>
        </div>
      </div>
    </div>
    <div>
      <scroll-view class="m-category-l" scroll-y="true">
        <div v-for="(item,index) in classifyList" :key="index" bindtap="ckCategoryitem" class='p-category-l'
             :class="{'current':currentIndex===index}">
          <div class='p-l'>
            <div class='m-category-l-item_img'>
              <image :src='item.pictureUrl'></image>
            </div>
            <div class="m-category-l-item">{{item.categoryName}}</div>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import card from '@/components/card';
  import {getProductClassify} from 'api/index';

  export default {
    data() {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        goods: [],
        classifyList: [],
        currentCategoryID: '',
        information: [],
        sort: 0,
        tapindex: 1,
        flag: false
      };
    },
    components: {
      card
    },
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
      goSearch() {
        this.$bridge.link.goSearch();
      },
      async init() {
      },
      async fetchProductInfo() {
        let res = await getProductClassify({});
        this.classifyList = res.result;
        this.currentCategoryID = res.result[0].id;
      }
    },
    onShow() {
      // 调用应用实例的方法获取全局数据
      // this.init();
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
      width: 100%;
      background-color: #fff
      .weui-search-bar__label
      .weui-search-bar__input
      .weui-search-bar__box
        background: #eee

  .goods
    display: flex
    position: absolute
    top: 96 rpx
    bottom: 0px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 100px
      border-right: 1px solid #ccc
      .menu-item
        display: flex
        align-items: center
        justify-content: center
        height: 60 rpx
        width: 100%
        text-align: center
        line-height: 14px
        border-left: 2px solid #fff;
        &.current
          border-left: 2px solid red;
        .text
          justify-content: center;
          width: 100%
          vertical-align: middle
          font-size: 14px
          color: #333
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
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
          img
            width: 114 rpx;
            height: 114 rpx
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
