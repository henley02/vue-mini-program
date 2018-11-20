<template>
  <div>
    <div class="m-refund">
      <div class='m-refund-require'>
        <div class='m-refund-text'>请选择服务类型<text>*</text></div>
        <div class='m-input'>
          <picker @change="changeServiceType" :value="index" :range="serviceType" :rangeKey="'name'">
            <div class="picker">
              <input placeholder='请选择您的服务类型' class='u-input' disabled='true'
                     :value='serviceText'/>
            </div>
          </picker>
          <image :src='arrowsRightImg' class='image'/>
        </div>
      </div>
      <div class='m-refund-require'>
        <div class='m-refund-text'>退款退货原因<text>*</text></div>
        <div class='m-input'>
          <picker mode="selector" @change="changeRefundReason" :value="index" :range="refundReasonValue"
                  :rangeKey="'name'">
            <div class="picker">
              <input class='u-input' placeholder='请选择您的退款退货原因'
                     :value='refundReasonText' disabled='true'/>
            </div>
          </picker>
          <image :src='arrowsRightImg' class='image'/>
        </div>
      </div>
      <div class='m-refund-require'>
        <div class='m-refund-text'>退款金额<text>*</text></div>
        <div class='m-input'>
          <input :placeholder="'最多￥'+maxRefundAmount+'，含邮费￥'+orderHead.freightFee" v-model="requestedAmount"
                 class='u-input' type="number"/>
        </div>
      </div>
      <div class='m-refund-require'>
        <div class='m-refund-text'>手机号码<text>*</text></div>
        <div class='m-input'>
          <input :placeholder='orderHead.contactPhone' class='u-input' v-model="orderHead.contactPhone" maxlength="11"/>
        </div>
      </div>
      <div class='m-refund-require'>
        <div class='m-refund-text'>退款说明</div>
        <div class='m-input'>
          <input placeholder='退货说明，非必填' class='u-input' v-model='refundRemark'/>
        </div>
      </div>
      <div class='m-refund-require'>
        <div class='m-refund-text'>上传凭证</div>
        <div class="m-upImg">
          <div class="m-upImg-item">
            <image :src="addFileImg" @tap="uploadImg"/>
          </div>
          <div class="m-upImg-item" style='background:#eee' v-for="(item,index) in imgList"
               :key="index">
            <image mode="aspectFit" :src="item.filePath"/>
            <image class='c-icon' :src="deleteImg" @tap="delImg(item,index)"/>
          </div>
        </div>
      </div>
    </div>
    <button class='b-btn' @tap='submit'>提交</button>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 我的账户
  * */
  import {fetchOrderRefundInfo, deleteUploadFile, applyRefund} from 'api/index';
  import config from 'public/config/index.js';

  export default {
    name: 'consumption-records',
    data() {
      return {
        userInfo: {},
        addFileImg: require('public/images/user/addpicture.png'),
        deleteImg: require('public/images/user/delete.png'),
        arrowsRightImg: require('public/images/arrows-right.png'),
        serviceType: [],
        selectedServiceTypeIndex: -1,
        selectedRefundReasonIndex: -1,
        refundReasonValue: [ // 退款、退货的原因
          {name: '发错货', type: 'SHIPMENT_ERROR'},
          {name: '七天无理由退货', type: 'SEVEN_NO_REASON_RETURN_EXCHANGE'},
          {name: '拍错重拍', type: 'RE_BUY'},
          {name: '物流问题', type: 'LOGISTICS_PROBLEM'},
          {name: '服务问题', type: 'SERVICE_PROBLEM'},
          {name: '售后补偿', type: 'AFTER_SALES_COMPENSATE'},
          {name: '客户补偿', type: 'CUSTOMER_COMPENSATE'},
          {name: '仓库补偿', type: 'STOREHOUSE_COMPENSATE'},
          {name: '运营补偿', type: 'OPERATION_COMPENSATE'},
          {name: '其它原因', type: 'OTHER'}
        ],
        lineId: '',
        orderId: '',
        isAllRefund: null,
        maxRefundAmount: 0, // 最大可退金额
        refundHeadId: '',
        orderHead: {},
        orderLineList: [],
        requestedAmount: '', // 退款金额
        imgList: [], // 凭证图片
        refundRemark: '' // 退货说明
      };
    },
    computed: {
      refundReasonText() {
        if (this.selectedRefundReasonIndex === -1) {
          return '';
        } else {
          return this.refundReasonValue[this.selectedRefundReasonIndex].name;
        }
      },
      serviceText() {
        if (this.selectedServiceTypeIndex === -1) {
          return '';
        } else {
          return this.serviceType[this.selectedServiceTypeIndex].name;
        }
      }
    },
    methods: {
      async submit() {
        if (this.selectedServiceTypeIndex === -1) {
          this.$bridge.dialog.alert({content: '请选择服务类型！'});
          return false;
        }
        if (this.selectedRefundReasonIndex === -1) {
          this.$bridge.dialog.alert({content: '请选择退款退货原因！'});
          return false;
        }
        if (!this.requestedAmount) {
          this.$bridge.dialog.alert({content: '请输入退款金额！'});
          return false;
        }
        if (this.requestedAmount > this.maxRefundAmount) {
          this.$bridge.dialog.alert({content: '请输入正确退款金额！'});
          return false;
        }
        let params = {
          id: this.refundHeadId,
          passportId: this.userInfo.id,
          orderHeadId: this.orderId,
          type: this.serviceType[this.selectedServiceTypeIndex].type,
          refundReason: this.refundReasonValue[this.selectedRefundReasonIndex].type,
          requestedAmount: this.requestedAmount,
          contactPhone: this.orderHead.contactPhone,
          refundRemark: this.refundRemark,
          isAllRefund: this.isAllRefund,
          refundLineCommitRequestList: [{
            orderLineId: this.lineId,
            quantity: this.orderLineList[0].quantity
          }]
        };
        let res = await applyRefund(params);
        if (res.firstErrorMessage === '') {
          this.$bridge.dialog.alert({
            content: '提交成功',
            confirmCallback: () => {
              wx.navigateBack({
                delta: 2
              });
            }
          });
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
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
                  'businessId': this.refundHeadId,
                  'businessType': 'REFUND',
                  'businessCategory': 'REASON'
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
       * 改变服务类型
       */
      changeServiceType(e) {
        this.selectedServiceTypeIndex = e.target.value;
      },
      /**
       * 改变退货原因
       */
      changeRefundReason(e) {
        this.selectedRefundReasonIndex = e.target.value;
      },
      async getData() {
        let params = {
          orderHeadId: this.orderId,
          orderLineIdList: this.lineId.split(','),
          passportId: this.userInfo.id
        };
        let res = await fetchOrderRefundInfo(params);
        if (res.firstErrorMessage === '') {
          if (res.orderHead) {
            this.isAllRefund = res.isAllRefund;
            this.maxRefundAmount = res.maxRefundAmount;
            this.refundHeadId = res.refundHeadId;
            this.orderHead = res.orderHead;
            this.orderLineList = res.orderLineList;
          }
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onLoad(options) {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      if (options.orderStatus === '待发货') {
        this.serviceType = [{name: '退款', type: 'REFUND'}];
      } else {
        this.serviceType = [{name: '退款', type: 'REFUND'}, {name: '退款退货', type: 'REFUND_RETURN'}];
      }
      this.orderId = options.orderId;
      this.lineId = options.lineId;
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.getData();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .m-refund {
    background-color: rgb(244, 244, 244);
    font-size: rpx(28);
  }

  .m-refund-require {
    padding-top: rpx(30);
    padding-left: rpx(30);
  }

  text {
    color: red;
  }

  .m-input {
    margin-top: rpx(20);
    height: rpx(84);
  }

  .u-input {
    width: rpx(670);
    height: rpx(76);
    color: #999;
    border-radius: rpx(8);
    background-color: #fff;
    padding-left: rpx(20);

  }

  .image {
    height: rpx(24);
    width: rpx(14);
    position: relative;
    top: rpx(-53);
    left: rpx(660);
    z-index: 1;
  }

  .picture {
    padding: rpx(21) 0 rpx(128) 0;
  }

  .m-picture {
    height: rpx(170);
    width: rpx(170);
  }

  .m-btn {
    width: 100%;
    height: rpx(100);
    text-align: center;
    line-height: rpx(100);
    position: fixed;
    color: #ea281a;
    bottom: 0;
    background: #fff;
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

  .b-btn {
    width: 85%;
    background-color: #ea281a;
    color: #fff;
    margin-bottom: rpx(100);
    z-index: 2
  }
</style>
