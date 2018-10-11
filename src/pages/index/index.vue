<template>
  <div class="container">
    <div class="search-wrapper">
      <div class="weui-search-bar" style="width: 100%">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input type="text" class="weui-search-bar__input" placeholder="搜索商品" v-model="inputVal"
                   @input="bindKeyInput(e)" confirm-type="search" @confirm="inputConfirm(event)"/>
            <div class="weui-icon-clear" v-if="inputVal.length > 0" @tap="clearInput">
              <icon type="clear" size="14"></icon>
            </div>
          </div>
          <label class="weui-search-bar__label" v-if="!inputShowed" @tap="toggleShowInput">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <div class="weui-search-bar__text">搜索商品</div>
          </label>
        </div>
        <div class="weui-search-bar__cancel-btn" v-if="inputShowed" @tap="toggleShowInput">取消</div>
      </div>
    </div>
    <div class="userinfo" @click.stop="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover"/>
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>

    <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model"/>
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy"/>
    </form>
    <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
  </div>
</template>

<script>
  import card from '@/components/card';

  export default {
    data() {
      return {
        inputVal: '',
        inputShowed: false,
        motto: 'Hello World',
        userInfo: {}
      };
    },

    components: {
      card
    },

    methods: {
      /**
       * 清空搜索框内容
       */
      clearInput() {
        this.inputVal = '';
      },
      /**
       * 显示隐藏搜索框
       */
      toggleShowInput() {
        this.inputVal = '';
        this.inputShowed = !this.inputShowed;
      },
      bindKeyInput(e) {
        console.log(this.inputVal);
      },
      inputConfirm(e) {
        console.log('确认');
        console.log(e);
      },
      bindViewTap() {
        this.$bridge.link.navigateTo('../logs/main');
      },
      async getUserInfo() {
        let res = await this.$bridge.user.getUserInfo();
        this.userInfo = res;
        // 调用登录接口
      },
      clickHandle(msg, ev) {
        console.log('clickHandle:', msg, ev);
      }
    },

    created() {
      // 调用应用实例的方法获取全局数据
      this.getUserInfo();
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~weui-wxss/dist/style/widget/weui-searchbar/weui-searchbar.wxss";
  .search-wrapper {
    display: flex;
    justify-content: center;
    padding: 5px 0;
    margin: 0 auto;
    width: 100%;
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;
  }

  input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: red;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: red;
  }

  input:-moz-placeholder { /* Mozilla Firefox 19+ */
    color: red;
  }

  input::-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: red;
  }

  input::-webkit-input-placeholder {
    text-align: center;
    color: red;
    font-size: 12px;
  }

  .abc {
    text-align: center;
    color: red;
    font-size: 12px;
  }

  .search-box {
    width: 90%;
    font-size: 12px;
    background: '#ccc';
    color: $color-text;
    border-radius: 15 rpx;
  }

  .userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .userinfo-avatar {
    width: 128 rpx;
    height: 128 rpx;
    margin: 20 rpx;
    border-radius: 50%;
  }

  .userinfo-nickname {
    color: #aaa;
  }

  .usermotto {
    margin-top: 150px;
  }

  .form-control {
    display: block;
    padding: 0 12px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
  }

  .counter {
    display: inline-block;
    margin: 10px auto;
    padding: 5px 10px;
    color: blue;
    border: 1px solid blue;
  }
</style>
