<template>
   
  <div class="app-container">
    <!-- <el-card class="filter-container" shadow="never" align="left">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              v-model="listQuery.keyword"
              class="input-width"
              placeholder="账号"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card> -->
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
        <el-table-column label="用户id" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="真实姓名" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="账号创建时间" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="最后登录时间" align="center">
          <template slot-scope="scope">{{
            scope.row.loginTime | formatDateTime
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
              @click="allocRole(scope.$index, scope.row)"
              >分配角色</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="editUser(scope.$index, scope.row)"
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
        <!-- <el-table-column align="center">
          <template slot="header">
            <el-input
              v-model="search"
              size="mini"
              placeholder="按用户名关键字搜索"
            />
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10, 15, 20]"
        :total="total"
      >
      </el-pagination>
    </div> -->
    <el-dialog
      :title="isEdit ? '编辑用户' : '添加用户'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form :model="user" ref="adminForm" label-width="150px" size="small">
        <el-form-item label="用户名：">
          <el-input v-model="user.username" style="width: 250px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="电话号码">
          <el-input v-model="user.phone" style="width: 250px"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="真实姓名：">
          <el-input v-model="user.realName" style="width: 250px"></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱：">
          <el-input v-model="user.email" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input
            v-model="user.password"
            type="password"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否启用：">
          <el-radio-group v-model="user.userstatus">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="allocDialogVisible" width="30%">
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
  userId: null,
  username: null,
  phone: null,
  realName: null,
  password: null,
  email: null,
  createTime: null,
  userstatus: true,
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
      adminId: 0,
    };
  },
  created() {
    this.getList();
    this.getAllRoleList();
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
          `${api.API_URL}/AdminUser/register`,
          {
            email: user.email,
            icon: "",
            password: user.password,
            username: user.username,
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
    async deleteUser(index, row) {
      console.log(row);
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminUser/delete/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.error("删除失败");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("删除失败");
      }
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.user = Object.assign({}, defaultUser);
    },
    editUser(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.user = Object.assign({}, row);
    },
    async updateStatus(row) {
      try {
        //注意这里的row的status跟实际的status是相反的
        var url = "";
        if (row.status) {
          console.log("row.status", false);
          url =
            `${api.API_URL}/AdminUser/updateStatus/` + row.id + "?status=true";
        } else {
          console.log("row.status", true);

          url =
            `${api.API_URL}/AdminUser/updateStatus/` + row.id + "?status=false";
        }
        console.log("row", row, url);

        const res = await axios.post(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
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

    handleDelete(index, row) {
      this.$confirm("是否要删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUser(index, row);
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
          `${api.API_URL}/AdminUser/update/` + id,
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
    async handleAllocDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log("this.allocRoleIds", this.allocRoleIds);
        this.updateUserRole();
      });
    },
    async updateUserRole() {
      try {
        var param = {
          userId: this.adminId,
          roleIds: this.allocRoleIds,
        };
        const res = await axios.post(
          `${api.API_URL}/AdminUser/AdminRole/update`,
          param,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("/AdminUser/AdminRole/update", res);
        if (res.data.code == 200) {
          this.$message.success("更新角色成功");
          this.getList();
          this.allocDialogVisible = false;
        }
      } catch (err) {
        this.$message.error("更新信息失败");
      }
    },
    //暂时无用
    // handleSelectRole(index, row) {
    //   this.allocAdminId = row.id;
    //   this.allocDialogVisible = true;
    //   this.getRoleListByAdmin(row.id);
    // },
    async getList() {
      this.listLoading = true;
      try {
        const res = await axios.post(`${api.API_URL}/AdminUser/list`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        // console.log("/AdminUser/list", res);
        if (res.data.message == "不存在任何用户") {
          this.list = null;
        }
        if (res.data.code == 200) {
          this.list = res.data.data.list;
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
    async allocRole(index, row) {
      this.allocRoleIds = []; //先清空
      this.adminId = row.id;
      console.log("allocRole", this.allRoleList);
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminUser/AdminRole/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("/AdminUser/AdminRole/", res.data.data);
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.data.length; i++) {
            this.allocRoleIds.push(res.data.data[i].id);
          }
        }
        // console.log("this.allocRoleIds", this.allocRoleIds);
      } catch (err) {
        console.log(err);
      }
      this.allocDialogVisible = true;
    },
    async getAllRoleList() {
      try {
        const res = await axios.post(`${api.API_URL}/AdminRole/listAll`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("/AdminRole/listAll", res.data.data);
        if (res.data.code == 200) {
          this.allRoleList = res.data.data;
        }
        console.log("this.allRoleList", this.allRoleList);
      } catch (err) {
        console.log(err);
      }
    },
    // getRoleListByAdmin(adminId) {
    //   getRoleByAdmin(adminId).then((response) => {
    //     let allocRoleList = response.data;
    //     this.allocRoleIds = [];
    //     if (allocRoleList != null && allocRoleList.length > 0) {
    //       for (let i = 0; i < allocRoleList.length; i++) {
    //         this.allocRoleIds.push(allocRoleList[i].id);
    //       }
    //     }
    //   });
    // },
  },
};
</script>
<style scoped>
</style>


