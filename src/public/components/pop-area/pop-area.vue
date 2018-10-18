<template>
  <div class="shadow-fixed show" v-if="visible">
    <div class="mask"></div>
    <div class="bomb-address">
      <div class="bomb-address-title">
        配送至
        <i class="bomb-address-close" @click="close()"></i>
      </div>
      <div class="address-body">
        <dl class="address-tab">
          <dd :class="{'current':tabIndex==index}" v-for="(item,index) in selected" :key="index"
              @click="tabChange(item,index)">
            <span>{{item.name}}</span></dd>
        </dl>
        <div class="address-list">
          <ul>
            <li :class="{'on':item.active}" :value="item.id" v-for="(item,index) in areList" :key="index"
                @click="select(item)">
              {{item.name}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * 省市区 联动
   */
  export default {
    name: 'pop-area',
    props: {
      visible: {type: Boolean},
      cityData: {type: Array},
      formData: {type: Object}
    },
    data() {
      return {
        fid: 1,
        selected: [],
        tabIndex: 0
      };
    },
    computed: {
      areList() {
        let arr = this.cityData.filter(item => item.fid === this.fid);
        if (arr.length === 0) {
          this.selected.pop();
          if (this.selected.length !== 0) {
            this.tabChange(this.selected[0], 0);
            this.$emit('changeArea', this.selected);
          }
          this.close();
        }
        arr.forEach(item => {
          if (this.selected.filter(it => it.id === item.id).length > 0) {
            item.active = true;
          } else {
            item.active = false;
          }
        });
        return arr;
      }
    },
    methods: {
      tabChange(item, tabIndex) { // 切换tab
        this.fid = item.fid;
        this.tabIndex = tabIndex;
      },
      select(item) { // 省市区 选择
        if (this.selected.length !== (this.tabIndex + 1)) { // 是否选中的最后一个
          this.selected.splice(this.tabIndex, this.selected.length - this.tabIndex, item);
          this.selected.push({
            name: '请选择',
            id: '',
            fid: item.id
          });
        } else {
          this.selected.splice(this.selected.length - 1, 0, item);
          this.selected[this.selected.length - 1].fid = item.id;
        }
        this.fid = item.id;
        this.tabIndex++;
      },
      close() {
        this.$emit('update:visible', false);
      }
    },
    created() {
      // 如果没有选中省市区
      if (this.formData.provinceId === '' && this.formData.cityId === '' && this.formData.zoneId === '') {
        this.selected.push({name: '请选择', id: '', fid: 1});
      } else {
        this.selected = [...this.selected, ...[
          {
            'name': this.formData.provinceName,
            'id': this.formData.provinceId,
            'fid': 1
          },
          {
            'name': this.formData.cityName,
            'id': this.formData.cityId,
            'fid': this.formData.provinceId
          },
          {
            'name': this.formData.zoneName,
            'id': this.formData.zoneId,
            'fid': this.formData.cityId
          }
        ]];
      }
    }
  };
</script>
