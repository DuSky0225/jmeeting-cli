import { axios } from "./request";
export const jmeetingWebAPI = {
  // 会议冲突检验
  clientIsConflict(parameter) {
    return axios({
      url: "/jpaas-jmeeting-web-server/front/live/clientIsConflict",
      method: "post",
      params: parameter,
    });
  },
};
