<template>
  <div class="clearfix">
    <JmeetingWeb
      v-if="ishow"
      :meetingObj="meetingObj"
      :basic="basic"
      @leaveMeeting="goBack('quitMeet')"
      @closeMeeting="goBack('closeMeeting')"
      @recordStart="recordStart"
      @recordEnd="recordEnd"
      @callFailed="goBack()"
      @callSuccess="callSuccess"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      meetingObj: {
        liveId: "",
        meetingCode: "",
        liveMode: 1,
        userId: "",
        userIdJoin: "",
        liveCreatorId: "",
        liveName: "",
        liveType: "",
        Initiator: 0,
        userName: "",
        mainWindowUserid: "",
        isScreenShare: [false, "", ""],
        phoneNumber: "",
        isDisconnected: true,
        audioOpen: false,
        videoOpen: false,
        allUserList: [],
        unOnline: [],
        listActive: 0,
        isRecord: false,
        isAllowTips: true,
        isAllowInvite: true,
        isShowControlls: true, //会议解答
        recordBtnControl: true, //录制按钮
        hostIdJoin: "",
        showQRCode: false, //入会二维码
      },
      basic: {
        jmeetingName: "微联叮·会议",
        jmeetingIcon: "",
        homepageHeader: true,
        isNeedFooter: true,
        isNeedGroup: true,
        structureOptions: {
          icon: "https://work.hanweb.com/jcmspub/im_files/app/jpg/im_qUIOKBgP3Z8ILGRe.jpg", //组织架构图标
          name: "大汉软件股份有限公司",
          levelList: [
            {
              pid: "fcd04e26e900e94b9ed6dd604fed2b64", //
              name: "大汉软件股份有限公司",
            },
          ],
          pid: "fcd04e26e900e94b9ed6dd604fed2b64",
        },
        allowBrowserMeeting: false,
      },
      electron: "",
      ishow: false,
    };
  },
  watch: {
    "meetingObj.audioOpen"(newVal) {
      this.rememberStatus("audioOpen", newVal);
    },
    "meetingObj.videoOpen"(newVal) {
      this.rememberStatus("videoOpen", newVal);
    },
    "meetingObj.liveMode"(newVal) {
      this.rememberStatus("liveMode", newVal);
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      sessionStorage.removeItem("isSharing");
      let userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf("electron") > -1) {
        // 判断是否在盒子，显示 停止共享
        this.electron = 1;
      }
      this.meetingObj.audioOpen = this.getUrlParams("audioOpen");
      this.meetingObj.videoOpen = this.getUrlParams("videoOpen");
      this.meetingObj.liveId = this.getUrlParams("liveId");
      this.meetingObj.liveMode = this.getUrlParams("liveMode");
      this.meetingObj.phoneNumber = this.getUrlParams("phoneNumber");
      this.meetingObj.showQRCode = this.getUrlParams("showQRCode") == "true" ? true : false;
      if (this.getUrlParams("userId")) {
        this.meetingObj.userId = this.getUrlParams("userId");
        this.meetingObj.userIdJoin = this.getUrlParams("userId");
        this.meetingObj.userName = this.getUrlParams("userName");
      }
      //  else if (this.getUrlParams("phoneNumber")) {
      //   this.meetingObj.userIdJoin = tools.encrypt(this.getUrlParams("phoneNumber"), jpassConfig.publicKey);
      //   this.meetingObj.userName = this.getUrlParams("userName");
      //   this.meetingObj.recordBtnControl = true;
      //   this.meetingObj.hostIdJoin = tools.sm4Encrypt(this.getUrlParams("phoneNumber"));
      // } else if (!this.getUrlParams("userId") && !this.getUrlParams("phoneNumber")) {
      //   //外网参会人员
      //   this.meetingObj.userIdJoin = "";
      //   this.meetingObj.userName = this.getUrlParams("userName");
      //   this.meetingObj.recordBtnControl = false;
      // }
      this.ishow = true;
    },
    // 返回首页
    goBack(data) {
      console.log("goBack,goBack");
      console.log(data);
      // 内部-原来   外部-主持人-历史 其他-登录页   混合-主持人-原来 其他人-有电话-首页-无-原来
      if (!this.meetingObj.liveMode || this.meetingObj.liveMode == 0 || (this.meetingObj.liveMode == 1 && !this.meetingObj.phoneNumber)) {
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("electron") > -1) {
          window.electron.closeMeeting(location.href);
        } else {
          window.location.href = jpassConfig.backUrl;
        }
      } else if ((this.meetingObj.liveMode == 1 && this.meetingObj.phoneNumber) || (this.meetingObj.liveMode == -1 && !this.meetingObj.phoneNumber)) {
        //如果是离开会议 跳转验证页面
        if (data == "quitMeet") {
          this.$router.push({ path: "/check", query: { liveId: this.meetingObj.liveId, liveMode: this.meetingObj.liveMode } });
        } else {
          this.$router.replace({ path: "/login" });
        }
      } else if (this.meetingObj.liveMode == -1 && this.meetingObj.phoneNumber) {
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("electron") > -1) {
          window.electron.closeMeeting(location.href);
        } else {
          this.$router.replace({ path: "/historyMeet", query: { userName: this.meetingObj.userName, phoneNumber: this.meetingObj.phoneNumber } });
        }
      } else {
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("electron") > -1) {
          window.electron.closeMeeting(location.href);
        } else {
          history.back();
        }
      }
    },
    //记录摄像头麦克风状态 记录路径上参数
    rememberStatus(status, newValue) {
      const query = this.$router.history.current.query;
      const path = this.$router.history.current.path;
      // 对象的拷贝
      const newQuery = JSON.parse(JSON.stringify(query));
      // 地址栏的参数值赋值
      newQuery[status] = newValue;
      this.$router.replace({ path, query: newQuery });
    },
    // 录制开始
    recordStart(res) {
      if (!res.success) {
        this.$message.error(res.message);
      }
    },
    // 录制结束
    recordEnd() {
      console.log("录制结束");
    },
    callSuccess() {
      console.log("接受会议成功");
    },
    //获取路径参数
    getUrlParams(name) {
      let paramsDic = {},
        str = window.location.href, //取得整个地址栏
        num = str.indexOf("?");
      str = str.substr(num + 1); //取得所有参数
      let arr = str.split("&"); //各个参数放到数组里
      for (let i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          let name = arr[i].substring(0, num),
            value = arr[i].substr(num + 1);
          paramsDic[name] = value;
        }
      }
      return paramsDic[name] ? decodeURI(paramsDic[name]) : "";
    },
  },
};
</script>
<style lang="less" scoped>
.clearfix{
  height: 100vh;
}
</style>
