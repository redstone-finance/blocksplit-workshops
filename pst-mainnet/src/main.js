import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "@babel/polyfill";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import Toasted from "vue-toasted";

Vue.use(Toasted);
Vue.use(BootstrapVue, {
  breakpoints: [`xs`, "sm", "md", "lg", "xl", "xxl"],
});

Vue.toasted.register(
  "close",
  function (message) {
    return message;
  },
  {
    type: "success",
    closeOnSwipe: false,
    className: ["toasting"],
    action: {
      text: "Close",
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      },
    },
  }
);

Vue.toasted.register(
  "success",
  function (message) {
    return message;
  },
  {
    type: "success",
    className: ["toasting"],
    duration: 3000,
  }
);

function setupFilters() {
  Vue.filter("tx", function (value) {
    if (!value) return "";
    return value.substr(0, 6) + "..." + value.substr(value.length - 6);
  });
}

setupFilters();

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
