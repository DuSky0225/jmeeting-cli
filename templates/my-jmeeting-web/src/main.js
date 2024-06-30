import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import { Room, VideoPresets, ScreenSharePresets } from "livekit-client";

const room = new Room({
  adaptiveStream: false,
  dynacast: true,
  publishDefaults: {
    simulcast: true,
    videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h720],
    videoCodec: "h264",
    screenShareSimulcastLayers: [VideoPresets.h1080, VideoPresets.h1080],
    screenShareEncoding: ScreenSharePresets.h1080fps30.encoding,
    audioPreset: "musicHighQualityStereo", //musicHighQualityStereo telephone
    forceStereo: true, //立体声音轨
  },
  audioCaptureDefaults: {
    echoCancellation: true, //回声取消
    noiseSuppression: true, //噪音抑制
    sampleRate: "48000Hz", //每秒采样的次数
    sampleSize: "32bit", //每个采样点的位数
  },
  videoCaptureDefaults: {
    resolution: VideoPresets.h360,
  },
});

import JmeetingWeb from 'jmeeting-web';
import SelectContact from 'jmeeting-web';
import "jmeeting-web/jmeetingWeb.css";
Vue.use(JmeetingWeb);
Vue.use(SelectContact);

Vue.prototype.$room = room;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
