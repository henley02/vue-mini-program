<template>
  <div class="container">
    <div class="dis-center-hd">
      <div class="dis-hd-btn">去提现</div>
      <div class="dis-money">
        <div class="dis-m-money">
          <span>￥</span>
          <div class="b-money">900.00</div>
        </div>
        <div class="dis-m-label">我的金额</div>
      </div>
      <div class="dis-m-cols">
        <div class="dis-m-col">
          <div class="dis-mc-num"><span class="mc-em">￥</span>320.48</div>
          <div class="dis-mc-label">未到账</div>
        </div>
        <div class="dis-m-col">
          <div class="dis-mc-num"><span class="mc-em">￥</span>320.48</div>
          <div class="dis-mc-label">未到账</div>
        </div>
      </div>
    </div>
    <div class="dis-detail-list">
      <div class="detail-title">
        <span class="d-tit"><i></i>基金明细</span>
        <div class="calendar-col">
          2018-10<i class="calendar-icon"></i>
        </div>
      </div>
      <ul>
        <li>
          <div class="point-info">
            <i class="point-icon"></i>
            <div class="point-intro">
              <div class="pn-tit">销售订单获得基金</div>
              <div class="pn-time">10-09 12:56</div>
            </div>
          </div>
          <div class="point-number">
            <span class="c-green">+ 80</span>
          </div>
        </li>
        <li>
          <div class="point-info">
            <i class="point-icon"></i>
            <div class="point-intro">
              <div class="pn-tit">提现</div>
              <div class="pn-time">10-09 12:56</div>
            </div>
          </div>
          <div class="point-number">
            <span class="c-red">- 232</span>
          </div>
        </li>
      </ul>
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
    },
    onLoad() {

    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";

  /**/
  .dis-center-hd {
    position: relative;
    width: 100%;
    height: 225px;
    background: url("../../../public/images/distribution/disbg.jpg") no-repeat center center;
    background-size: 100% 100%;
  }

  .dis-hd-btn {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 2;
    width: 72px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }

  .dis-money {
    color: #fff;
    font-size: 24px;
    text-align: center;
    padding: 40px 12px 16px;
  }

  .dis-m-money{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dis-money .b-money {
    font-size: 34px;
    display inline-block
  }

  .dis-m-label {
    font-size: 16px;
  }

  .dis-m-cols {
    display: flex;
    align-items: center;
    padding: 0 12px;
  }

  .dis-m-col {
    position: relative;
    width: 50%;
    flex-shrink: 0;
    text-align: center;
    color: #fff;
  }

  .dis-m-col:before {
    position: absolute;
    top: 18%;
    left: 0;
    z-index: 2;
    content: "";
    width: 0;
    height: 64%;
    opacity: .5;
    border-right: 1px solid #fff;
    -webkit-transform: scaleX(.5);
    transform: scaleX(.5);
  }

  .dis-m-col:first-child:before {
    border-right: 0;
  }

  .dis-m-col em {
    font-size: 12px;
  }

  .dis-mc-num {
    font-size: 16px;
  }

  .mc-em{
    font-size 12px;
  }

  .dis-mc-label {
    font-size: 14px;
  }

  .detail-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    color: #000;
    font-size: 14px;
    border-bottom:1px solid #ddd;
  }

  .d-tit {
    position: relative;
    padding-left: 10px;
  }

  .d-tit:before {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 2;
    content: "";
    width: 0;
    height: 14px;
    margin-top: -7px;
    border-left: 3px solid #F35A42;
    border-radius: 2px;
  }

  .calendar-col {
    color: #8B8B8D;
    font-size: 14px;
    text-align: right;
    display: flex;
    align-items: center;
  }

  .calendar-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-left: 10px;
    background: url("../../../public/images/distribution/calendar.png") no-repeat center center;
    background-size: contain;
  }

  .dis-detail-list li {
    padding: 18px 15px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .point-icon {
    width: 45px;
    height: 45px;
    flex-shrink: 0;
    background: url("../../../public/images/distribution/point.png") no-repeat center center;
    background-size: contain;
  }

  .point-info {
    display: flex;
    align-items: center;
    width: 67%;
    flex-shrink: 0;
  }

  .point-intro {
    padding-left: 10px;
  }

  .point-number {
    flex-shrink: 0;
    width: 30%;
    text-align: right;
    font-size: 18px;
    padding-top: 4px;
  }

  .pn-tit {
    color: #000;
    font-size: 16px;
    padding-bottom 5px;
  }

  .pn-time {
    color: #999;
    font-size: 12px;
  }

  .c-green {
    color: #1AAD19;
  }

  .c-red {
    color: #EA281A;
  }

</style>
