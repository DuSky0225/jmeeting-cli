import axios from "axios";
import Qs from "qs";
import store from "@/store";
import router from "@/router";
import notification from "ant-design-vue/es/notification";
import modal from "ant-design-vue/es/modal";

// 创建 axios 实例
const service = axios.create({
  baseURL: "/api-gateway", // api base_url
  timeout: 60000, // 请求超时时间 60s
  ignoreError: false, // 忽略200服务器返回失败，不提示
  transformRequest: [
    function (data, headers) {
      if (headers["Content-Type"]) {
        if (headers["Content-Type"] === "multipart/form-data") {
          return data;
        } else if (headers["Content-Type"].includes("application/json")) {
          return JSON.stringify(data);
        }
      }
      // 对 data 进行任意转换处理
      return Qs.stringify(data, { indices: false });
    },
  ],
  transformResponse: [
    function (data) {
      let reponseVal = data;
      const hasSecureJsonPrefix = data.startsWith("while"); // 返回值添加了防JSON劫持代码
      if (data.startsWith("{") || data.startsWith("[") || hasSecureJsonPrefix) {
        // 返回值为json
        reponseVal = JSON.parse(hasSecureJsonPrefix ? data.substr(9) : data);
      }
      return reponseVal;
    },
  ],
});

const CancelToken = axios.CancelToken;
let unauthorizedConfirm = null; // 会话失效确认框

const err = (error) => {
  if (axios.isCancel(error)) {
    return new Promise(() => {});
  }

  if (error.response) {
    switch (error.response.status) {
      // case 500:
      //   notification.error({
      //     key: "Error",
      //     message: "内部错误",
      //     description: "服务器内部错误，请稍后重新尝试",
      //   });
      //   break;
      // case 403:
      //   notification.error({
      //     key: "Forbidden",
      //     message: "无权限访问",
      //     description: ((error.response || {}).data || {}).message || "您无权访问该页面",
      //   });
      //   break;
      // case 404:
      //   notification.error({
      //     key: "NotFound",
      //     message: "无法访问",
      //     description: ((error.response || {}).data || {}).message || "网络异常或服务无法访问，请稍后重新尝试",
      //   });
      //   break;
      // case 401:
      //   if (!unauthorizedConfirm) {
      //     unauthorizedConfirm = modal.confirm({
      //       title: "会话无效",
      //       content: "会话失效或已过期，请重新登录",
      //       onOk() {
      //         store.dispatch("Logout").then((res) => {
      //           store.commit("SET_AUTHORIZED", false);
      //           // 按后端返回跳转
      //           if (process.env.NODE_ENV === "development") {
      //             if (!window.__POWERED_BY_QIANKUN__) {
      //               router.push({ path: "/user/login" });
      //             } else {
      //               router.push({ path: "/jpaas/user/login" });
      //             }
      //           } else {
      //             if (res.data.redirecturl) {
      //               location.href = res.data.redirecturl;
      //             }
      //           }
      //         });

      //         unauthorizedConfirm = null;
      //       },
      //       onCancel() {
      //         unauthorizedConfirm = null;
      //       },
      //     });
      //   }
      // break;
      default:
        notification.error({
          key: "Unknown",
          message: "未知错误",
          description: ((error.response || {}).data || {}).message || "未知错误，请稍后重新尝试",
        });
    }
  }
  return Promise.reject(error);
};

function errorLog(error) {
  notification.error({
    key: "Error",
    message: "内部错误",
    description: error || "服务器内部错误，请稍后重新尝试",
  });
}

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (!config.daemon) {
      // 存储非守护请求的取消函数
      config.cancelToken = new CancelToken((cancel) => {
        // store.state.requestCancels.push(cancel);
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
service.interceptors.response.use((response) => {
  const responseData = response.data;
  if (responseData) {
    responseData.headers = response.headers;
    const { success, message } = responseData;
    if (!success && !response.config.ignoreError) {
      errorLog(message);
    }
    return responseData;
  }
}, err);

// 取消请求
// const cancelRequests = () => {
//   store.state.requestCancels.forEach((cancel) => {
//     cancel && cancel();
//   });
//   store.state.requestCancels = [];
// };

export { service, service as axios };
