<template>
  <div>
    <div class="p-tab">
      <div class='p-show'></div>
      <div class="m-navbar">
        <div class="m-navbar-item" :class="{'m-navbar-item-on':tabIndex==0}" @tap="changeTab(0)">
          商品介绍
        </div>
        <div class='p-navbar'></div>
        <div class="m-navbar-item" :class="{'m-navbar-item-on': tabIndex==1}" @tap="changeTab(1)">
          规格参数
        </div>
      </div>
      <div v-if="tabIndex===0">
        <rich-text :nodes="Therichtext"></rich-text>
      </div>
      <div class="g-flex-fott" v-if="tabIndex===1">
        <div class="table">
          <block v-for="(item,index) in commonAttrLis" :key="index">
            <div class="tr bg-g">
              <div class="td">{{item.attributeName}}</div>
              <div class="r-td">{{item.valueName}}</div>
            </div>
          </block>
        </div>
      </div>
      <div class='show'></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      commonAttrLis: {type: Array},
      Therichtext: {},
      tabIndex: {}
    },
    methods: {
      changeTab(index) {
        this.$emit('update:tabIndex', index);
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
</style>
