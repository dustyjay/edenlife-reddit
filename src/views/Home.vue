<template>
  <div>
    <div class="loader" v-if="loading">
      <div>
        <img src="@/assets/img/loader.jpeg" alt="Just a minute" />
        <p>Just a minute 🙂</p>
      </div>
    </div>
    <template v-else>
      <div class="filters">
        <div class="search__box">
          <form @submit.prevent="searchPosts" class="search__form">
            <input
              type="search"
              class="search__input"
              placeholder="Search posts...."
              name="search"
              id="search"
              v-model="search"
              @input="searchPosts"
            />
          </form>
          <div class="search__advanced">
            <button class="" @click="toggleFilters">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.38985 5.92302C4.57841 6.19588 4.52204 5.96851 4.52204 11.4073C4.52204 11.894 5.07732 12.1726 5.46868 11.8815C7.14101 10.6206 7.47514 10.5114 7.47514 9.92164C7.47514 5.95827 7.42894 6.18116 7.60733 5.92302L10.323 2.2265H1.67419L4.38985 5.92302Z"
                  fill="white"
                />
                <path
                  d="M11.3489 0.301406C11.2519 0.115547 11.0616 0 10.8521 0H1.1453C0.692838 0 0.426611 0.510398 0.686158 0.88125C0.688291 0.884812 0.656697 0.84157 1.15772 1.52344H10.8396C11.2666 0.942352 11.552 0.691289 11.3489 0.301406Z"
                  fill="white"
                />
              </svg>

              <span>ADVANCED FILTERS</span>
            </button>
          </div>
        </div>
        <div class="filters__box" :class="{ active: showFilter }">
          <div class="filters__input">
            <input
              type="date"
              name="startDate"
              v-model="startDate"
              @change="searchPosts"
            />
          </div>
          <div class="filters__input">
            <input
              type="date"
              name="endDate"
              v-model="endDate"
              @change="searchPosts"
            />
          </div>
          <div class="filters__input">
            <DropDown
              :options="voteRanges"
              placeholder="Select upvote range"
              @range="handleRange"
            />
            <!-- <select name="upvote" v-model="minUpVote" @change="searchPosts">
              <option value="" disabled hidden>Select min upvote</option>
              <option
                :value="option"
                v-for="option in voteRanges"
                :key="option.min"
              >
                {{ option.min | number }} - {{ option.max | number }}
              </option>
            </select> -->
          </div>
          <!-- <div class="filters__input">
            <select name="upvote" v-model="maxUpVote" @change="searchPosts">
              <option value="" disabled hidden>Select max upvote</option>
              <template v-for="option in voteRanges">
                <option v-if="option" :value="option" :key="option">
                  {{ option | number }}
                </option>
              </template>
            </select>
          </div> -->
        </div>
      </div>
      <template v-if="categories.length > 0">
        <PostCategory
          :category="category"
          v-for="(category, i) in categories"
          :key="i"
        />
      </template>

      <transition name="fade__in">
        <template v-if="categories.length <= 0">
          <h3 class="form__empty">
            There are no posts
            {{
              this.showFilter
                ? "within the selected filters"
                : `with name ${search}`
            }}
          </h3>
        </template>
      </transition>
    </template>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Home",
  components: {
    PostCategory: () => import("@/components/PostCategory"),
    DropDown: () => import("@/components/DropDown")
  },

  data() {
    return {
      categories: [],
      loading: false,
      search: "",
      startDate: "",
      endDate: "",
      minUpVote: "",
      maxUpVote: "",
      voteRanges: [
        {
          min: 0,
          max: 1000
        },
        {
          min: 1001,
          max: 2000
        },
        {
          min: 2001,
          max: 3000
        },
        {
          min: 3001,
          max: 4000
        },
        {
          min: 4001,
          max: 5000
        },
        {
          min: 5001,
          max: 6000
        },
        {
          min: 6001,
          max: 7000
        },
        {
          min: 7001,
          max: 8000
        },
        {
          min: 8001,
          max: 9000
        },
        {
          min: 9001,
          max: 10000
        },
        {
          min: 10001,
          max: 20000
        },
        {
          min: 20001,
          max: 30000
        },
        {
          min: 30001,
          max: 40000
        },
        {
          min: 40001,
          max: 50000
        },
        {
          min: 50001,
          max: 60000
        },
        {
          min: 60001,
          max: 70000
        },
        {
          min: 70001,
          max: 80000
        },
        {
          min: 80001,
          max: 90000
        },
        {
          min: 90001,
          max: 100000
        }
      ],
      showFilter: false,
      filteredPosts: []
    };
  },

  computed: {
    ...mapGetters(["getPosts"])
  },

  methods: {
    ...mapActions(["GET_POSTS"]),
    ...mapMutations(["SET_POSTS"]),
    async sortCategories() {
      this.categories = [];
      await this.filterPosts();

      this.filteredPosts.map(post => {
        const title = post.data.subreddit;
        const index = this.categories.findIndex(post => post.title === title);

        if (index === -1) {
          const payload = {
            title,
            posts: [post]
          };

          this.categories.push(payload);
        } else {
          const item = this.categories[index];

          const payload = {
            title,
            posts: [...item.posts, post]
          };

          this.categories[index] = payload;
        }
      });
    },

    filterPosts() {
      let filtered = this.getPosts.filter(
        post =>
          post.data.title.toLowerCase().includes(this.search.toLowerCase()) &&
          this.compareStartDate(post.data.created * 1000) &&
          this.compareEndDate(post.data.created * 1000) &&
          post.data.ups >= +this.minUpVote
      );
      if (+this.maxUpVote) {
        filtered = filtered.filter(post => post.data.ups <= +this.maxUpVote);
      }
      this.filteredPosts = [...filtered];
    },

    compareStartDate(createdDate) {
      const start = new Date(new Date(createdDate).getTime());
      const stop = new Date(new Date(this.startDate).getTime()).setHours(
        0,
        0,
        0,
        0
      );
      return start >= stop;
    },

    compareEndDate(createdDate) {
      const start = new Date(new Date(createdDate).getTime()).setHours(
        0,
        0,
        0,
        0
      );
      const stop = new Date(this.endDate).getTime();
      return start <= stop;
    },

    searchPosts() {
      if (this.maxUpVote && this.minUpVote) {
        if (+this.minUpVote >= +this.maxUpVote) {
          this.maxUpVote =
            +this.minUpVote < 10000
              ? +this.minUpVote + 1000
              : +this.minUpVote + 10000;
        }
      }
      this.sortCategories();
    },
    toggleFilters() {
      this.showFilter = !this.showFilter;
    },
    preloadDates() {
      const date = new Date();
      const fromDate = date.setDate(date.getDate() - 30);
      const today = new Date(
        new Date().setHours(23, 59, 59, 999)
      ).toUTCString();
      this.startDate = this.$options.filters.inputDate(new Date(fromDate));
      this.endDate = this.$options.filters.inputDate(new Date(today));
    },
    handleRange(e) {
      this.minUpVote = e.min;
      this.maxUpVote = e.max;
      this.searchPosts();
    }
  },

  async mounted() {
    this.preloadDates();
    this.loading = true;
    const tempPosts = JSON.parse(localStorage.getItem("posts"));
    if (tempPosts) {
      this.loading = false;
      this.SET_POSTS(tempPosts);
      this.sortCategories();
    }
    await this.GET_POSTS();
    this.loading = false;
    this.sortCategories();
    setTimeout(() => {
      this.showFilter = true;
    }, 500);
    setTimeout(() => {
      this.showFilter = false;
    }, 1500);
  }
};
</script>
