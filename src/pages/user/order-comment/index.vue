<template>
  <div>
    <div class='m-cell-content' v-for="(good,index) in goods" :key="index">
      <div class='m-cell-img'>
        <image :src='good.pictureUrl' class='img'/>
        <div class='introduce'>
          <div class='c-introduce'>{{good.commodityTitle}}</div>
          <div class='many'>{{good.itemSpec1AttributeName}}<span
            v-if="good.itemSpec1AttributeName && good.itemSpec1AttributeName!==''">:</span> {{good.itemSpec1ValueName}}
          </div>
        </div>
      </div>
      <div class="m-start">
        <div class='container'>
          <div class='evaluate_contant'>
            <!--外层循环控制有几个评价条目  -->
            <block v-for="(item,itemIndex) in evaluate_contant" :key="itemIndex">
              <div class='evaluate_item'>
                <div class='evaluate_title'>{{item}}</div>
                <!--星星评价  -->
                <div class='evaluate_box'>
                  <!--内层循环展示每个评价条目的星星  -->
                  <star :size="20" :score="good.score" @changeStar="changeStar" :id="good.id"></star>
                </div>
              </div>
            </block>
          </div>
        </div>
      </div>
      <div class='c-share'>
        <textarea placeholder='分享您的购物过程~' placeholder-style='font-size:28rpx;color: #999999;'
                  v-model='good.content' class='c-writing'></textarea>
      </div>
      <div class="m-upImg">
        <div class="m-upImg-item">
          <image :src="addFileImg" @tap="uploadImg"/>
        </div>
        <div class="m-upImg-item" style='background:#eee' v-for="(img,i) in imgList" :key="i">
          <image :src="img.filePath"/>
          <image class='c-icon' :src="deleteImg" @tap="delImg(img,i)"/>
        </div>
      </div>

      <div class='c-select' @tap="changeDefault(good)">
        <div class="is-default" :class="{active:good.isAnonymous}"></div>
        <div class='anonymity'>匿名评价</div>
      </div>
    </div>
    <div>
      <div class='c-btn' @tap="submit">提交</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 订单评论
  * */
  import {fetchCommentDetail, loginnewId, deleteUploadFile} from 'api/index';
  import star from 'components/star/star.vue';
  import config from 'public/config/index.js';

  export default {
    name: 'consumption-records',
    data() {
      return {
        addFileImg: require('public/images/user/addpicture.png'),
        deleteImg: require('public/images/user/delete.png'),
        userInfo: {},
        orderId: '',
        evaluate_contant: ['评分'],
        goods: [],
        imgList: [],
        id: ''
      };
    },
    components: {
      star
    },
    methods: {
      submit() {
        let values = [];
        for (let i = 0; i < this.goods.length; i++) {
          if (this.goods[i].score === 0) {
            if (this.goods.length > 1) {
              this.$bridge.dialog.alert({content: '第' + (i + 1) + '个商品未评分！'});
            } else {
              this.$bridge.dialog.alert({content: '商品未评分！'});
            }
            return false;
          } else if (this.goods[i].content === '') {
            if (this.goods.length > 1) {
              this.$bridge.dialog.alert({content: '第' + (i + 1) + '个商品评论内容不能为空！'});
            } else {
              this.$bridge.dialog.alert({content: '评论内容不能为空！'});
            }
            return false;
          } else if (this.goods[i].content.length < 5) {
            if (this.goods.length > 1) {
              this.$bridge.dialog.alert({content: '第' + (i + 1) + '个商品评论内容不能低于5个字！'});
            } else {
              this.$bridge.dialog.alert({content: '商品评论内容不能少于5个字！'});
            }
            return false;
          }

          let val = {
            id: this.id,
            content: this.goods[i].content,
            score: this.goods[i].score,
            isAnonymous: this.goods[i].isAnonymous,
            commodityId: this.goods[i].commodityId,
            commodityTitle: this.goods[i].commodityTitle,
            rowVersion: '1',
            orderHeadId: this.goods[i].orderHeadId,
            orderLineId: this.id,
            memberId: this.userInfo.memberId,
            storeId: '986901391685849088',
            operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
            isAddtion: this.goods[i].isAddtion,
            hasAddtion: this.goods[i].hasAddtion
          };
          if (this.imgList.length === 0) {
            val.hasAttachment = false;
          } else {
            val.hasAttachment = true;
          }
          values.push(val);
          console.log(values);
          var params = {
            method: 'orders.comments.store',
            commodityEvaluationCreates: values
          };
          requestService.request(params, function(res) {
            if (res.firstErrorMessage === '') {
              if (res.resultCount > 0) {
                this.$bridge.dialog.alert({
                  content: '评论发布成功',
                  confirmCallback: () => {
                    wx.navigateBack({
                      delta: -1
                    });
                  }
                });
              }
            } else {
              this.$bridge.dialog.alert({content: '评论发布失败！'});
            }
          });
        }
      },
      /**
       * 获取主键
       * @returns {Promise.<void>}
       */
      async getPrimaryKey() {
        let res = await loginnewId({});
        this.id = res;
      },
      /**
       * 删除图片
       */
      async delImg(item, index) {
        let res = await deleteUploadFile({attachmentId: item.id, passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          this.imgList.splice(index, 1);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 上传图片
       */
      uploadImg() {
        wx.chooseImage({
          count: 5,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            let tempFilePaths = res.tempFilePaths;
            for (let i = 0; i < tempFilePaths.length; i++) {
              if (this.imgList.length > 4) {
                this.$bridge.dialog.alert({content: '最多支持上传5张图片'});
                break;
              }
              let fileName = tempFilePaths[i].substring(tempFilePaths[i].lastIndexOf('/') + 1, tempFilePaths[i].length);
              let fileExt = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
              wx.uploadFile({
                url: config.uploadFile + '?passportId=' + this.userInfo.id,
                filePath: tempFilePaths[i],
                name: 'file',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                formData: {
                  'method': 'api.foundation.attachment.upload',
                  'Ext': fileExt,
                  'FileName': fileName,
                  'businessId': this.id,
                  'businessType': 'COMMODITY_COMMENT'
                },
                success: (info) => {
                  let ImgData = JSON.parse(info.data);
                  this.imgList.push(ImgData.attachment);
                },
                fail: (e) => {
                  this.$bridge.dialog.alert({title: '提示', content: '上传失败'});
                }
              });
            }
          }
        });
      },
      /**
       * 点击是否匿名
       */
      changeDefault(good) {
        good.isAnonymous = !good.isAnonymous;
      },
      /**
       * 评价的星星
       * @param score
       * @param id
       */
      changeStar(score, id) {
        this.goods.forEach((item) => {
          if (item.id === id) {
            item.score = score;
          }
        });
      },
      async init() {
        let params = {
          id: this.orderId,
          passportId: this.userInfo.id
        };
        let res = await fetchCommentDetail(params);
        if (res.firstErrorMessage === '') {
          res.order.orderLineList.forEach((item) => {
            item.imgs = [];
            item.content = '';
            item.score = 0;
            item.isAnonymous = false;
            item.isAddtion = false;
            item.hasAttachment = false;
            item.hasAddtion = false;
            item.stars = [0, 1, 2, 3, 4];
          });
          this.goods = res.order.orderLineList;
          console.log(this.goods);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onLoad(options) {
      this.orderId = options.orderId;
      if (!this.orderId) {
        // 订单异常点击确定后返回上一个页面
        this.$bridge.dialog.alert({
          content: '订单异常！',
          confirmCallback: () => {
            wx.navigateBack();
          }
        });
      } else {
        this.userInfo = this.$bridge.storage.get('userInfo');
        this.getPrimaryKey();
        this.init();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .is-default
    display: inline-block;
    background-image: url("../../../public/images/address/select.png");
    background-repeat: no-repeat
    background-size: 100% 100%
    height: rpx(40)
    width: rpx(40)
    position: relative;
    &.active
      background-image: url("../../../public/images/address/selected.png");

  .m-cell-content {
    background: #fff;
  }

  .m-cell-img {
    margin-top: rpx(21);
    display: flex;
  }

  .m-cell-img .img {
    width: rpx(178);
    height: rpx(178);
    margin: rpx(30);
  }

  .m-cell-img .introduce {
    font-family: PingFang-SC-Regular;
    font-size: rpx(24);
    margin-top: rpx(49);

  }

  .m-cell-img .many {
    padding-top: rpx(15);
    color: #999;
  }

  .m-start {

  }

  .m-label {
    font-size: rpx(28);
    padding-right: rpx(30);
    display: inline-block;
  }

  .c-introduce {
    width: rpx(458);
    height: auto;
  }

  .m-startBox {
    display: inline-block;
    vertical-align: middle;
  }

  .m-startBox image {
    padding: 0 5px;
    height: rpx(45);
    width: rpx(45);
  }

  .c-share {
    width: 100%;
    height: auto;
    font-size: rpx(28);
  }

  .c-writing {
    height: rpx(200);
    padding-top: rpx(30);
    margin: 0 rpx(30);
    overflow: hidden;
    position: relative;
  }

  .m-text textarea {
    width: 100%;
    height: 100%;
  }

  .m-upImg {
    padding: rpx(20) 0 rpx(40) rpx(30);
  }

  .m-upImg-item {
    width: rpx(150);
    height: rpx(150);
    display: inline-block;
    margin-right: rpx(30);
    position: relative;
    margin-top: rpx(20);
  }

  .m-upImg-item image {
    width: 100%;
    height: 100%;
  }

  .c-icon {
    position: absolute;
    top: 0;
    right: 0;
    height: rpx(35) !important;
    width: rpx(35) !important;
  }

  .c-select {
    padding: rpx(26) rpx(548) rpx(24) rpx(30);
    display: flex;
    margin-top: rpx(20);
    background: #fff;
  }

  .c-select image {
    width: rpx(40);
    height: rpx(40);
    padding-right: rpx(20);
  }

  .anonymity {
    margin-left: 10px;
    font-size: rpx(28);
    color: #333;
  }

  .c-btn {
    color: #fff;
    background: #ea281a;
    height: rpx(80);
    line-height: rpx(80);
    text-align: center;
    margin: rpx(30);
    font-size: rpx(32);
    border-radius: rpx(8);
  }

  /*评价区域  */

  .container .evaluate_contant .evaluate_item {
    font-size: rpx(30);
    color: gray;
    margin-left: rpx(33);
    display: flex;
  }

  /*评价标题  */

  .container .evaluate_contant .evaluate_item .evaluate_title {
    display: inline-block;
    margin-top: rpx(2);
    width: rpx(100);
  }

  /*评价盒子  */

  .container .evaluate_contant .evaluate_item .evaluate_box {
    position: relative;
    width: 100%;
    display: inline-block;
  }

  /*星星评价的每个图片  */

  .container .evaluate_contant .evaluate_item .evaluate_box .star-image {
    position: absolute;
    width: rpx(40);
    height: rpx(40);
  }

  /*星星的左边和右边区域<点击左边半个星星，点击右边整个星星>  */

  .container .evaluate_contant .evaluate_item .evaluate_box .star-image .item {
    position: absolute;
    top: 0;
    width: rpx(20);
    height: rpx(40);
  }

  /*按钮  */

  .container .evaluate_contant .submit_button {
    height: rpx(60);
    font-size: rpx(30);
    line-height: rpx(60);
    margin: rpx(20);
  }

</style>
