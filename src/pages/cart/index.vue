<template>
  <div>
    <div v-if="cartList.length>0 && cartList[0].cartList.length != 0">
      <div class='m-product-con' @tap='toggleEdit()'>{{!isEdit ? '编辑' : '完成'}}</div>
      <div class="c-cart">
        <div class="m-product-list" v-for="(item,index) in cartList" :key="index">
          <div class="m-shop-item">
            <div class="quan">
              <icon :type="item.IsCheck?'success':'circle'" :color="item.IsCheck?'#ea281a':'#d5d5d5'"
                    @tap='_bindStore(item)'/>
            </div>
            <div class="title">{{item.customName}}</div>
          </div>
          <div class='m-cell-content' v-for="(items,i) in item.cartList" :key="i">
            <div class='m-cell-img'>
              <!-- 控制选中按钮 -->
              <div class="m-cart-ck" @tap="_bindPro(items,index)">
                <icon :type="items.IsCheck?'success':'circle'" :color="items.IsCheck?'#ea281a':'#d5d5d5'"/>
              </div>
              <image :src='items.pictureUrl' class='img'/>
              <div class='c-detail'>
                <div class='introduce'>
                  <text style='overflow: hidden;text-overflow: ellipsis'>{{items.commodityTitle}}</text>
                </div>
                <div class='many'>
                  规格:{{items.itemSpec1AttributeName}} {{items.itemSpec1ValueName}}{{item.itemSpec2AttributeName}} {{items.itemSpec2ValueName}}{{items.itemSpec3AttributeName}} {{items.Spec3ValueName}}
                </div>
                <div class="c-limit">
                  <text></text>
                </div>
                <div class='m-many'>
                  <div class='numberaa'>￥
                    <text>{{items.unitPrice}}</text>
                  </div>
                  <div class="u-cart-num">
                    <div class="u-num-btn" catchtap="sub">-</div>
                    <input type="number" v-model="items.quantity" bindblur="writenum"/>
                    <div class="u-num-btn" catchtap="add">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class='m-cell-cont-bottom'></div>
        </div>
        <div class='show'></div>
      </div>
      <!-- 底部btn按钮 -->
      <div class="m-footer-btn">
        <div class="m-footer-btn-list" style='display:flex'>
          <div>
            <div class="m-cart" @tap="_bindCart">
              <icon :type="cal.isAllSelected?'success':'circle'" :color="cal.isAllSelected?'#EA281A':'#d5d5d5'"/>
            </div>
          </div>
          <div class="m-footer-btn-item m-cart-total">
            <div class='m-footer-btn-item-two'>已选（<label>{{cal.selectedCount}}</label>）</div>
            <div class='m-footer-btn-item-one'>
              <text>￥{{cal.totalPrice}}</text>
            </div>
          </div>
        </div>
        <div class="m-footer-btn-main" bindtap="submitorder" v-if="!isEdit">
          结算
        </div>
        <div class="m-footer-btn-main" @tap="del" v-else>
          删除
        </div>
      </div>
    </div>
    <navigator v-if="!isLoading && cal.totalCount===0" url="/pages/index/main" open-type="switchTab">
      <image :src='noDataImg' class='shoppingcart'></image>
      <div class='text'>购物车无商品</div>
    </navigator>
  </div>
</template>

