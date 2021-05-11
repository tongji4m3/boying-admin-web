<template>
  <div>
    <el-card class="operate-container" shadow="never" style="text-align: left">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <div class="table-container">
        <el-table
          :key="key"
          :data="
            tableData.filter(
              (data) =>
                !search ||
                data.name.toLowerCase().includes(search.toLowerCase())
            )
          "
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column label="演出编号" prop="id"></el-table-column>
          <el-table-column label="演出名称" prop="name"></el-table-column>
          <el-table-column label="演出目录" prop="category"> </el-table-column>
          <el-table-column label="演出海报" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.poster"
                :preview-src-list="[scope.row.poster]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            label="演出最低价格"
            prop="minPrice"
          ></el-table-column>
          <el-table-column
            label="演出最高价格"
            prop="maxPrice"
          ></el-table-column>
          <el-table-column label="演出地址" prop="address"></el-table-column>
          <el-table-column label="演出开始时间" width="160" align="center">
            <template slot-scope="scope">{{
              scope.row.startTime | formatDateTime
            }}</template>
          </el-table-column>
          <el-table-column label="演出结束时间" width="160" align="center">
            <template slot-scope="scope">{{
              scope.row.endTime | formatDateTime
            }}</template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="mini"
                style="margin-left: 0"
                @click="handleClick(scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                style="margin-left: 0"
                @click="handleClickSeat(scope.row.id)"
                >座次</el-button
              >
            </template>
          </el-table-column>
          <!--  <el-table-column label="演出名称" prop="name"> </el-table-column>
    <el-table-column label="演出开始时间" prop="dayStart">
    </el-table-column>
    <el-table-column label="演出海报" prop="poster"> </el-table-column>
    <el-table-column label="演出地址" prop="showAddress"> </el-table-column> -->
          <!-- <el-table-column align="center">
            <template slot="header">
              <el-input
                v-model="search"
                size="mini"
                placeholder="按演出名称关键字搜索"
              />
            </template>
          </el-table-column> -->
        </el-table>
        <!-- <el-dialog
          title="提示"
          width="30%"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
        >
          <span>{{ dialogInfo }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog> -->
      </div>
    </el-card>

    <el-dialog
      title="座次信息"
      :visible.sync="handleClickSeatVisiable"
      width="50%"
      :before-close="handleClose"
    >
      <el-table :data="seatTable" style="width: 100%">
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column prop="capacity" label="容量"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="editSeat(scope.$index, scope.row)"
              >编辑</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <el-button type="common" @click="addSeat()">添加</el-button>
    </el-dialog>

    <el-dialog
      :title="isEdit ? '编辑座次' : '添加座次'"
      :visible.sync="addSeatVisiable"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="addSeatTable" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="addSeatTable.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="addSeatTable.price" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item label="容量">
          <el-input
            v-model="addSeatTable.capacity"
            placeholder="容量"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="isEdit" @click="updateSeatSubmit"
            >修改</el-button
          >
          <el-button v-else type="primary" @click="addSeatSubmit"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import axios from "axios";
import api from "@/assets/api.js";
import qs from "qs";
import { formatDate } from "@/utils/date";

const fields = [
  { label: "演出编号", prop: "showId" },
  { label: "演出名称", prop: "name" },
  { label: "演出目录编号", prop: "categoryId" },
  { label: "演出目录", prop: "category" },

  { label: "演出海报", prop: "poster" },
  { label: "演出详情", prop: "details" },
  { label: "演出最低价格", prop: "minPrice" },
  // { label: "演出最低价格", prop: "showMinPrice" },
  { label: "演出最高价格", prop: "maxPrice" },
  // { label: "演出优先级", prop: "showWeight" },
  // { label: "演出城市", prop: "showCity" },
  { label: "演出地址", prop: "address" },
  // { label: "演出时间", prop: "showTime" },
  { label: "演出开始时间", prop: "dayStart" },
  { label: "演出结束时间", prop: "dayEnd" },
];

export default {
  async mounted() {
    this.reload();
  },
  data() {
    return {
      isEdit: false,
      handleClickSeatVisiable: false, //座次详情表格
      addSeatVisiable: false, //添加座次表格
      seatTable: [],
      addSeatTable: {},
      tableData: [],
      //   dialogVisible: false, //对话框初始不可见
      search: "",
      key: 1, // table key
      formThead: fields, // 默认表头 Default header
      loading: true,
      dialogInfo: "",
    };
  },
  methods: {
    //点击查看 按钮  的事件
    handleClick(info) {
      console.log("info", info);
      //   this.dialogVisible = true;
      //   this.dialogInfo = info;
      //   console.log(this.dialogVisible);
      this.$router.push({
        path: "/UpdateShow",
        query: { showId: info.id },
      });
    },
    //点击座次按钮
    async handleClickSeat(id) {
      try {
        const res = await axios.get(`${api.API_URL}/seat/getShowSeat/` + id, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("/seat/list/", res.data);
        if (res.data.code == 200) {
          this.seatTable = res.data.data;
          console.log(this.seatTable);
          this.handleClickSeatVisiable = true;
        } else {
          this.$message.error("查看座次失败");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("查看座次失败");
      }
    },
    //添加座次
    addSeat() {
      this.addSeatVisiable = true;
      this.isEdit = false;
      console.log("this.seatTable[0].showId", this.seatTable[0].showId);
      this.addSeatTable = {};
      this.addSeatTable.showId = this.seatTable[0].showId;
    },
    //编辑座次
    editSeat(index, row) {
      this.addSeatVisiable = true;
      this.isEdit = true;
      console.log("index,row", index, row);
      this.addSeatTable = row;
    },
    //添加座次提交
    async addSeatSubmit() {
      console.log("addSeatSubmit", this.addSeatTable);
      try {
        const res = await axios.post(
          `${api.API_URL}/seat/create`,
          this.addSeatTable,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("/seat/create", res.data);
        if (res.data.code == 200) {
          console.log(this.seatTable);
          this.addSeatVisiable = false;
          this.$message.success("添加成功");
          this.handleClickSeat(this.seatTable[0].showId);
        } else {
          this.$message.error("添加失败");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("添加失败");
      }
    },
    //修改座次提交
    async updateSeatSubmit() {
      console.log("updateSeatSubmit",this.addSeatTable);
            try {
        const res = await axios.post(
          `${api.API_URL}/seat/update/`+this.addSeatTable.id,
          this.addSeatTable,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("/seat/update", res.data);
        if (res.data.code == 200) {
          console.log(this.seatTable);
          this.addSeatVisiable = false;
          this.$message.success("修改成功");
          this.handleClickSeat(this.seatTable[0].showId);
        } else {
          this.$message.error("修改失败");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("修改失败");
      }
    },
    dialogVisibles(v) {
      this.dialogVisible = v;
      console.log(v);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async handleDelete(index, row) {
      console.log(row.id);
      try {
        console.log("mounted");
        const res = await axios.post(`${api.API_URL}/show/delete/` + row.id, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("test");
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.tableData.splice(index, 1);
          console.log(index, row);
        } else {
          this.$message.error("删除失败");
        }
      } catch (err) {
        console.log(err);
        this.$message.error("删除失败");
      }
    },
    async reload() {
      try {
        console.log("reload");
        const res = await axios.get(`${api.API_URL}/show/list`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log(res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          for (var i = 0; i < this.tableData.length; i++) {
            this.getCategory(this.tableData[i].categoryId, i);
          }
          console.log(this.tableData);
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCategory(categoryId, i) {
      try {
        const res = await axios.get(
          `${api.API_URL}/category/list/` + categoryId,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("getCategory", res);
        if (res.data.code == 200) {
          this.tableData[i].category = res.data.data.name;
          console.log(this.tableData[i].category);
          setTimeout(() => {
            this.loading = false;
          }, 500);
        }
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * 遍历列的所有内容，获取最宽一列的宽度
     * @param arr
     */
    getMaxLength(arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          let calcLen = this.getTextWidth(item);
          if (acc < calcLen) {
            acc = calcLen;
          }
        }
        return acc;
      }, 0);
    },
    /**
     * 使用span标签包裹内容，然后计算span的宽度 width： px
     * @param valArr
     */
    getTextWidth(str) {
      let width = 0;
      let html = document.createElement("span");
      html.innerText = str;
      html.className = "getTextWidth";
      document.querySelector("body").appendChild(html);
      width = document.querySelector(".getTextWidth").offsetWidth;
      document.querySelector(".getTextWidth").remove();
      return width;
    },
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
  watch: {
    /**
     * 监控表格的数据data，自动设置表格宽度
     * @param valArr
     */
    data(valArr) {
      const _this = this;
      this.formThead = fields.map(function (value) {
        const arr = valArr.map((x) => x[value.prop]); // 获取每一列的所有数据
        arr.push(value.label); // 把每列的表头也加进去算
        value.width = _this.getMaxLength(arr) + 20; // 每列内容最大的宽度 + 表格的内间距(依据实际情况而定)
        return value;
      });
    },
  },
};
</script>

<style scoped>
.el-button {
  text-size-adjust: auto;
}
</style>
