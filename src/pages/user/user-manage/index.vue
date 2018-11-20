<template>
  <div class='wrapper'>
    <div class='m-via'>
      <div class='u-via'>头像</div>
      <div class='via-m' @tap='changeHeadImg'>
        <image class='via-u' :src="memberUserInfo.user.avatar"/>
      </div>
    </div>
    <div class='m-address'>
      <div class='u-1'>
        <div class='u-via1'>昵称</div>
        <input class='u-name' name="thename" v-model='memberUserInfo.member.sourceNickName' maxlength='20'/>
      </div>
      <div class='u-1'>
        <div class='u-via1'>姓名</div>
        <input class='u-name' name="thename" v-model="memberUserInfo.user.name" maxlength='20'/>
      </div>
      <picker @change="changeSex" :range="sexList">
        <div class='u-1'>
          <div class='u-via1'>性别</div>
          <div class='u-sex'>{{memberUserInfo.member.sexName}}</div>
          <image :src="arrowsRight" class='via-m-u3'/>
        </div>
      </picker>
      <picker mode="date" :value="memberUserInfo.member.birthDay" :end="endTime" @change="changBirthDay">
        <div class='u-2'>
          <div class='u-via1'>生日</div>
          <div class='u-happboth'>{{memberUserInfo.member.birthDay}}</div>
          <image :src="arrowsRight" class='via-m-u4'/>
        </div>
      </picker>
    </div>
    <div class='m-address'>
      <navigator url="/pages/user/address-list/main" class="m-cell m-cell-access">
        <div class="m-cell-bd m-cell-primary">
          <p>收货地址</p>
        </div>
        <text class="m-cell-ft"></text>
      </navigator>
    </div>
    <div class='m-address'>
      <div class='btn-save' @tap='save()'>保存</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 资料.地址管理
  * */
  import {fetchUserInfo, changeAvatar, updateMember} from 'api/index.js';
  import config from 'public/config/index.js';

  export default {
    name: 'user-manage',
    data() {
      return {
        arrowsRight: require('public/images/arrows-right.png'),
        defaultHead: require('public/images/default-head.png'),
        sexList: ['女', '男'],
        userInfo: {},
        memberUserInfo: {
          user: {},
          member: {}
        }
      };
    },
    computed: {
      endTime() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth() + 1; // 月
        let day = date.getDate(); // 日
        return year + '-' + month + '-' + day;
      }
    },
    methods: {
      /**
       * 保存
       */
      async save() {
        let birthDay = this.memberUserInfo.member.birthDay.split('-');
        let params = {
          passportId: this.userInfo.id,
          id: this.memberUserInfo.member.id,
          rowVersion: this.memberUserInfo.member.rowVersion,
          name: this.memberUserInfo.user.name,
          birthYear: birthDay[0],
          birthMonth: birthDay[1],
          birthDate: birthDay[2],
          sex: this.memberUserInfo.member.sexName === '女' ? 'FEMALE' : 'MALE',
          sourceNickName: this.memberUserInfo.member.sourceNickName,
          isStrict: true
        };
        let res = await updateMember(params);
        if (res.firstErrorMessage === '') {
          wx.showToast({
            title: '更新成功',
            duration: 3000
          });
          setTimeout(() => {
            this.$bridge.link.goUserIndex();
          }, 1500);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
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
                    userId: this.memberUserInfo.member.userId, // 用户ID
                    id: this.memberUserInfo.member.userId
                  };
                  let res = await changeAvatar(params);
                  if (res.firstErrorMessage === '' && res.result === '1') {
                    this.memberUserInfo.user.avatar = SuccessInfo.url;
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
       * 改变日期
       */
      changBirthDay(e) {
        this.memberUserInfo.member.birthDay = e.target.value;
      },
      /**
       * 改变性别
       */
      changeSex(e) {
        let str = parseInt(e.target.value) === 0 ? '女' : '男';
        this.memberUserInfo.member.sexName = str;
      },
      /**
       * 获取用户信息
       * @returns {Promise.<void>}
       */
      async getUserInfo() {
        this.isLoading = true;
        let operatingUnitId = this.$bridge.storage.get('operatingUnitId');
        let params = {
          passportId: this.userInfo.id,
          operatingUnitId: operatingUnitId,
          systemType: 'B2C',
          deviceType: 'MOBILE',
          storeId: '986901391685849088'
        };
        let res = await fetchUserInfo(params, {isLoading: true});
        if (res.code === '21') {
          this.$bridge.link.goLogin();
          return false;
        }
        if (!res.user.avatar) {
          res.user.avatar = this.defaultHead;
        }
        if (res.member.sex === 'MALE') {
          res.member.sexName = '男';
        } else {
          res.member.sexName = '女';
        }
        res.member.birthDay = res.member.birthYear ? res.member.birthYear +
          '-' + (res.member.birthMonth < 10 ? ('0' + res.member.birthMonth) : res.member.birthMonth) +
          '-' + (res.member.birthDate < 10 ? ('0' + res.member.birthDate) : res.member.birthDate) : '1978-01-01';
        this.memberUserInfo = res;
        this.isLoading = false;
      }
    },
    onLoad() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.getUserInfo();
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
    width: rpx(128);
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
