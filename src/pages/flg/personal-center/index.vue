<template>
  <div class='wrapper'>
    <div class='m-via'>
      <div class='u-via'>修改头像</div>
      <div class='via-m' @tap='changeHeadImg'>
        <image class='via-u' :src="wfxData.avatarUrl"/>
      </div>
    </div>
    <div class='m-address'>
      <div class='u-1'>
        <div class='u-via1'>芳聊馆名称</div>
        <input class='u-name' name="thename" v-model='wfxData.storeName' maxlength='10'/>
      </div>
      <div class='u-1'>
        <div class='u-via1'>个性签名</div>
        <input class='u-name' name="thename" v-model="wfxData.storeIntroduction" maxlength='20'/>
      </div>
    </div>
    <div class='m-address'>
      <div class='btn-save' @tap='save()'>保存</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 芳聊馆---个人资料
  * */
  import {fetchWFXMember, changeAvatar, updateWFXStore} from 'api/index.js';
  import config from 'public/config/index.js';

  export default {
    name: 'user-manage',
    data() {
      return {
        arrowsRight: require('public/images/arrows-right.png'),
        defaultHead: require('public/images/default-head.png'),
        userInfo: {},
        wfxData: {}
      };
    },
    methods: {
      /**
       * 更换图片
       */
      changeHeadImg() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          success: (res) => {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            let tempFilePaths = res.tempFilePaths;
            let tempFiles = res.tempFilePaths[0].length; // 总长度
            let fileName = res.tempFilePaths[0].lastIndexOf('.'); // 取到文件名开始到最后一个点的长度
            let suffix = res.tempFilePaths[0].substring(fileName + 1, tempFiles); // 截取
            wx.uploadFile({
              url: config.uploadFileone + '?passportId=' + this.userInfo.id,
              filePath: tempFilePaths[0],
              name: 'file',
              header: {'Content-Type': 'application/x-www-form-urlencoded'},
              formData: {
                'ext': suffix, // 文件后缀
                'name': tempFilePaths[0], // 文件名称
                'type': 'AVATAR'// 写死的值
              },
              success: async (data) => {
                if (data.errMsg === 'uploadFile:ok') {
                  let SuccessInfo = JSON.parse(data.data);
                  let params = {
                    passportId: this.userInfo.id,
                    avatarId: SuccessInfo.id, // data为5.2.1接口返回数据
                    userId: this.userInfo.userId, // 用户ID
                    id: this.userInfo.userId
                  };
                  let res = await changeAvatar(params);
                  if (res.firstErrorMessage === '' && res.result === '1') {
                    this.wfxData.avatarUrl = SuccessInfo.url;
                    this.$bridge.dialog.alert({content: '修改成功'});
                  } else {
                    this.$bridge.dialog.alert({content: res.firstErrorMessage});
                  }
                }
              }
            });
          }
        });
      },
      /**
       * 保存
       */
      async save() {
        let params = {
          passportId: this.userInfo.id,
          storeId: this.wfxData.storeId,
          storeName: this.wfxData.storeName,
          storeIntroduction: this.wfxData.storeIntroduction
        };
        let res = await updateWFXStore(params);
        if (res.firstErrorMessage === '') {
          wx.showToast({
            title: '更新成功',
            duration: 3000
          });
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 获取微分销的信息
       */
      async fetchWFXMember() {
        let res = await fetchWFXMember({id: this.userInfo.memberId, passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          this.wfxData = res.wfxMember;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onLoad() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.fetchWFXMember();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body, html {
    background-color: rgb(244, 244, 244)
  }

  .wrapper {
    background-color: rgb(244, 244, 244);
    font-size: rpx(32);
  }

  .m-address {
    margin-top: rpx(20);
  }

  .m-cell-ft {
    position: relative;
    left: -10rpx;
    top: rpx(2);
    height: rpx(24);
    width: rpx(13.4);
    padding-left: rpx(20);
  }

  .m-via {
    margin-top: rpx(21);
    height: rpx(160);
    display: flex;
    background-color: white;
  }

  .u-via {
    padding-left: rpx(30);
    line-height: rpx(160);
  }

  .u-via1 {
    padding-left: rpx(30);
    line-height: rpx(100);
    width: rpx(200);
  }

  .via-m {
    display: flex;
  }

  .via-u {
    height: rpx(100);
    width: rpx(100);
    margin-left: rpx(472);
    margin-top: rpx(30);
  }

  .via-m-u3 {
    height: rpx(24);
    width: rpx(14);
    position: relative;
    top: rpx(39);
    left: rpx(503);
  }

  .via-m-u4 {
    height: rpx(24);
    width: rpx(14);
    position: relative;
    top: rpx(39);
    left: rpx(341);
  }

  .u-1 {
    display: flex;
    height: rpx(100);
    background-color: white;
    border-bottom: rpx(1) solid rgb(244, 244, 244);
  }

  .u-2 {
    display: flex;
    height: rpx(100);
    background-color: white;
  }

  .u-name {
    text-align: right;
    line-height: rpx(100);
    position: relative;
    height: rpx(100);
    width: rpx(505);
  }

  .u-sex {
    width: rpx(35);
    line-height: rpx(100);
    position: relative;
    left: rpx(468);
  }

  .u-happboth {
    text-align: right;
    line-height: rpx(100);
    position: relative;
    left: rpx(304);
    width: rpx(200);
  }

  .btn-save {
    width: 100%;
    margin: 0 auto;
    height: rpx(100);
    background-color: white;
    text-align: center;
    line-height: rpx(100);
    color: red;
  }

  .m-cell-bd switch {
    float: right;
  }

</style>
