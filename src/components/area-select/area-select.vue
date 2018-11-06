<template>
  <div class="shadow-fixed-help" v-if="visible">
    <div class="mask"></div>
    <div class="bomb-help">
      <div class="btn-wrapper">
        <text @tap="close()" class="btn-cancel">取消</text>
        <text class="btn-confirm" @tap="confirm()">确定</text>
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
<script type="text/ecmascript-6">
  import {getAreaListByPid} from 'api/index';

  /**
   * 省市区级联
   */
  export default {
    name: 'area-select',
    props: {
      visible: {type: Boolean}, // 是否显示省市区
      provinceId: {type: String},
      cityId: {type: String},
      districtId: {type: String}
    },
    data() {
      return {
        value: [], // 选中省市区的索引
        provinces: [],
        citys: [],
        areas: []
      };
    },
    methods: {
      confirm() {
        this.$emit('changeArea', this.provinces[this.value[0]], this.citys[this.value[1]], this.areas[this.value[2]]);
      },
      close() {
        this.$emit('close');
      },
      /**
       * 获取初始化信息
       * @returns {Promise.<void>}
       */
      async getData() {
        this.provinces = await this.getAreaList({type: 'PROVINCE', pid: 86});
        let indexList = [0, 0, 0];
        let selectedProvinceId;
        // 判断是否有省id 传递过来，如果有的话，则定位到之前选中的省
        if (this.provinceId !== '') {
          selectedProvinceId = this.provinceId;
          this.provinces.forEach((item, index) => {
            if (item.id === this.provinceId) {
              indexList[0] = index;
            }
          });
        } else {
          indexList[0] = 0;
          selectedProvinceId = this.provinces[0].id;
        }
        this.citys = await this.getAreaList({type: 'CITY', pid: selectedProvinceId});

        // 判断是否有市id 传递过来，如果有的话，则定位到之前选中的市
        let selectedCityId;
        if (this.cityId !== '') {
          selectedCityId = this.cityId;
          this.citys.forEach((item, index) => {
            if (item.id === this.cityId) {
              indexList[1] = index;
            }
          });
        } else {
          indexList[1] = 0;
          selectedCityId = this.citys[0].id;
        }

        this.areas = await this.getAreaList({type: 'DISTRICT', pid: selectedCityId});
        // 判断是否有区id 传递过来，如果有的话，则定位到之前选中的区
        if (this.districtId !== '') {
          this.areas.forEach((item, index) => {
            if (item.id === this.districtId) {
              indexList[2] = index;
            }
          });
        } else {
          indexList[2] = 0;
        }
        setTimeout(() => {
          this.value = indexList;
        }, 10);
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
      // 处理省市县联动逻辑
      async cityChange(e) {
        let value = e.target.value;
        let provinceIndex = value[0];
        let cityIndex = value[1];
        // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
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
      }
    },
    onLoad() {
      this.getData();
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .shadow-fixed-help {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 109;
    display: block;
    overflow: hidden;
  }

  .shadow-fixed-help .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: rgba(0, 0, 0, .6) !important;
    filter: Alpha(opacity = 60);
    background: #000;
    display: block;
  }

  .bomb-help {
    height: 40vh;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    background: #fff;
  }

  .btn-wrapper {
    height: 10%;
    width: 90%;
    margin: 0 auto;
    margin-top: rpx(10);
    font-size: 14px;
  }

  .btn-cancel {
    text-decoration: underline
    color: #808080;
  }

  .btn-confirm {
    float: right;
    text-decoration: underline
    color: #62BC4A;
  }

  .picker-item {
    line-height: rpx(70);
    margin-left: rpx(5);
    margin-right: rpx(5);
    text-align: center;
    font-size: rpx(24);
  }
</style>
