let axios;

if (window.__POWERED_BY_QIANKUN__) {
  axios = window.$axios;
} else {
  axios = async function (config) {
    return import("@/utils/axios").then((module) => {
      return module.service(config);
    });
  };
}

export { axios };
