<template>
  <div>
    <div class="m-cells m-cells-form">
      <div class="m-cell">
        <div class="m-cell-hd">
          <label class="u-label">收件人</label>
        </div>
        <div class="m-cell-bd">
          <input class="u-input" type='text' v-model="form.contactName" placeholder="您的姓名"
                 placeholder-style='font-size: 28rpx;color: #999;'/>
        </div>
      </div>
      <div class="m-cell">
        <div class="m-cell-hd">
          <label class="u-label">手机号码</label>
        </div>
        <div class="m-cell-bd">
          <input class="u-input" type="number" v-model="form.contactPhone" placeholder="您的号码" maxlength='11'
                 placeholder-style='font-size: 28rpx;color: #999;'/>
        </div>

      </div>
      <div class="m-cell m-cell-select-before" @tap="showbox">
        <div class="m-cell-hd">
          <label class="u-label">所在地区</label>
        </div>
        <div>
          <label class="label-a" :style="{color:area==='请选择'?'#999':'#000'}">{{area}}</label>
        </div>
        <image :src='arrowsRight' class='a-img'/>
      </div>
      <div class="m-cell">
        <div class="m-cell-hd">
          <label class="u-label">邮编</label>
        </div>
        <div class="m-cell-bd">
          <input class="u-input" type="number" v-model="form.postCode" placeholder="6位数邮编"
                 placeholder-style='font-size: 28rpx;color: #999;' maxlength='6'/>
        </div>
      </div>

    </div>
    <div class='t-text-are'>
      <textarea placeholder='请填写详细地址,不少于5个字' type="text" v-model="form.receiptAddress" fixed='true'
                minlength="5"></textarea>
    </div>
    <div class='r-cell-con'>
      <text>默认</text>
      <div class="right">
        <div class="is-default" :class="{active:form.isDefault}" @tap="changeDefault"></div>
        <text>设为默认</text>
      </div>
    </div>
    <div class='b-btn-sty'>
      <button class='btn' @tap='submitBtn'>保存</button>
    </div>

    <div class="picker-view" :animation="animationAddressMenu"
         :style="{visibility:addressMenuIsShow ? 'visible':'hidden'}">
      <div style="height:10% ;width:95%;margin-top:10rpx">
        <text @tap="cityCancel">取消</text>
        <text style="float: right" catchtap="citySure">确定</text>
      </div>
      <!--"可以显示默认的城市，使用后级联选择城市反应很慢就不使用了-->
      <picker-view style="width: 100%; height: 300px;" @change="cityChange" :value="value">
        <picker-view-column>
          <div v-for="(item,index) in provinces" :key="index" class="picker-item">
            {{item.name}}
          </div>
        </picker-view-column>
        <picker-view-column>
          <div v-for="(item,index) in citys" :key="index" class="picker-item">
            {{item.name}}
          </div>
        </picker-view-column>
        <picker-view-column>
          <div v-for="(item,index) in areas" :key="index" class="picker-item">
            {{item.name}}
          </div>
        </picker-view-column>
      </picker-view>
    </div>

  </div>
</template>

