<template>
  <div class="container">
    <div class="search-wrapper">
      <div class="m-search-box">
        <div class="u-input-search">
          <icon type="search" size="14"></icon>
          <input type="text" v-model="inputVal" @confirm="search()" placeholder="请输入商品名称"/>
          <div class="u-btn" @tap="search">搜索</div>
        </div>
      </div>
      <scroll-view scroll-y="true" @scrolltolower="dropDown" :style="{height:scrollHeight}">
        <ul>
          <li @click="goDetail(item.id)" v-for="(item,index) in list" class="food-item" :key="index">
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
        <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
        <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
        <div v-if="list.length === 0 && isEnd" class="no-data-wrapper">
          <image :src='noData' class='image'></image>
          <div class='text'>无商品</div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
  import {getGoodList} from 'api/index';

  /**
   * 搜索页面
   */
  export default {
    data() {
      return {
        noData: require('public/images/no-data.png'), // 没有商品列表的默认图片
        list: [],
        scrollHeight: '0px',
        inputVal: '',
        inputFocus: true,
        isLoading: false,
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        isEnd: false,
        canDropDown: true // 是否可以下拉加载
      };
    },
    methods: {
      /**
       * 跳转到商品详情
       */
      goDetail(id) {
        this.$bridge.link.goProductDetail(id);
      },
      /**
       * 下拉加载
       */
      dropDown() {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        this.fetchList();
      },
      /**
       * 查找商品
       * @returns {boolean}
       */
      search() {
        if (this.inputVal.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入商品名称'});
          return false;
        }
        this.list = [];
        this.pageNumber = 1;
        this.isEnd = false;
        this.canDropDown = true;
        this.fetchList();
      },
      async fetchList() {
        this.isLoading = true;
        let params = {
          keyword: this.inputVal,
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          systemType: 'B2C',
          deviceType: 'MOBILE',
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        let res = await getGoodList(params, {isLoading: this.pageNumber === 1});
        this.list = this.list.concat(res.result);
        // 判断数据是否全部加载完
        if (this.list.length >= res.totalCount || res.result.length < this.pageSize) {
          this.isEnd = true;
          this.canDropDown = false;
        } else {
          this.canDropDown = true;
          this.pageNumber++;
        }
        this.isLoading = false;
      }
    },
    onLoad() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      wx.getSystemInfo({
        success: (res) => {
          this.scrollHeight = (res.windowHeight - 62) + 'px';
        }
      });
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .m-search-box {
    padding: rpx(20);
    overflow: hidden
  }

  .u-input-search {
    width: 100%;
    height: rpx(70);
    background-color: white;
    float: left;
    border-radius: rpx(8);
    overflow: hidden;
    border: rpx(1) solid #DFDFDF;
  }

  .u-input-search input {
    font-size: rpx(28);
    height: 100%;
    width: rpx(520);
    float: left;
  }

  .u-input-search icon {
    float: left;
    margin: rpx(20);
  }

  .u-input-search .u-btn {
    width: rpx(121);
    height: rpx(70);
    line-height: rpx(70);
    border-left: rpx(1) solid #DFDFDF;
    display: block;
    float: right;
    text-align: center;
    text-decoration: none;
    color: #999;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    font-size: rpx(28);
  }

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
