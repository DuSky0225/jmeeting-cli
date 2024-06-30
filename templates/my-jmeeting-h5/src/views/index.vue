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
// import { tools } from "../utils/tool";
import { jmeetingWebAPI } from "../utils/meeting";
export default {
  data() {
    return {
      basic: {
        jmeetingName: "微联叮·会议",
        jmeetingIcon: "",
        homepageHeader: true,
        isNeedFooter: true,
        isNeedGroup: true,
        structrueList: [],
        allowBrowserMeeting: false,
        minuteStep: 15,
      },
      meetingObj: {
        liveId: "",
        meetingCode: "",
        liveMode: 1,
        userId: "",
        userName: "",
        phoneNumber: "",
        audioOpen: false,
        videoOpen: false,
        isShowControlls: true, //会议解答
        recordBtnControl: true, //录制按钮
      },
      publicKey: "04a2b43e3c4dd427d7c5b35ed538d0bfa512026ce487cb6e045f17d78d360d61213107acb7045f522c793e9dd7417bb926fbe5aea309d8650e47e170824dfb28cf",
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
  beforeDestroy() {
    window.removeEventListener("visibilitychange", this.handleVisibilityChange);
  },
  mounted() {
    window.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.liveIdClick();
      }
    },
    init() {
      this.meetingObj.audioOpen = this.getUrlKey("audioOpen");
      this.meetingObj.videoOpen = this.getUrlKey("videoOpen");
      this.meetingObj.liveId = this.getUrlKey("liveId") || "";
      this.meetingObj.liveMode = this.getUrlKey("liveMode");
      this.meetingObj.phoneNumber = this.getUrlKey("phoneNumber");
      this.meetingObj.showQRCode = this.getUrlKey("showQRCode") == "true" ? true : false;

      if (this.getUrlKey("userId")) {
        // 内网 有userId
        this.meetingObj.userId = this.getUrlKey("userId");
        this.meetingObj.userIdJoin = this.getUrlKey("userId");
        this.meetingObj.userName = this.getUrlKey("userName");
      } else if (this.getUrlKey("phoneNumber")) {
        // 外网创会人
        this.meetingObj.userIdJoin = tools.encrypt(this.getUrlKey("phoneNumber"), this.publicKey);
        this.meetingObj.userName = this.getUrlKey("userName");
        this.meetingObj.recordBtnControl = true;
        this.meetingObj.hostIdJoin = tools.sm4Encrypt(this.getUrlKey("phoneNumber"));
      } else if (!this.getUrlKey("userId") && !this.getUrlKey("phoneNumber")) {
        // 外网参会人
        this.meetingObj.userIdJoin = "";
        this.meetingObj.userName = this.getUrlKey("userName");
        this.meetingObj.recordBtnControl = false;
      }
      this.ishow = true;
    },
    // 会议是否结束以及是否和其他端冲突
    liveIdClick(e) {
      let paramas = {
        myId: this.meetingObj.userId,
        liveId: this.meetingObj.liveId,
        clientType: 3, //3:pc
      };
      jmeetingWebAPI.clientIsConflict(paramas).then((res) => {
        if (res.success) {
          if (res.data.isClosed) {
            this.$message.error("会议已结束");
            this.goBack();
          }
          // 已在其他设备接听
          if (res.data.isConflict) {
            this.$message.warn("当前账号有其他设备正在会议中");
            this.goBack();
          }
        }
      });
    },
    // 获取传参
    getUrlKey(name) {
      return (
        decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null
      );
    },
    // 返回首页
    goBack(data) {
      console.log(data);
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
  },
};
</script>
<style lang="less" scoped>
.clearfix {
  height: 100vh;
}
</style>
