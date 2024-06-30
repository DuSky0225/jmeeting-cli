import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import { axios } from "@/utils/request";

Vue.config.productionTip = false;

import { Button, message } from "ant-design-vue";

Vue.prototype.axios = axios;
Vue.prototype.$message = message;

import JmeetingWeb from "jmeeting-web";
import SelectContact from "jmeeting-web";
Vue.use(JmeetingWeb);
Vue.use(SelectContact);
import "jmeeting-web/jmeetingWeb.css";

Vue.use(Button);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
