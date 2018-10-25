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
  </div>
</template>

<script>
  import card from '@/components/card';

  export default {
    data() {
      return {
        inputVal: '',
        inputShowed: false,
        inputFocus: true
      };
    },

    components: {
      card
    },
    computed: {},
    watch: {},
    methods: {
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
        if (this.inputVal.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入商品名称'});
          return false;
        }
      }
    },
    onShow() {
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  @import "~weui-wxss/dist/style/widget/weui-searchbar/weui-searchbar.wxss";
</style>
