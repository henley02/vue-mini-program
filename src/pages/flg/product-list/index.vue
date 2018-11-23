<template>
  <div class="container">
    <div class="u-notice">
      <i class="u-bell-icon"></i>
      <span>新用户首单立减9元</span>
    </div>
    <div class="mod-main">
      <div class="m-pro-hd">
        <div class="pro-inner">
          <div class="pro-i-hd">
            <div class="pro-face">
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542703606838&di=2250ecceaf5f7fc659719cf4e69eeb38&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F242dd42a2834349b193b6c82caea15ce36d3bef3.jpg"
                alt="">
            </div>
            <div class="pro-intro">
              <div class="pi-tit">{{wfxData.storeName}}</div>
              <p>欢迎来到我的门店!</p>
            </div>
          </div>
          <div class="pro-i-bt">
            <div class="pro-bt-col">
              <div>售出</div>
              <div>{{wfxData.salesQuantityCount}}</div>
            </div>
            <div class="pro-bt-col">
              <div>网红指数</div>
              <div>{{wfxData.popularityIndex}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-pro-content">
        <div class="m-pro-nav">
          <ul>
            <li class="active"><span>香薰套盒</span></li>
            <li><span>香薰套盒</span></li>
            <li><span>香薰套盒</span></li>
            <li><span>香薰套盒</span></li>
            <li><span>香薰套盒</span></li>
          </ul>
        </div>
        <div class="pro-content">
          <div class="pro-content-item">
            <div class="pro-goods">
              <div class="goods-pic">
                <img
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542703606838&di=2250ecceaf5f7fc659719cf4e69eeb38&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F242dd42a2834349b193b6c82caea15ce36d3bef3.jpg"
                  alt="">
              </div>
              <div class="goods-info">
                <div class="goods-intro">香薰精油家用室内卫生间空气清新剂卧室持久留香香水</div>
                <div class="goods-handle">
                  <div class="g-money">
                    <span>￥</span>200
                  </div>
                  <div class="g-cart-icon"></div>
                </div>
              </div>
            </div>
            <div class="pro-goods">
              <div class="goods-pic">
                <img
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542703606838&di=2250ecceaf5f7fc659719cf4e69eeb38&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F242dd42a2834349b193b6c82caea15ce36d3bef3.jpg"
                  alt="">
              </div>
              <div class="goods-info">
                <div class="goods-intro">香薰精油家用室内卫生间空气清新剂卧室持久留香香水</div>
                <div class="goods-handle">
                  <div class="g-money">
                    <span>￥</span>200
                  </div>
                  <div class="g-cart-icon"></div>
                </div>
              </div>
            </div>
            <div class="pro-goods">
              <div class="goods-pic">
                <img
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542703606838&di=2250ecceaf5f7fc659719cf4e69eeb38&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F242dd42a2834349b193b6c82caea15ce36d3bef3.jpg"
                  alt="">
              </div>
              <div class="goods-info">
                <div class="goods-intro">香薰精油家用室内卫生间空气清新剂卧室持久留香香水</div>
                <div class="goods-handle">
                  <div class="g-money">
                    <span>￥</span>200
                  </div>
                  <div class="g-cart-icon"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 芳聊馆--产品列表（产品单）
   */
  import {fetchWFXMember} from 'api/index';

  export default {
    data() {
      return {
        memberId: '',
        wfxData: {}
      };
    },
    components: {},
    computed: {},
    methods: {
      /**
       * 获取微分销的信息
       */
      async fetchWFXMember() {
        let res = await fetchWFXMember({
          id: this.memberId
        });
        if (res.firstErrorMessage === '') {
          this.wfxData = res.wfxMember;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.memberId = this.$root.$mp.query.memberId;
      console.log(this.$root.$mp.query);
      this.fetchWFXMember();
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  .container {
    width: 100%;
    height: 100%;
    background: #f5f5f9;
    overflow-y: auto;
  }

  .u-notice {
    height: 36px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #F86E21;
    padding: 0 15px;
    background: #FDFCEC;
  }

  .u-bell-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    display: inline-block;
    margin-right: 8px;
    background: url("../../../public/images/flg/product/notice.png") no-repeat center center;
    background-size: contain;
  }

  .u-notice span {
    display: inline-block;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*main*/
  .mod-main {
    padding: 10px 15px;
  }

  .m-pro-hd {
    width: 100%;
    height: 144px;
    background: url("../../../public/images/flg/product/pbg.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .pro-inner {
    padding: 0 15px;
  }

  .pro-i-hd {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    color: #888;
    font-size: 15px;
  }

  .pro-face {
    width: 45px;
    height: 45px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
    margin-right: 15px;
  }

  .pro-face img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .pi-tit {
    font-size: 18px;
    color: #333;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pro-intro {
    flex: 1;
    display: block;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pro-i-bt {
    height: 62px;
    display: flex;
    align-items: center;
  }

  .pro-i-bt .pro-bt-col {
    width: 50%;
    flex-shrink: 0;
    text-align: center;
    color: #333;
    font-size: 15px;
  }

  .m-pro-content {
    padding-top: 10px;
  }

  .m-pro-nav {
    position: relative;
    width: 100%;
    padding: 0 12px;
    word-break: keep-all;
    white-space: nowrap;
    overflow-x: auto;
    box-sizing: border-box;
  }

  .m-pro-nav ul {
    width: 100%;
    display: table;
    table-layout: fixed;
  }

  .m-pro-nav li {
    width: 86px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    padding-left: 12px;
  }

  .m-pro-nav li:first-child {
    padding-left: 0;
  }

  .m-pro-nav li span {
    width: 100%;
    height: 36px;
    line-height: 36px;
    display: block;
    color: #888;
    font-size: 14px;
    background: #fff;
    border-radius: 4px 4px 0 0;
  }

  .m-pro-nav li.active span {
    color: #EA281A;
    font-size: 15px;
  }

  .pro-content {
    padding: 12px 0 12px 12px;
    background: #fff;
  }

  .pro-goods {
    display: flex;
    padding-top: 12px;
  }

  .pro-goods .goods-pic {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }

  .pro-goods .goods-pic img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .pro-goods .goods-info {
    flex: 1;
    height: 80px;
    margin-left: 12px;
    padding: 0 12px 12px 0;
    border-bottom: 1px solid #eee;
  }

  .goods-intro {
    color: #333;
    font-size: 14px;
    height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .goods-handle {
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .g-money {
    color: #EA281A;
    font-size: 16px;
  }

  .g-money span {
    font-size: 12px;
  }

  .g-cart-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url("../../../public/images/flg/product/cart.png") no-repeat center center;
    background-size: contain;
  }
</style>
