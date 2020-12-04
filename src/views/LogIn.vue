<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item prop="username" label="账号">
        <el-input v-model="form.username" @keyup.enter.native='onSubmit'></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password" @keyup.enter.native='onSubmit'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" >登录</el-button>
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
      //登录表单的数据绑定对象
      form: {
        username: "",
        password: "",
      },
      //这是表单的验证规则
      formRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      //点击登录先进行表单预验证失败，直接返回不发起请求
      this.$refs.form.validate((valid) => {
        if (!valid) return;
      });

      try {
        const res = await axios.post(
          `${api.API_URL}/login/login`,
          qs.stringify(this.form)
        );
        if (res.status == 200) {
          window.sessionStorage.setItem("token", res.data.data["token"]);
          this.$router.push("/home");
          this.$message.success("登录成功");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("登录失败");
      }
    },
  },
};
</script>