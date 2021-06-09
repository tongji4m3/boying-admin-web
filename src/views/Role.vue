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
        <el-table-column label="角色id" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="角色名" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="账户数量" align="center">
          <template slot-scope="scope">{{ scope.row.adminCount }}</template>
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
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="allocMenu(scope.$index, scope.row)"
              >分配菜单</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="allocResource(scope.$index, scope.row)"
              >分配资源</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form :model="allocMenuForm" label-width="150px" size="small">
        <el-form-item label="角色名">
          <el-input v-model="user.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="user.description" style="width: 250px"></el-input>
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
        <el-button @click="handleDialogConfirm()" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="'分配菜单'"
      :visible.sync="allocMenuDialogVisible"
      width="40%"
    >
      <div v-for="(value, key) in adminMenuTreeList" :key="key">
        <b> {{ key }}</b>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group
          v-model="allocMenuForm"
          @change="handleCheckedMenuChange"
        >
          <el-checkbox
            v-for="adminMenu in value"
            :label="adminMenu.id"
            :key="adminMenu.id"
            >{{ adminMenu["title"] }}</el-checkbox
          >
        </el-checkbox-group>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="allocMenuDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="allocMenuconfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="'分配资源'"
      :visible.sync="allocResourceDialogVisible"
      width="40%"
    >
      <div v-for="(value, key) in adminResourceTreeList" :key="key">
        <b> {{ key }}</b>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group
          v-model="allocResourceForm"
          @change="handleCheckedResourceChange"
        >
          <el-checkbox
            v-for="adminResource in value"
            :label="adminResource.id"
            :key="adminResource.id"
            >{{ adminResource["name"] }}</el-checkbox
          >
        </el-checkbox-group>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="allocResourceDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="allocResourceconfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
      roleId: 0,
      allocResourceDialogVisible: false,
      adminResourceTreeList: [],
      allocResourceForm: [],
      allocMenuForm: [],
      allocMenuDialogVisible: false,
      adminMenuTreeList: [],
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
    this.getAdminMenuTreeList();
    this.getAdminResourceTreeList();
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
          `${api.API_URL}/AdminRole/create`,
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
        // console.log(res);
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.getList();
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
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
        //注意这里的row的status跟实际的status是相反的
        var url = "";
        if (row.status) {
          url =
            `${api.API_URL}/AdminRole/updateStatus/` + row.id + "?status=true";
        } else {
          url =
            `${api.API_URL}/AdminRole/updateStatus/` + row.id + "?status=false";
        }

        const res = await axios.post(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        if (res.data.code == 200) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
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
          this.getList();
        });
    },

    async deleteUser(row) {
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminRole/delete/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        if (res.data.code == 200) {
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        this.$message.error("删除失败");
      }
      this.getList();
    },

    handleDelete(index, row) {
      this.$confirm("是否要删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUser(row);
        })
        .catch(() => {
          this.$message.info("取消删除");
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
          `${api.API_URL}/AdminRole/update/` + id,
          user,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        if (res.data.code == 200) {
          this.$message.success("更新信息成功");
          this.getList();
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        this.$message.error("更新信息失败");
      }
    },
    handleDialogConfirm() {
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
        const res = await axios.post(`${api.API_URL}/AdminRole/listAll`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        // console.log("/AdminRole/list", res.data.data);
        if (res.data.code == 200) {
          this.list = res.data.data;
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
        // console.log("this.list", this.list);
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      } catch (err) {
        console.log(err);
      }
      // fetchList(this.listQuery).then(response => {
      //   this.listLoading = false;
      //   this.list = response.data.list;
      //   this.total = response.data.total;
      // });
    },
    async getAdminResourceTreeList() {
      try {
        const res = await axios.post(`${api.API_URL}/AdminResource/treeList`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("getAdminResourceTreeList", res);
        if (res.data.code == 200) {
          this.adminResourceTreeList = res.data.data;
          console.log("adminResourceTreeList", this.adminResourceTreeList);
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      } catch (err) {
        console.log(err);
      }
    },
    getRoleListByAdmin(adminId) {
      getRoleByAdmin(adminId).then((response) => {
        let allocRoleList = response.data;
        this.allocRoleIds = [];
        if (allocRoleList != null && allocRoleList.length > 0) {
          for (let i = 0; i < allocRoleList.length; i++) {
            this.allocRoleIds.push(allocRoleList[i].id);
          }
        }
      });
    },
    async getAdminMenuTreeList() {
      try {
        const res = await axios.post(`${api.API_URL}/AdminMenu/treeList2`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("2231321321312", res);
        if (res.data.code == 200) {
          this.adminMenuTreeList = res.data.data;
          //   console.log("adminMenuTreeList", this.adminMenuTreeList);
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      } catch (err) {
        console.log(err);
      }
    },

    handleCheckedMenuChange(value) {
      console.log("allocMenuFormallocMenuForm", this.allocMenuForm);
    },
    handleCheckedResourceChange(value) {
      console.log("allocResourceFormallocResourceForm", this.allocResourceForm);
    },
    async allocMenu(index, row) {
      this.allocMenuDialogVisible = true;
      this.roleId = row.id;
      this.allocMenuForm = [];
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminRole/listMenu/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          for (var i in res.data.data) {
            console.log(res.data.data[i]);
            this.allocMenuForm.push(res.data.data[i].id);
          }
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async allocMenuconfirm() {
      try {
        var param = {
          roleId: this.roleId,
          menuIds: this.allocMenuForm,
        };
        const res = await axios.post(
          `${api.API_URL}/AdminRole/allocMenu`,
          param,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("allocMenuconfirmallocMenuconfirm", res);
        if (res.data.code == 200) {
          this.$message.success("更新信息成功");
          this.getList();
          this.allocMenuDialogVisible = false;
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        this.$message.error("更新信息失败");
      }
    },
    async allocResource(index, row) {
      this.allocResourceDialogVisible = true;
      this.roleId = row.id;
      this.allocResourceForm = [];
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminRole/listResource/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          for (var i in res.data.data) {
            console.log(res.data.data[i]);
            this.allocResourceForm.push(res.data.data[i].id);
          }
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async allocResourceconfirm() {
      try {
        var param = {
          roleId: this.roleId,
          resourceIds: this.allocResourceForm,
        };
        const res = await axios.post(
          `${api.API_URL}/AdminRole/allocResource`,
          param,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("allocMenuconfirmallocMenuconfirm", res);
        if (res.data.code == 200) {
          this.$message.success("更新信息成功");
          this.getList();
          this.allocResourceDialogVisible = false;
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        this.$message.error("更新信息失败");
      }
    },
  },
};
</script>
<style scoped>
</style>


