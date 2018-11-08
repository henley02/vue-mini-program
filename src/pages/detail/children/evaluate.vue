<template>
  <div class='e-cell'>
    <div class='e-btn'>
      <div class="tab all" :class="{'active':evaluateTableIndex==0}" @click='changeTab(0)'>
        全部 {{evaluate.evaluationNumber}}
      </div>
      <div class="tab" :class="{'active':evaluateTableIndex==1}" @click='changeTab(1)'>
        有图 {{evaluate.pictureEvaluationNumber}}
      </div>
    </div>
    <!-- 评价信息 -->
    <scroll-view scroll-y="true" class="m-orderlist" @scrolltolower="dropDown" :style="{height:scrollHeight}">
      <block v-for="(comment,index) in list" :key="index">
        <div class="m-media-box m-media-box-appmsg" v-if="!comment.isHide">
          <div class="m-media-box-bd">
            <div class='p-media'>
              <label class="m-media-box-title" v-if="comment.isAnonymous == false">{{comment.memberName}}</label>
              <label class="m-media-box-title" v-else>***</label>
              <div class="m-time">{{comment.evaluationTime}}</div>
            </div>
            <div class="m-media-box-desc">
              <div class="m-media-box-info">
                <star :size="12" :score="comment.score"></star>
              </div>
              <div class="content">{{comment.content}}</div>
              <div v-if="comment.attachmentList" class="m-media-list">
                <image @tap="showBigImg" v-for="(item,i) in comment.attachmentList" :src="item.filePath"
                       :data-list="comment.attachmentList" :data-src="item.filePath" :key="i"/>
              </div>
              <div class="replyWrapper" v-for='(item,i) in comment.replyList' :key="i">
                <text>{{item.replyUserName}}:</text>
                <text class="reply-content">{{item.replyContent}}</text>
              </div>
            </div>
          </div>
        </div>
      </block>
      <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
      <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
    </scroll-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import {fetchEvaluateList} from 'api/index';
  import star from 'components/star/star';

  export default {
    name: 'evaluate',
    props: {
      id: {},
      evaluate: {type: Object}
    },
    components: {
      star
    },
    data() {
      return {
        evaluateTableIndex: 0,
        scrollHeight: '0px',
        list: [],
        isLoading: false,
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        isEnd: false,
        canDropDown: true // 是否可以下拉加载
      };
    },
    methods: {
      showBigImg(e) {
        let src = e.target.dataset.src; // 获取data-src
        let imgList = e.target.dataset.list; // 获取data-list
        let imgArray = [];
        for (let x in imgList) {
          imgArray.push(imgList[x].filePath);
        }
        // 图片预览
        wx.previewImage({
          current: src, // 当前显示图片的链接 默认urls 的第一张
          urls: imgArray // 需要预览的图片链接列表
        });
      },
      changeTab(index) {
        this.evaluateTableIndex = index;
        this.list = [];
        this.pageNumber = 1;
        this.isEnd = false;
        this.canDropDown = true;
        this.fetchList();
      },
      async fetchList() {
        this.isLoading = true;
        let params = {
          commodityId: this.id,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        if (this.evaluateTableIndex === 1) {
          params.hasAttachment = true;
        }
        let res = await fetchEvaluateList(params, {isLoading: this.pageNumber === 1});
        res.result.forEach((item) => {
          item.evaluationTime = this._dateFormat(item.evaluationTime, 'yyyy-MM-dd');
        });
        if (this.pageNumber === 1) {
          this.list = res.result;
        } else {
          this.list = this.list.concat(res.result);
        }
        // 判断数据是否全部加载完
        if (this.list.length >= res.totalCount) {
          this.isEnd = true;
          this.canDropDown = false;
        } else {
          this.canDropDown = true;
          this.pageNumber++;
        }
        this.isLoading = false;
      },
      /**
       * 下拉加载
       */
      dropDown() {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        this.fetchList();
      },
      /**
       * 设置评论区域的高度
       * @returns {Promise.<void>}
       */
      async setHeight() {
        wx.getSystemInfo({
          success: async (res) => {
            let navBarEl = await this.$bridge.system.getElementInfo('.navbar');
            let navBarHeight = navBarEl.height;
            let footerEl = await this.$bridge.system.getElementInfo('.m-footer-btn');
            let footerHeight = footerEl.height;
            setTimeout(async() => {
              let tabEl = await this.$bridge.system.getElementInfo('.e-btn');
              let tabHeight = tabEl.height;
              this.scrollHeight = (res.windowHeight - navBarHeight - tabHeight - footerHeight) + 'px';
            }, 100);
          }
        });
      }
    },
    created() {
      this.list = [];
      this.pageNumber = 1;
      this.isEnd = false;
      this.canDropDown = true;
      this.fetchList();
      this.setHeight();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .m-orderlist {
    overflow-y: auto;
    width: 100%;
  }

  .e-cell {
    position: relative;
  }

  .e-btn {
    display: flex;
    padding: rpx(30);
    background: #fff;
    border-bottom: rpx(1) solid #eee;
    border-top: rpx(1) solid #eee;
    padding-left: rpx(30);
  }

  .tab {
    background-color: #fdeeee;
    color: #333333;
    text-align: center;
    font-size: rpx(24);
    flex-direction: row;
    margin: 0;
    border-radius: rpx(8);
    padding: rpx(11) rpx(30);
  }

  .tab.all {
    margin-right: rpx(20);
  }

  .tab.active {
    background-color: #ea281a;
    color: #fff;
  }

  .m-media-box-title {
    font-size: rpx(28);
  }

  .content {
    padding-top: rpx(25);
    color: #000;
    font-size: rpx(28);
  }

  .m-media-box-info {
    width: rpx(144);
  }

  .m-media-box-info-meta {
    padding-right: rpx(5);
  }

  .m-media-box-appmsg {
    background-color: #fff;
    margin-bottom: rpx(20);
    padding: rpx(40) rpx(30);
  }

  .m-media-box-desc {
    display: block;
    overflow: visible;
    text-overflow: clip;
  }

  .m-media-list {
    float: left;
    width: 100%;
  }

  .m-media-list image {
    width: rpx(200);
    height: rpx(200);
    box-sizing: border-box;
    margin: rpx(20) rpx(20) 0 0;
    border: rpx(1) solid #eee;
  }

  .p-media {
    display: flex;
    justify-content: space-between;
  }

  .replyWrapper {
    color: #000000;
    font-size: rpx(28);
    margin-top: rpx(300)
  }

  .reply-content {
    color: #666;
  }
</style>
