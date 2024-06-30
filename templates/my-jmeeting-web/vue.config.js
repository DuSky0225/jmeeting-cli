const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      fallback: {
        util: require.resolve("util/"),
        // 其他 Node.js 核心模块的 polyfills，如有需要
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser", // 提供 process polyfill
      }),
    ],
  },
  transpileDependencies: true,
  devServer: {
    port: 8082,
    open: true, //配置自动启动浏览器
    proxy: {
      "/api-gateway/common-captcha-server": {
        target: "https://workin.hanweb.com",
        // target: "https://jpaasdev2.hanweb.com",
        ws: false,
        changeOrigin: true,
      },
      "/api-gateway/jpaas-jim-web-server": {
        target: "https://workin.hanweb.com/",
        // target: "https://jpaasdev2.hanweb.com",
        ws: false,
        changeOrigin: true,
        // pathRewrite: {
        //   "^/api-gateway": "",
        // },
      },
      "/api-gateway/common-ucenter-server": {
        target: "https://meetingin.hanweb.com/",
        // target: "https://jpaasdev2.hanweb.com",
        ws: false,
        changeOrigin: true,
      },
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
