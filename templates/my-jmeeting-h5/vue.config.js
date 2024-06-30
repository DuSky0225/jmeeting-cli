const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    port: 8082,
    open: true, //配置自动启动浏览器
    proxy: {
      "/api-gateway": {
        target: "https://meetingin.hanweb.com",
        // target: "https://jpaasdev2.hanweb.com",
        ws: false,
        changeOrigin: true,
        // pathRewrite: {
        //   "^/api-gateway": "",
        // },
      },
    },
  },
});
