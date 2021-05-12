<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never" style="text-align: left">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        size="mini"
        class="btn-add"
        @click="handleAdd()"
        style="float: right"
        >添加</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        :data="list"
        :key="key"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="资源id" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="资源目录" align="center">
          <template slot-scope="scope">{{ scope.row.categoryId }}</template>
        </el-table-column>
        <el-table-column label="资源名" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="权重" align="center">
          <template slot-scope="scope">{{ scope.row.weight }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.status"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!-- <template slot-scope="scope">
            <el-button type="text" size="mini">分配菜单</el-button>
            <el-button type="text" size="mini">分配资源</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini">删除</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form :model="user" ref="adminForm" label-width="150px" size="small">
        <el-form-item label="角色名">
          <el-input v-model="user.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="user.description" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="user.url" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="user.weight" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="user.status">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- <el-dialog title="分配角色" :visible.sync="allocDialogVisible" width="30%">
      <el-select
        v-model="allocRoleIds"
        multiple
        placeholder="请选择"
        size="small"
        style="width: 80%"
      >
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="handleAllocDialogConfirm()"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import axios from "axios";
import api from "@/assets/api.js";
import qs from "qs";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
};
const defaultUser = {
  id: null,
  name: null,
  description: null,
  createTime: null,
  status: true,
  weight: 2,
};
export default {
  name: "adminList",
  data() {
    return {
      key: 1, // table key
      search: "",
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      user: Object.assign({}, defaultUser),
      isEdit: false,
      allocDialogVisible: false,
      allocRoleIds: [],
      allRoleList: [],
      allocAdminId: null,
    };
  },
  created() {
    this.getList();
    // this.getAllRoleList();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    async addUser(user) {
      user.createTime = new Date();
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminResource/create`,
          {
            description: user.description,
            name: user.name,
            weight: user.weight,
            status: user.status,
          },
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.getList();
        }
      } catch (err) {
        console.log(err);
        this.$message.error("添加失败");
      }
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.user = Object.assign({}, defaultUser);
    },

    async updateStatus(row) {
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminResource/changeStatus/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("updateStatus", res);
        if (res.data.code == 200) {
          this.$message.success("修改成功");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("修改失败");
      }
      this.getList();
    },

    async handleStatusChange(index, row) {
      this.$confirm("是否要修改该状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.updateStatus(row);
        })
        .catch(() => {
          this.$message.info("取消修改");
          console.log("catch");
          this.getList();
        });
    },

    async deleteUser(row) {
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminUser/delete/` + row.userId,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("删除失败");
      }
      this.getList();
    },

    handleDelete(index, row) {
      this.$confirm("是否要删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUser(row);
        })
        .catch(() => {
          this.$message.info("取消删除");
          console.log("catch");
          this.getList();
        });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.user = Object.assign({}, row);
    },
    async updateUser(id, user) {
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminResource/update/` + id,
          user,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("更新信息成功");
          this.getList();
        }
      } catch (err) {
        console.log(err);
        this.$message.error("更新信息失败");
      }
    },
    handleDialogConfirm() {
      console.log(this.user);
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          this.updateUser(this.user.id, this.user);
          this.dialogVisible = false;
        } else {
          this.addUser(this.user);
          this.dialogVisible = false;
        }
      });
    },
    handleAllocDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("adminId", this.allocAdminId);
        params.append("roleIds", this.allocRoleIds);
        allocRole(params).then((response) => {
          this.$message({
            message: "分配成功！",
            type: "success",
          });
          this.allocDialogVisible = false;
        });
      });
    },
    //暂时无用
    handleSelectRole(index, row) {
      this.allocAdminId = row.id;
      this.allocDialogVisible = true;
      this.getRoleListByAdmin(row.id);
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await axios.post(`${api.API_URL}/AdminResource/listAll`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("/AdminResource/listAll", res.data.data);
        if (res.data.code == 200) {
          this.list = res.data.data;
        }
        console.log("this.list", this.list);
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
</style>


