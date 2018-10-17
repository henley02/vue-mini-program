<template>
  <div class='form-group'>
    <div class='label' v-if="label">{{label}}</div>
    <input :type="type" :class="inputClass" v-bind="$props" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
           :maxlength="maxlength"
           :placeholder="placeholder" :placeholderStyle="placeholderStyle"/>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'HInput',
    props: {
      label: String, // 标签
      name: [String, Number], // 原生属性
      value: [String, Number], // 原生属性
      type: {// 原生属性
        type: String,
        default: 'text'
      },
      readonly: Boolean, // 原生属性
      placeholder: String, // 原生属性
      disabled: Boolean, // 原生属性
      maxlength: [String, Number], // 原生属性
      minlength: [String, Number], // 原生属性
      autoComplete: {// 原生属性
        type: String,
        default: 'off'
      },
      inputClass: {// input Class
        type: String,
        default: ''
      },
      inputStyle: {// input Class
        type: Object
      },
      placeholderStyle: {
        type: String,
        default: 'color:#BDBDBD'
      }
    },
    methods: {
      handleInput(event) {
        let value = event.target.value;
        this.$emit('input', value);
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      handleBlur(event) {
        this.$emit('blur', event);
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";

  .form-group {
    height: rpx(90);
    margin: 0 rpx(30);
    position: relative;
    line-height: rpx(90);
    border-bottom: 1px solid #dddddd;
  }

  .form-group .label {
    font-size: rpx(32);
    color: #333;
    float: left;
    width: rpx(182);
    margin-left: rpx(19);
  }

  input {
    font-size: rpx(30);
    color: #333;
    padding-top: rpx(20);
  }
</style>