<script>
  /**
   * 收货地址添加、修改
   */
  import {fetchAddressById, addAddress, updateAddress, getAreaListByPid} from 'api/index';

  export default {
    data() {
      return {
        addressMenuIsShow: false,
        value: [0, 0, 0],
        provinces: [],
        citys: [],
        areas: [],
        areaInfo: '',

        id: '', // 收货地址id
        userInfo: {},
        arrowsRight: require('public/images/arrows-right.png'),
        form: {
          countryId: '', // 国家id
          countryName: '', // 国家名称
          provinceId: '', // 省
          provinceName: '', // 省名称
          cityId: '', // 市id
          cityName: '', // 市名称
          districtId: '', // 区id
          districtName: '', // 区名称
          postCode: '', // 邮编
          address: '', // 详细地址
          receiptAddress: '', // 详细地址

          contactName: '', // 收件人
          contactPhone: '', // 收件人联系方式

          receiptName: '', // 收件人
          receiptPhone: '', // 收件人联系方式

          id: '',
          isDefault: false, // 是否默认
          memberId: '', //
          memberName: '', // 注册人的手机号码

          rowVersion: '',
          tenantId: ''
        }
      };
    },
    computed: {
      area() {
        let str = this.form.provinceName + this.form.cityName + this.form.districtName;
        if (str === '') {
          return '请选择';
        } else {
          return str;
        }
      }
    },
    methods: {
      showbox() {
        this.startAddressAnimation(true);
      },
      cityCancel(e) {
        this.startAddressAnimation(false);
      },
      // 执行动画
      startAddressAnimation(isShow) {
        this.addressMenuIsShow = isShow;
      },
      // 处理省市县联动逻辑
      async cityChange(e) {
        let value = e.target.value;
        let provinceIndex = value[0];
        let cityIndex = value[1];
        // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
        console.log(1);
        if (this.value[0] !== provinceIndex) {
          this.value = [provinceIndex, 0, 0];
          this.citys = await this.getAreaList({type: 'CITY', pid: this.provinces[provinceIndex].id});
          this.areas = await this.getAreaList({type: 'DISTRICT', pid: this.citys[0].id});
        } else if (this.value[1] !== cityIndex) {
          // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
          this.value = [provinceIndex, cityIndex, 0];
          this.areas = await this.getAreaList({type: 'DISTRICT', pid: this.citys[cityIndex].id});
        } else {
          // 滑动选择了区
          this.value = e.target.value;
        }
      },
      async getData() {
        this.provinces = await this.getAreaList({type: 'PROVINCE', pid: 86});
        this.citys = await this.getAreaList({type: 'CITY', pid: this.provinces[0].id});
        this.areas = await this.getAreaList({type: 'DISTRICT', pid: this.citys[0].id});
      },
      getAreaList(params) {
        return new Promise(async (resolve, reject) => {
          let res = await getAreaListByPid(params);
          if (res.firstErrorMessage === '') {
            resolve(res.areaList);
          } else {
            resolve([]);
          }
        });
      },
      submitBtn() {
        let regEn = /[`~!@#$%^&*()_+<>?:"{},./\\;'[\]]/im;
        let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (this.form.contactName.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入您的姓名'});
          return;
        }
        if (this.form.contactPhone.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入您的手机号'});
          return;
        }
        if (!(/^1\d{10}$/.test(this.form.contactPhone))) {
          this.$bridge.dialog.alert({content: '请输入正确的手机号'});
          return;
        }
        if (this.area === '请选择') {
          this.$bridge.dialog.alert({content: '请选择所在地区'});
          return;
        }

        if (this.form.postCode.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入邮编'});
          return;
        }
        if (this.form.postCode.length < 6) {
          this.$bridge.dialog.alert({content: '请输入正确邮编'});
          return;
        }
        if (this.form.receiptAddress.length < 5) {
          this.$bridge.dialog.alert({content: '详细地址不少于5个字'});
          return;
        }
        if (regEn.test(this.form.receiptAddress) || regCn.test(this.form.receiptAddress)) {
          this.$bridge.dialog.alert({content: '请输入正确的详细地址'});
          return false;
        }
        let params = this.form;
        params.memberId = this.userInfo.memberId;
        params.passportId = this.userInfo.id;
        if (params.countryId === '') {
          params.countryId = '86';
          params.countryName = '中国';
        }
        console.log(params);
        if (this.id) {
          this.updateAddress(params);
        } else {
          this.addAddress(params);
        }
      },
      async addAddress(params) {
        let res = await addAddress(params);
        if (res.firstErrorMessage === '') {
          wx.showToast({
            title: '保存成功'
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        } else {
          this.$bridge.dialog.confirm({
            title: '提示',
            content: res.firstErrorMessage,
            confirmCallback: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              });
            }
          });
        }
      },
      async updateAddress(params) {
        let res = await updateAddress(params);
        if (res.firstErrorMessage === '' && res.result === '1') {
          wx.showToast({
            title: '修改成功',
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 2000);
            }
          });
        } else {
          wx.showToast({
            title: res.firstErrorMessage || '修改失败'
          });
        }
      },
      /**
       * 选中、取消默认
       */
      changeDefault() {
        this.form.isDefault = !this.form.isDefault;
      },
      async getAddressInfo() {
        if (this.id === '') {
          return;
        }
        let res = await fetchAddressById({ids: this.id.split(','), passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          this.form = res.result[0];
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      this.getData();
      this.id = this.$root.$mp.query.id || '';
      this.form = {
        countryId: '',
        countryName: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        postCode: '',
        address: '',
        receiptAddress: '',
        contactName: '',
        contactPhone: '',
        receiptName: '',
        receiptPhone: '',
        id: '',
        isDefault: false,
        memberId: '',
        memberName: '',
        rowVersion: '',
        tenantId: ''
      };
      this.userInfo = this.$bridge.storage.get('userInfo');
      if (this.id !== '') {
        this.getAddressInfo();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/css/login";
  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: red;
    /* placeholder字体大小  */
    font-size: 12px;
    /* placeholder位置  */
    text-align: right;
  }

  body {
    background-color: rgb(244, 244, 244)
  }

  page {
    position: fixed;
  }

  .t-text-are {
    width: 100%;
    height: auto;
    background-color: #fff;
    font-size: rpx(28);
    margin-bottom: rpx(20);
  }

  .m-cell-bd input {
    position: relative;
    right: rpx(35);
    font-size: rpx(28);

  }

  .m-cell-select-before {
    display: flex;
  }

  .t-text-are textarea {
    height: rpx(200);
    padding-top: rpx(30);
    margin: 0 rpx(30);
    overflow: hidden;
    position: relative;
  }

  .r-cell-con {
    width: 100%;
    height: rpx(84);
    background-color: #fff;
    font-size: rpx(28);
    overflow: hidden;
    margin-bottom: rpx(30);
  }

  .r-cell-con text:nth-child(1) {
    margin-left: rpx(30);
    line-height: rpx(84);
  }

  .r-cell-con text:nth-child(2) {
    margin-left: rpx(13);
  }

  .btn {
    background: #ea281a;
    border-radius: rpx(8);
    height: rpx(78);
    color: #fff;
    font-size: rpx(32);
    width: 93%;
  }

  .b-btn-sty {
    width: 100%;
    height: rpx(100);
    line-height: rpx(100);
    text-align: center;
  }

  .label-a {
    font-size: rpx(28);
    color: #999999;
    position: relative;
    right: rpx(36);
  }

  .a-label {
    font-size: rpx(28);
    color: #333333;
    position: relative;
    right: rpx(30);

  }

  .m-cell {
    border-bottom: 1 rpx solid #EEEEEE;
  }

  .a-img {
    width: rpx(20);
    height: rpx(30);
    position: relative;
    top: 0;
    left: rpx(374);
  }

  .red {
    color: red;
  }

  .green {
    color: green;
  }

  .r-cell-con .right {
    position: relative;
    right: rpx(-540)
    top: rpx(-66)
  }

  .is-default
    display: inline-block;
    background-image: url("../../../public/images/address/select.png");
    background-repeat: no-repeat
    background-size: 100% 100%
    height: rpx(35)
    width: rpx(35)
    position: relative;
    top: rpx(6)
    &.active
      background-image: url("../../../public/images/address/selected.png");

  .picker-view {
    width: 100%;
    display: flex;
    z-index: 12;
    background-color: #fff;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0 rpx;
    left: 0 rpx;
    height: 40vh;
  }

  .picker-item {
    line-height: rpx(70);
    margin-left: rpx(5);
    margin-right: rpx(5);
    text-align: center;
    font-size: rpx(24);
  }
</style>

