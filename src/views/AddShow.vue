<template>
  <el-card class="form-container" shadow="never">
    <div class="procedures" v-loading="loading">
      <el-steps :space="400" :active="0" finish-status="success">
        <el-step title="进行中"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
    </div>
  </el-card>
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
<style scoped>
.procedures {
  text-align: left;
  margin: 50px;
  margin-left: 200px;
}

.form-container {
  margin: 50px;
  margin-left: 200px;
  width: 800px;
}
</style>