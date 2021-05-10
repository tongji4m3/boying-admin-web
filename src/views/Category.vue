<template>
  <div v-loading="loading" style="padding: 50px">
    <el-card>
      <el-table
        :data="tableData"
        border
        style="width: 80%; margin-left: 130px; margin-bottom: 30px"
        row-key="categoryId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="演出目录编号"> </el-table-column>
        <el-table-column prop="name" label="目录名称"> </el-table-column>
        <el-table-column prop="icon" label="目录图标">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.icon"
              :preview-src-list="[scope.row.icon]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="目录描述"> </el-table-column>
        <el-table-column prop="weight" label="目录权重"> </el-table-column>
        <el-table-column prop="adminDelete" label="是否启用">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="false"
              :inactive-value="true"
              v-model="scope.row.adminDelete"
            >
            </el-switch></template
        ></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
          </template></el-table-column
        >
      </el-table>
      <el-button type="primary" @click="handleAdd()">添加目录</el-button>
      <!-- <el-dialog title="提示" :visible.sync="add" width="30%">
        <el-form :model="firstCategory" status-icon label-width="100px">
          <el-form-item label="一级目录名" prop="age">
            <el-input v-model.number="firstCategory.name"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button type="primary" @click="cancle">取消</el-button>
      </el-dialog> -->

      <el-dialog
        :title="isEdit ? '编辑目录' : '添加目录'"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <el-form :model="categorySelected" label-width="150px" size="small">
          <el-form-item label="目录名称:">
            <el-input
              v-model="categorySelected.name"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="目录图标:">
            <el-image
              style="width: 100px; height: 100px"
              :src="categorySelected.icon"
              :preview-src-list="[categorySelected.icon]"
            ></el-image>
          </el-form-item>
          <el-form-item label="目录描述:">
            <el-input
              v-model="categorySelected.description"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="目录权重:">
            <el-input
              v-model="categorySelected.weight"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="目录图标:">
            <el-input
              v-model="categorySelected.icon"
              style="width: 250px"
            ></el-input>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleDialogConfirm()" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
import api from "@/assets/api.js";
import qs from "qs";

const defaultCategory = {
  categoryId: "",
  description: "",
  icon: "",
  name: "",
  parentId: 0,
  weight: 1,
  children: [],
};

export default {
  data() {
    return {
      add: false,
      loading: true,
      dialogVisible: false,
      isEdit: false,
      firstCategory: {
        categoryId: "",
        description: "",
        icon: "",
        name: "",
        parentId: 0,
        weight: 1,
        children: [],
      },
      categorySelected: Object.assign({}, defaultCategory),
      tableData: [],
    };
  },
  methods: {
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.categorySelected = Object.assign({}, row);
    },
    async handleStatusChange(index, row) {
      console.log("handleStatusChange", index, row, row.id);
      try {
        const res = await axios.post(
          `${api.API_URL}/category/admin_delete/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("操作成功");
          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          this.$message.error("未知错误");
        }
      } catch (err) {
        this.$message.error("未知错误");
        console.log(err);
      }
    },
    async updateCategory(category) {
      this.loading = true;
      try {
        const res = await axios.post(
          `${api.API_URL}/category/update` + "/" + category.categoryId,
          {
            parentId: category.parentId,
            name: category.name,
            weight: category.weight,
            icon: category.icon,
            description: category.description,
          },
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("编辑成功");
          this.reload();
          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          this.$message.error("未知错误编辑失败");
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          this.updateCategory(this.categorySelected);
          this.dialogVisible = false;
        } else {
          console.log(this.add);
          this.addCategory(this.categorySelected);
          this.dialogVisible = false;
        }
      });
    },
    async handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.categorySelected = Object.assign({}, defaultCategory);
    },

    async addCategory(category) {
      try {
        const res = await axios.post(
          `${api.API_URL}/category/create`,
          category
        );
        if (res.status == 200) {
          this.$message.success("添加成功");
          this.reload();
          this.add = false;
        }
      } catch (err) {
        console.log(err);
        this.$message.error("添加失败");
      }
    },

    async reload() {
      this.loading = true;
      try {
        console.log("reload");
        const res = await axios.get(`${api.API_URL}/category/listAll`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log(res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          setTimeout(() => {
            this.loading = false;
          }, 500);
          console.log(this.tableData);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },

  async mounted() {
    this.reload();
  },
};
</script>

<style scoped>
</style>