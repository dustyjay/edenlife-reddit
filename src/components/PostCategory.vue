<template>
  <div class="post__category">
    <div class="post__category--head">
      <h2 class="post__category--title">{{ category.title }}</h2>
      <svg
        class="post__category--sort"
        :class="{ descend: !ascending, inactive: posts.length <= 1 }"
        @click="toggleSort"
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0)">
          <path
            d="M9.64944 10.2856H5.14945C5.05565 10.2856 4.97864 10.3157 4.91855 10.376C4.85821 10.4363 4.82802 10.5132 4.82802 10.6071V12.5356C4.82802 12.6294 4.85821 12.7064 4.91855 12.7666C4.97864 12.8268 5.05565 12.8571 5.14945 12.8571H9.64944C9.74323 12.8571 9.82018 12.827 9.88048 12.7666C9.94064 12.7064 9.97083 12.6294 9.97083 12.5356V10.6071C9.97083 10.5132 9.94074 10.4363 9.88048 10.376C9.82018 10.3158 9.74323 10.2856 9.64944 10.2856Z"
            fill="#4F4F4F"
          />
          <path
            d="M9.64932 15.4286H7.07797C6.98417 15.4286 6.90712 15.4587 6.84707 15.5189C6.78663 15.5792 6.7569 15.6562 6.7569 15.75V17.6786C6.7569 17.7723 6.78666 17.8493 6.84707 17.9096C6.90712 17.9698 6.98417 18 7.07797 18H9.64932C9.74311 18 9.82005 17.9699 9.88036 17.9097C9.94048 17.8493 9.9707 17.7723 9.9707 17.6786V15.75C9.9707 15.6562 9.94062 15.5793 9.88036 15.519C9.82002 15.4588 9.74311 15.4286 9.64932 15.4286Z"
            fill="#4F4F4F"
          />
          <path
            d="M11.8995 3.85715H13.828L13.828 17.6786C13.828 17.7723 13.8581 17.8494 13.9184 17.9096C13.9787 17.9698 14.0556 18 14.1495 18H16.0781C16.1718 18 16.2489 17.9699 16.3091 17.9097C16.3692 17.8493 16.3995 17.7723 16.3995 17.6786V3.85718H18.3281C18.4753 3.85718 18.5758 3.79026 18.6294 3.65636C18.683 3.52897 18.6595 3.41185 18.5591 3.30468L15.3449 0.0902775C15.2712 0.0302218 15.1942 0.000140777 15.1138 0.000140777C15.0268 0.000140777 14.9497 0.0302218 14.8828 0.0902775L11.6785 3.29459C11.6115 3.37477 11.5781 3.4554 11.5781 3.53537C11.5781 3.62952 11.6083 3.70632 11.6684 3.76701C11.7287 3.82703 11.8056 3.85715 11.8995 3.85715Z"
            fill="#4F4F4F"
          />
          <path
            d="M1.06114 2.48089C1.12148 2.54133 1.19838 2.57141 1.29218 2.57141L9.64932 2.57141C9.74311 2.57141 9.82005 2.54133 9.88036 2.48089C9.94048 2.42069 9.9707 2.34364 9.9707 2.24995V0.321452C9.9707 0.227411 9.94062 0.150714 9.88036 0.0902717C9.82002 0.0300753 9.74311 -5.62926e-06 9.64932 -5.62926e-06L1.29221 -5.62926e-06C1.19842 -5.62926e-06 1.12148 0.0300753 1.06117 0.0902717C1.00098 0.15075 0.970896 0.227411 0.970896 0.321452V2.24995C0.970756 2.34361 1.00098 2.42069 1.06114 2.48089Z"
            fill="#4F4F4F"
          />
          <path
            d="M9.64944 5.14291L3.22077 5.14291C3.12708 5.14291 3.05003 5.17299 2.98962 5.23319C2.92953 5.29339 2.89945 5.37044 2.89945 5.46409V7.39287C2.89945 7.48653 2.92953 7.56361 2.98962 7.62377C3.05006 7.68397 3.12708 7.71405 3.22077 7.71405L9.64944 7.71405C9.74323 7.71405 9.82018 7.68397 9.88048 7.62377C9.94064 7.56358 9.97083 7.48653 9.97083 7.39287V5.46409C9.97083 5.37044 9.94074 5.29335 9.88048 5.23319C9.82018 5.17299 9.74323 5.14291 9.64944 5.14291Z"
            fill="#4F4F4F"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect
              width="18.75"
              height="18"
              fill="white"
              transform="translate(19 18) rotate(-180)"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
    <div class="post__item--box">
      <transition-group
        mode="out-in"
        tag="div"
        name="fade__down"
        v-for="(post, i) in sortedPosts"
        :key="i"
      >
        <PostItem :post="post" :key="i" />
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostCategory",
  components: {
    PostItem: () => import("./PostItem")
  },
  props: {
    category: Object
  },
  data() {
    return {
      ascending: true,
      sortedPosts: []
    };
  },
  computed: {
    posts() {
      return this.category.posts;
    }
  },
  methods: {
    toggleSort() {
      if (this.posts.length > 1) {
        this.ascending = !this.ascending;
        this.sortedPosts = this.sortedPosts.reverse();
      }
    },
    sortPosts() {
      return this.posts.sort((a, b) => {
        return a.data.ups - b.data.ups;
      });
    }
  },
  mounted() {
    this.sortedPosts = this.sortPosts();
  }
};
</script>
