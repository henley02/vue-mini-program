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
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" :key="index"
              @click="selectMenu(index)" :id="'nav_'+index">
            <span class="text">{{item.name}}</span>
          </li>
        </ul>
      </scroll-view>
      <scroll-view class="foods-wrapper" :scroll-into-view="contentId" scroll-with-animation="true" scroll-y
                   @scroll="onScroll">
        <ul>
          <li v-for="(item,goodIndex) in goods" class="food-list food-list-hook" :key="goodIndex" :id="'con_'+id">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="(food,foodIndex) in item.foods" class="food-item border-1px"
                  :key="foodIndex">
                <div class="icon">
                  <img :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old"
                                                                  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <!--<cartcontrol @add="addFood" :food="food"></cartcontrol>-->
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import card from '@/components/card';
  import {groupDetail} from 'api/index';

  export default {
    data() {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        inputVal: '',
        inputShowed: false,
        inputFocus: false,
        userInfo: {},
        goods: [],
        contentId: '', // 每个food-list的id，scroll-into-view滚动到对应的id
        navId: '', // 导航模块对应的id，用来联动内容区域
        currentIndex: 0,
        navulHeight: 0, // 导航里ul高度
        navItemHeight: 0, // 每个导航高度
        listHeight: [], // foods内部块的高度
        contentHeight: [] // 内容区域scroll-view高度
      };
    },

    components: {
      card
    },
    computed: {
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    watch: {
      currentIndex() {
        console.log(this.currentIndex);
        console.log(this.contentHeight);
        console.log(this.navulHeight);
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
      selectMenu(index) {
        this.contentId = `con_${index}`;
        this.navId = `nav_${index}`;
        this.currentIndex = index;
      },
      onScroll(e) {
        this.contentId = '';
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
      async init() {
        let res = await groupDetail();
        if (res.errno === 0) {
          this.goods = res.data;
          setTimeout(() => {
            this.getFoodHeight();
          }, 1000);
        } else {
          this.$bridge.alert(res.msg);
        }
        console.log(this.goods);
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
      async getUserInfo() {
        let res = await this.$bridge.user.getUserInfo();
        this.userInfo = res;
        // 调用登录接口
      },
      clickHandle(msg, ev) {
        console.log('clickHandle:', msg, ev);
      }
    },
    onShow() {
      // 调用应用实例的方法获取全局数据
      this.getUserInfo();
      this.init();
      this.$bridge.dialog.alert(13213);
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
    top: 96rpx
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
        height: 60rpx
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
            width: 114rpx;
            height:114rpx
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
