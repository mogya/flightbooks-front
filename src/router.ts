import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import Signin from "./pages/Signin.vue";
import store from "@/store";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/signin",
      name: "signin",
      component: Signin,
      meta: {
        checkAuth: true
      }
    },
  ]
});

router.beforeEach((to, _, next) => {
  let requireAuth = to.matched.some(record => record.meta.requireAuth);
  let checkAuth = to.matched.some(record => record.meta.checkAuth);
  let currentUser = store.state.user.user;

  if (requireAuth) {
    if (!currentUser) {
      next({
        path: "/signin",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (checkAuth) {
    if (currentUser) {
      next({
        path: "/",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
