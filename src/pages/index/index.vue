<template>
  <div class="container">
    <div class="m-search-box">
      <div class="u-search-box" @tap="goSearch()">
        <div class="u-search-cont">
          <icon type="search" size="14"></icon>
          <text>搜索商品</text>
        </div>
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
          <div class="filter-item" @tap="toggleSynthesizeMore()"
               :class="{'active':isShowSynthesizeMore || selectedFilterType === filterType.EVALUATION_QUANTITY || selectedFilterType === filterType.SHELVES_TIME }">
            <span>综合</span>
            <span class="synthesize-sort"
                  v-if="isShowSynthesizeMore || selectedFilterType === filterType.EVALUATION_QUANTITY || selectedFilterType === filterType.SHELVES_TIME"></span>
            <div v-if="isShowSynthesizeMore" class="synthesize_more">
              <div @tap="sort(filterType.EVALUATION_QUANTITY,filterSort.DESC)">人气</div>
              <div @tap="sort(filterType.SHELVES_TIME,filterSort.DESC)">上架时间</div>
            </div>
          </div>
          <div class="filter-item" @tap="sort(filterType.SALE_QUANTITY,filterSort.DESC)"
               :class="{'active':selectedFilterType === filterType.SALE_QUANTITY}">
            <span>销量</span>
          </div>
          <div class="filter-item" :class="{'active':selectedFilterType === filterType.SHOW_PRICE}"
               @tap="sort(filterType.SHOW_PRICE,selectedFilterSort===filterSort.DESC?filterSort.ASC:filterSort.DESC)">
            <span>价格</span>
            <div class="price-sort"
                 :class="{'active':selectedFilterType === filterType.SHOW_PRICE && selectedFilterSort===filterSort.ASC}"></div>
          </div>
        </div>
        <scroll-view class="foods-wrapper" scroll-with-animation="true" scroll-y @scrolltolower="dropDown">
          <ul>
            <li @click="goDetail(item.id)" v-for="(item,index) in goods" class="food-item" :key="index">
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
              </div>
            </li>
          </ul>
          <div v-if="isLoading && data.pageNumber !== 1" class="drop-down-status">正在加载ing</div>
          <div v-if="isEnd && data.pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
          <div v-if="goods.length==0 && isEnd" class="no-data-wrapper">
            <div class="no-data">
              <image :src="noData"/>
              <div class='text'>无商品</div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
  import {getProductClassify, getGoodList, getMerchant} from 'api/index';

  export default {
    data() {
      return {
        classifyList: [], // 商品分类列表
        data: {
          pageSize: 10, // 页数
          operatingUnitId: '',
          pageNumber: 1 // 页码
        },
        currentCategoryID: -1, // 当前选中的商品分类
        goods: [], // 商品列表
        isEnd: false, // 数据是否加载完
        canDropDown: true, // 是否可以下拉加载
        isLoading: false,
        isShowSynthesizeMore: false,
        selectedFilterType: '', // 选择的筛选
        selectedFilterSort: '', // 顺序
        filterType: {
          EVALUATION_QUANTITY: 'EVALUATION_QUANTITY', // 综合--人气
          SHELVES_TIME: 'SHELVES_TIME', // 综合--上架时间
          SALE_QUANTITY: 'SALE_QUANTITY', // 销量
          SHOW_PRICE: 'SHOW_PRICE' // 价格
        },
        filterSort: {
          DESC: 'DESC', // 降序
          ASC: 'ASC' // 升序
        },
        noData: require('public/images/no-data.png') // 没有商品列表的默认图片
      };
    },
    methods: {
      toggleSynthesizeMore() {
        this.isShowSynthesizeMore = !this.isShowSynthesizeMore;
      },
      sort(type, sort) {
        this.selectedFilterType = type;
        this.selectedFilterSort = sort;
        this.data.pageNumber = 1;
        this.isEnd = false;
        this.canDropDown = true;
        this.fetchGoodList();
      },
      /**
       * 下拉加载
       */
      dropDown(e) {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        this.fetchGoodList();
      },
      /**
       * 跳转到商品详情
       */
      goDetail(id) {
        this.$bridge.link.goProductDetail(id);
      },
      /**
       * 左侧商品分类点击
       */
      selectMenu(item) {
        this.currentCategoryID = item.id;
        this.data.pageNumber = 1;
        this.isEnd = false;
        this.canDropDown = true;
        this.selectedFilterType = '';
        this.selectedFilterSort = '';
        this.fetchGoodList();
      },
      /**
       * 根据分类id获取对应的商品列表
       */
      async fetchGoodList() {
        this.isLoading = true;
        if (this.data.pageNumber === 1) {
          this.goods = [];
        }
        let params = {
          categoryIds: this.currentCategoryID.split(' '),
          operatingUnitId: this.data.operatingUnitId,
          systemType: 'B2C',
          deviceType: 'MOBILE',
          pageNumber: this.data.pageNumber,
          pageSize: this.data.pageSize
        };
        if (this.selectedFilterType) {
          params.sortColumn = this.selectedFilterType;
          params.sortType = this.selectedFilterSort;
        }
        let res = await getGoodList(params, {isLoading: this.data.pageNumber === 1});
        if (res.firstErrorMessage === '') {
          if (this.data.pageNumber === 1) {
            this.goods = res.result;
          } else {
            this.goods = this.goods.concat(res.result);
          }
          // 判断数据是否全部加载完
          if (res.result.length < this.data.pageSize) {
            this.isEnd = true;
            this.canDropDown = false;
          } else {
            this.canDropDown = true;
            this.data.pageNumber++;
          }
          this.isLoading = false;
        }
      },
      /**
       * 获取商家信息
       */
      async getMerchantInfo() {
        let params = {
          deviceType: 'MOBILE',
          systemType: 'B2C'
        };
        let res = await getMerchant(params);
        this.data.operatingUnitId = res.systemSite.operatingUnitId;
        this.$bridge.storage.save('operatingUnitId', res.systemSite.operatingUnitId);
      },
      /**
       * 获取分类列表
       */
      async fetchProductInfo() {
        let res = await getProductClassify({});
        this.classifyList = res.result;
        this.currentCategoryID = res.result[0].id;
        await this.getMerchantInfo();
        this.fetchGoodList();
      },
      /**
       * 跳转到搜索页面
       */
      goSearch() {
        this.$bridge.link.goSearch();
      }
    },
    onLoad() {
      this.fetchProductInfo();
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  body {
    background-color: red !important
  }

  .m-search-box
    padding: rpx(19) rpx(31);
    background-color: #FFFFFF;
    overflow: hidden;
    border-bottom: rpx(1) solid #DDDDDD;
    .u-search-box
      padding: rpx(20)
      .u-search-cont
        width: 100%;
        background-color: #eee;
        border-radius: rpx(4);
        text-align: center;
        padding: rpx(8) 0 rpx(12) 0;
        icon
          display: inline-block;
          vertical-align: bottom;
          margin-right: rpx(10);
          font-size: rpx(24);
          color: #838d9c;
        text
          font-size: rpx(28);
          color: #838d9c;

  .goods
    display: flex
    position: absolute
    top: rpx(145);
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
      align-items: center
      border-bottom: rpx(1) solid #DDD
      flex-shrink: 0
      .filter-item
        position: relative
        width: 33.3%
        padding: rpx(20) 0;
        font-size: rpx(24)
        color: #666666;
        text-align: center
        &.active
          color: #EA281A
        .synthesize-sort
          position: relative
          top: rpx(-3)
          display: inline-block
          margin-left: rpx(4)
          width: rpx(8)
          height rpx(8)
          background-image: url('../../public/images/select2x.png')
          background-repeat: no-repeat
          background-size: 100% 100%
        .price-sort
          display: inline-block
          margin-top: rpx(10)
          margin-left: rpx(10)
          background-image: url('../../public/images/pricedown.png')
          width: rpx(10)
          height rpx(16)
          background-repeat: no-repeat
          background-size: 100% 100%
          transform: rotate(180deg)
          &.active
            transform: rotate(0deg)

  .foods-wrapper
    flex: 1
    overflow-y: auto
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
        .cart_control_wrapper
          position: absolute
          right: rpx(40)
          bottom: rpx(24)
          .add_to_card
            width: rpx(40)
            height: rpx(40)
            bg-image: ('../../public/images/shop')
            background-repeat: no-repeat
            background-size: 100% 100%
    .drop-down-status
      text-align: center;
      font-size: rpx(24);
      padding: rpx(20);
      color: #ccc;

  .synthesize_more
    position: absolute;
    top: rpx(74)
    width: 100%;
    background: #fff;
    z-index: 20;
    div
      height: rpx(60);
      line-height: rpx(60)
      color: #000

  .no-data-wrapper
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex
    flex-direction column
    justify-content: center
    align-items: center
    image
      display: block
      width: rpx(156)
      height: rpx(156)
    .text
      padding-top: rpx(24)
      color: #999;
      font-size: rpx(28)
      text-align: center

</style>
