<template>
  <div v-html="content"></div>
</template>
<script type="text/ecmascript-6">
  import {fetchRegisterAgreement} from 'api/index.js';
  /*
  * 注册协议
  * */
  export default {
    name: 'register-agreement',
    data() {
      return {
        content: ''
      };
    },
    methods: {
      async init() {
        let res = await fetchRegisterAgreement({systemType: 'SMALL_PROGRAM'});
        this.content = res.result[0].description;
      }
    },
    onShow() {
      this.init();
    }
  };
</script>
