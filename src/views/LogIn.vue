<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "@/assets/api.js";
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      try {
        const res = await axios.post(
          `${api.API_URL}/login/login`,
          qs.stringify(this.form)
        );
        if (res.status == 200) {
          this.$router.push("/home");
          localStorage.setItem("token", res.data.data["token"]);
        }
      } catch (err) {
        console.log(err);
        this.$message.error("Error!");
      }
    },
  },
};
</script>