import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import VueAnalytics from "vue-analytics";

Vue.config.productionTip = false;

Vue.use(VueAnalytics, { id: 'UA-163162436-1'})

const requireComponent = require.context(
  // The relative path of the components folder
  "./components",
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /Base[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach((fileName) => {
  // Get component config
  const componentConfig = requireComponent(fileName);

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );

  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  );
});

new Vue({
  router,
  store,
  vuetify,
  render: function(h) {
    return h(App);
  },
}).$mount("#app");
