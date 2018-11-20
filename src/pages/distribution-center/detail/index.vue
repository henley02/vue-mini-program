<template>
  <div class="container">
    <div class="order-hd">
      <div class="o-total-label">合计基金</div>
      <div class="o-total-money">¥6.00</div>
    </div>
    <div class="order-list">
      <ul>
        <li>
          <div class="order-intro">
            <div class="oi-tro-tit">一次性口罩防尘透气秋冬女黑色活一次性口罩防尘透气秋冬女黑色活</div>
            <div class="oi-tro-money">¥9.00</div>
            <div class="oi-tro-tip">黑色</div>
          </div>
          <div class="order-r-money">
            <span class="c-green">+2.00</span>
          </div>
        </li>
        <li>
          <div class="order-intro">
            <div class="oi-tro-tit">一次性口罩防尘透气秋冬女黑色活一次性口罩防尘透气秋冬女黑色活</div>
            <div class="oi-tro-money">¥9.00</div>
            <div class="oi-tro-tip">黑色</div>
          </div>
          <div class="order-r-money">
            <span class="c-green">+2.00</span>
          </div>
        </li>
        <li>
          <div class="order-intro">
            <div class="oi-tro-tit">一次性口罩防尘透气秋冬女黑色活一次性口罩防尘透气秋冬女黑色活</div>
            <div class="oi-tro-money">¥9.00</div>
            <div class="oi-tro-tip">黑色</div>
          </div>
          <div class="order-r-money">
            <span class="c-green">+2.00</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="order-footer">
      <div class="of-row">姓名：王帅</div>
      <div class="of-row">订单时间: 2018-09-29</div>
      <div class="of-row">订单号: 20180922123456789</div>
    </div>
  </div>
</template>

<script>
  /**
   * 分销中心
   */
  export default {
    data() {
      return {};
    },
    components: {},
    computed: {},
    methods: {},
    onShow() {
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  /*order*/
  .order-hd {
    color: #333;
    font-size: 14px;
    padding: 20px 15px;
    background: #fff;
    border-bottom: 10px solid #f5f5f9;
  }

  .o-total-money {
    font-size: 24px;
    color: #EA281A;
  }

  .order-list {
    border-bottom: 10px solid #f5f5f9;
  }

  .order-list li {
    font-size: 14px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .order-list li:last-child {
    border-bottom: 0;
  }

  .order-intro {
    flex: 1;
    width: 0;
    padding-right: 12px;
  }

  .oi-tro-tit {
    color: #000;
    font-size: 17px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .oi-tro-money {
    color: #333;
  }

  .oi-tro-tip {
    color: #999;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-r-money {
    width: 20%;
    flex-shrink: 0;
    font-size: 18px;
    color: #1AAD19;
    text-align: right;
  }

  .order-footer {
    color: #888;
    font-size: 12px;
    padding: 10px 15px;
  }
</style>
