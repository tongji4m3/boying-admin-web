<template>
  <div v-loading="loading">这是用户列表页面</div>
</template>

<script>
export default {
  name: "",
  props: [""],
  data() {
    return {
      loading: true,
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },

  methods: {},

  watch: {},
};
</script>
<style lang='' scoped>
</style>