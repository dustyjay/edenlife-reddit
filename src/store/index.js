import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const posts = JSON.parse(localStorage.getItem("posts"));

export default new Vuex.Store({
  state: {
    posts: []
  },
  getters: {
    getPosts: state => state.posts
  },
  mutations: {
    SET_POSTS(state, payload) {
      state.posts = [...state.posts, ...payload];
      if (state.posts.length >= 350) {
        localStorage.removeItem("posts");
        localStorage.removeItem("timestamp");
      } else {
        localStorage.setItem("posts", JSON.stringify(state.posts));
      }
    }
  },
  actions: {
    async GET_POSTS({ commit }) {
      if (posts) {
        commit("SET_POSTS", posts);
      }
      const response = await fetch("https://www.reddit.com/.json", {
        method: "GET"
      });
      const result = await response.json();
      commit("SET_POSTS", result.data.children);
      return true;
    }
  },
  modules: {}
});
