<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never" style="text-align: left">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        :data="list"
        :key="key"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="活动id" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="座次id" align="center">
          <template slot-scope="scope">{{ scope.row.seatId }}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">{{
            scope.row.startTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">{{
            scope.row.endTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
      </el-table>
    </div>

    <el-dialog title="编辑活动" :visible.sync="dialogVisible" width="40%">
      <el-form :inline="true" :model="user" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="user.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="user.price" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item label="演出开始时间">
          <el-date-picker
            disabled
            v-model="user.startTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
          <!-- <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="user.startTime"
            style="width: 100%"
            format="yyyy 年 MM 月 dd 日 HH 小时 mm 分钟 ss 秒"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker> -->
        </el-form-item>
        <el-form-item label="演出结束时间">
          <el-date-picker
            disabled
            v-model="user.endTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
          <!-- <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="user.endTime"
            style="width: 100%"
            format="yyyy 年 MM 月 dd 日 HH 小时 mm 分钟 ss 秒"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker> -->
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
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
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        console.log(err);
        this.$message.error("添加失败");
      }
    },
    async deleteUser(index, row) {
      console.log(row);
      try {
        const res = await axios.post(`${api.API_URL}/promo/delete/` + row.id, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.error(res.data.code + res.data.message);
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
        } else {
          this.$message.error(res.data.code + res.data.message);
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
      console.log("updateUser" + id);
      console.log(user);
      try {
        var mystart = new Date(user.startTime);
        const startyear = mystart.getFullYear();
        const startmonth = mystart.getMonth() + 1;
        const startday = mystart.getDate();
        const starthour = mystart.getHours();
        const startminute = mystart.getMinutes();
        const startsecond = mystart.getSeconds();
        var myEnd = new Date(user.endTime);
        const endyear = myEnd.getFullYear();
        const endmonth = myEnd.getMonth() + 1;
        const endday = myEnd.getDate();
        const endhour = myEnd.getHours();
        const endminute = myEnd.getMinutes();
        const endsecond = myEnd.getSeconds();
        var startformat = "yyyy-MM-dd HH:mm:ss";
        var endformat = "yyyy-MM-dd HH:mm:ss";
        var start = startformat
          .replace("yyyy", startyear)
          .replace("MM", startmonth > 9 ? startmonth : `0${startmonth}`)
          .replace("dd", startday > 9 ? startday : `0${startday}`)
          .replace("HH", starthour > 9 ? starthour : `0${starthour}`)
          .replace("mm", startminute > 9 ? startminute : `0${startminute}`)
          .replace("ss", startsecond > 9 ? startsecond : `0${startsecond}`);
        console.log("start", start);
        var end = endformat
          .replace("yyyy", endyear)
          .replace("MM", endmonth > 9 ? endmonth : `0${endmonth}`)
          .replace("dd", endday > 9 ? endday : `0${endday}`)
          .replace("HH", endhour > 9 ? endhour : `0${endhour}`)
          .replace("mm", endminute > 9 ? endminute : `0${endminute}`)
          .replace("ss", endsecond > 9 ? endsecond : `0${endsecond}`);
        console.log("end", end);
        const res = await axios.post(
          `${api.API_URL}/promo/update/` + id,
          {
            endTime: start,
            name: user.name,
            price: user.price,
            seatId: user.seatId,
            startTime: end,
          },
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
        } else {
          this.$message.error(res.data.code + res.data.message);
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
        this.updateUser(this.user.id, this.user);
        this.dialogVisible = false;
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
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        this.$message.error("更新信息失败");
      }
    },
    async getList() {
      this.listLoading = true;
      try {
        const res = await axios.get(`${api.API_URL}/promo/list`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("/promo/list", res);

        if (res.data.code == 200) {
          this.list = res.data.data;
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
        console.log("this.list", this.list);
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      } catch (err) {
        console.log(err);
      }
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
        } else {
          this.$message.error(res.data.code + res.data.message);
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
        } else {
          this.$message.error(res.data.code + res.data.message);
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