<script>
  import {fetchCartList, cartBatchDelete} from 'api/index';

  export default {
    data() {
      return {
        noDataImg: require('public/images/gouwuche.png'),
        isEdit: false, // 是否是编辑
        isLoading: false,
        userInfo: {},
        id: 0, // 商品id
        price: 0, // 商品价钱
        quantity: 0, // 商品数量
        cartList: [], // 商品信息列表
        selectcardListgetInfo: [], // 选中的商品信息
        IsCheck: false,
        itemid: '', // 选中的商品id
        shopItem: [], // 选中的商品id集合
        totalpice: 0, // 总价
        totalnum: 0, // 选中的数量
        balance: '', // 库存
        linshi: [],
        IsShow: false,
        pid: 0,
        arr: []
      };
    },
    components: {},
    computed: {
      cal() {
        let selectedCount = 0;
        let totalPrice = 0;
        let totalCount = 0;
        this.cartList.forEach(item => {
          item.cartList.forEach(it => {
            if (it.IsCheck) {
              selectedCount++;
              totalPrice = this.add(totalPrice, this.mul(it.unitPrice, it.quantity));
            }
            totalCount++;
          });
        });
        return {
          selectedCount,
          totalPrice: totalPrice.toFixed(2),
          totalCount: totalCount,
          isAllSelected: totalCount === selectedCount
        };
      }
    },
    watch: {},
    methods: {
      del() { // 删除购物车
        if (this.cal.selectedCount === 0) {
          this.$bridge.dialog.alert({content: '请选择删除项'});
          return;
        }
        this.$bridge.dialog.confirm({
          title: '提示',
          content: '确认删除吗？',
          confirmCallback: async () => {
            let ids = [];
            this.cartList.forEach(item => {
              item.cartList.forEach(it => {
                if (it.IsCheck) {
                  ids.push(it.id);
                }
              });
            });
            let res = await cartBatchDelete({passportId: this.userInfo.id, ids});
            if (res.firstErrorMessage === '') {
              wx.showToast({
                title: '删除成功'
              });
              this.cartList.forEach(item => {
                for (let i = 0; i < item.cartList.length; i++) {
                  if (item.cartList[i].IsCheck) {
                    item.cartList.splice(i, 1);
                    i--;
                  }
                }
              });
              console.log(this.cartList);
            } else {
              this.$bridge.dialog.alert({content: res.firstErrorMessage});
            }
          },
          cancelCallback: () => {
          }
        });
      },
      _bindCart() { // 全选点击事件
        let isCheck = !this.cal.isAllSelected;
        this.cartList.forEach(item => {
          item.IsCheck = isCheck;
          item.cartList.forEach(it => {
            it.IsCheck = isCheck;
          });
        });
      },
      _bindPro(item, pIndex) { // 点击商品事件
        item.IsCheck = !item.IsCheck;
        let subSelected = this.cartList[pIndex].cartList.filter((it) => it.IsCheck);
        this.cartList[pIndex].IsCheck = subSelected.length === this.cartList[pIndex].cartList.length;
      },
      _bindStore(item) { // 点击门店事件
        item.IsCheck = !item.IsCheck;
        item.cartList.forEach(it => {
          it.IsCheck = item.IsCheck;
        });
      },
      toggleEdit() {
        this.isEdit = !this.isEdit;
      },
      async init() {
        this.isLoading = true;
        let params = {
          memberId: this.userInfo.memberId,
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          storeId: '986901391685849088',
          systemType: 'B2C',
          deviceType: 'MOBILE',
          passportId: this.userInfo.id
        };
        let res = await fetchCartList(params);
        if (res.firstErrorMessage === '') {
          res.supplierCartList.forEach((item) => {
            item.IsCheck = false;
            item.cartList.forEach(it => {
              it.IsCheck = false;
            });
          });
          this.cartList = res.supplierCartList;
          console.log(this.cartList);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
        this.isLoading = false;
      }
    },
    onShow() {
      this.cartList = [];
      this.isLoading = true;
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.init();
    },
    onLoad() {
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background: rgb(244, 244, 244);
  }

  .m-shop-item {
    border-bottom: rpx(1) solid #eee;
    height: rpx(90);
    display: flex;
    background: #FFFFFF;
    border-top: rpx(1) solid #eee;

  }

  .title {
    font-size: rpx(24);
    position: relative;
    top: rpx(30);
  }

  .title_nav {
    position: relative;
    overflow: hidden;
    height: rpx(74);
    background-color: #fff;
    line-height: rpx(68);
    margin-top: rpx(20);
    align-items: center;
  }

  .title_logo_img {
    width: rpx(40);
    height: rpx(40);
  }

  .quan {
    padding: rpx(25) rpx(20) rpx(25) rpx(30);
  }

  .title_img {
    width: rpx(20);
    height: rpx(30);
    padding-left: rpx(10);
  }

  .m-cell-img {
    display: flex;
    background: #FFFFFF;
  }

  .m-cell-img .img {
    width: rpx(178);
    height: rpx(178);
    margin: rpx(11);
  }

  .m-cell-img .introduce {
    width: rpx(362);
    font-size: rpx(28);
  }

  .c-detail {
    padding-left: rpx(15);
    border-bottom: rpx(1) solid #EEEEEE;
    width: rpx(368);
    padding-right: rpx(20);
    font-size: rpx(24);
  }

  .c-limit {
    color: #EA281A;
    margin: rpx(15) 0 rpx(24) 0;
  }

  .many {
    font-size: rpx(24);
    color: #999;
  }

  .numberaa {
    font-size: rpx(32);
    color: #ea281a;
    padding-top: rpx(6);

  }

  .m-many {
    display: flex;
    justify-content: space-between;
  }

  .m-cell-img .introduce {
    width: rpx(447);
    font-size: rpx(24);
    margin-bottom: rpx(10);
  }

  .m-cell-img .introduce text::after {
    font-weight: bold;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 20px 1px 45px;
    background: url(http://newimg88.b0.upaiyun.com/newimg88/2014/09/ellipsis_bg.png) repeat-y;
  }

  .m-cell-img .number {
    font-size: rpx(36);
    color: #ea281a;
    width: rpx(124);
  }

  .show {
    width: 100%;
    height: rpx(80);
  }

  /*商品数量加减*/

  .u-cart-num {
    position: relative;
    z-index: 2;
  }

  .u-cart-num {
    display: inline-block;
    border: rpx(1) solid #d5d5d5;
    height: rpx(52);
    line-height: rpx(52);
    border-radius: rpx(4);
    text-align: center;
    width: rpx(240);

  }

  .u-num-btn {
    float: left;
    width: rpx(79);
    font-size: rpx(32);
  }

  .u-cart-num input {
    float: left;
    width: rpx(80);
    height: rpx(54);
    border-left: rpx(1) solid #d5d5d5;
    border-right: rpx(1) solid #d5d5d5;
  }

  /* 底部结算按钮*/

  .m-footer-btn {
    height: rpx(96);
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    border-top: rpx(1) solid #EEEEEE;
    z-index: 3;
  }

  .m-footer-btn-list {
    width: rpx(523);
    height: rpx(96);
    position: relative;
    float: left;
  }

  .m-cart {
    padding: rpx(25);
  }

  .m-footer-btn-item {
    display: flex;
    justify-content: space-between;
    font-size: rpx(28);
    color: #888;
    height: 100%;
    padding: rpx(27) rpx(23);
    width: rpx(424);
    line-height: rpx(46);

  }

  .m-footer-btn-main {
    width: rpx(226);
    height: 100%;
    float: left;
    background-color: #EA281A;
    color: #fff;
    line-height: rpx(100);
    font-size: rpx(28);
    text-align: center;
  }

  .m-cart-del {
    line-height: rpx(70);
    font-size: rpx(32);
  }

  .m-footer-btn-item-one {
    color: #EA281A;
  }

  .m-footer-btn-item-two {
    color: #999;
  }

  .m-product-con {
    font-size: rpx(32);
    padding: rpx(20) 0 rpx(20) rpx(666);
    background: #fff;
    position: fixed;
    top: 0;
    z-index: 9;
    width: 100%;

  }

  .c-detail {
    padding: rpx(10) rpx(30) rpx(15) rpx(10);
    width: rpx(421);
    border-bottom: 1 rpx solid #eee;
  }

  .shoppingcart {
    padding-top: rpx(400);
    padding-left: rpx(290);
    height: rpx(171);
    width: rpx(171);
  }

  .text {
    padding-top: rpx(25);
    text-align: center;
    color: #333333;
    font-size: rpx(28);
  }

  .click-login {
    width: rpx(220);
    height: rpx(76);
    line-height: rpx(76);
    background-color: #ea281a;
    border-radius: rpx(8);
    color: #fff;
    margin-left: rpx(265);
    margin-top: rpx(60);
    font-size: rpx(32);
    text-align: center;

  }

  .m-cell-cont-bottom {
    width: 100%;
    height: rpx(20)
  }

  .c-cart {
    margin-top: rpx(80);
  }
</style>
