<template>
  <div style="position: relative">
    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="name" label="一级目录" width="300">
        </el-table-column>
        <el-table-column prop="setting" label="设置" width="200">
        </el-table-column>
        <el-table-column prop="address" label="操作"> </el-table-column>
      </el-table>
    </template>
    <el-button type="primary" @click="addFirstCatagory">添加目录</el-button>
    <el-card class="addCategoryForm-card" v-if="add">
      <el-form :model="firstCategory" status-icon label-width="100px">
        <el-form-item label="一级目录名" prop="age">
          <el-input v-model.number="firstCategory.name"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button type="primary" @click="cancle">取消</el-button>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
import api from "@/assets/api.js";
import qs from "qs";

export default {
  data() {
    return {
      add: false,
      firstCategory: {
        description: "",
        icon: "",
        name: "",
        parentId: 0,
        weight: 1,
      },
      tableData: [],
    };
  },
  methods: {
    async addFirstCatagory() {
      this.add = true;
    },
    async submit() {
      console.log(this.firstCategory.name);

      try {
        const res = await axios.post(
          `${api.API_URL}/category/create`,
          this.firstCategory
        );
        if (res.status == 200) {
          this.$message.success("添加成功");
          this.add = false;
        }
      } catch (err) {
        console.log(err);
        this.$message.error("添加失败");
      }
    },
    cancle() {
      this.add = false;
    },
  },
  async mounted() {
    try {
      console.log("mounted");
      const res = await axios.get(`${api.API_URL}/category/listAll`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      });
      console.log(res);
      if (res.data.code == 200) {
        this.tableData = res.data.data;

        console.log(this.tableData);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
</script>

<style>
.box-card {
  /* width: 480px; */
  padding-left: 100px;
  padding-right: 100px;
}
.addCategoryForm-card {
  width: 500px;
  position: absolute;
  top: 400px;
  left: 500px;
}
</style>