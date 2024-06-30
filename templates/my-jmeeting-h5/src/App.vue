<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </a-config-provider>
  </div>
</template>
<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
export default {
  name: "App",
  data() {
    return {
      locale: zhCN,
    };
  },
  methods: {},
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  color: #333;
  height: 100%;
  p {
    // margin-bottom: 0 !important;
  }
}
</style>
