mm<template>
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
          <!-- <el-table-column label="演出编号" prop="showId"></el-table-column> -->
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
          <!-- <el-table-column
            label="演出最低价格"
            prop="minPrice"
          ></el-table-column>
          <el-table-column
            label="演出最高价格"
            prop="maxPrice"
          ></el-table-column> -->
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
                @click="update(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
          <!--  <el-table-column label="演出名称" prop="name"> </el-table-column>
    <el-table-column label="演出开始时间" prop="dayStart">
    </el-table-column>
    <el-table-column label="演出海报" prop="poster"> </el-table-column>
    <el-table-column label="演出地址" prop="showAddress"> </el-table-column> -->
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="按演出名称关键字搜索"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="提示" width="30%" :visible.sync="dialogVisible">
          <span>{{ dialogInfo }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <el-dialog title="编辑" width="80%" :visible.sync="updatedialogVisible">
          <el-card
            style="width: 80%; margin: auto"
            :body-style="{ padding: '30px' }"
          >
            <el-row :gutter="20">
              <el-col :span="8">
                <div>
                  <img
                    width="300"
                    height="430"
                    :src="show.poster"
                    class="image"
                  />
                </div>
              </el-col>
              <el-col :span="16">
                <div class="text">
                  <div class="showName">
                    <h2>{{ show.name }}</h2>
                  </div>
                  <br />
                  <div
                    class="minor-text"
                    v-if="
                      show.dayStart != undefined && show.dayEnd != undefined
                    "
                  >
                    <div class="showAddress">
                      <i
                        class="myicon myiconchengshi"
                        style="padding-right: 7px"
                      ></i
                      >演出城市:{{ show.city }}
                    </div>
                    <br /><i
                      class="myicon myiconshijian"
                      style="padding-right: 3px"
                    ></i>
                    演出时间:{{ show.dayStart.substring(0, 10) }}~{{
                      show.dayEnd.substring(0, 10)
                    }}
                  </div>
                  <div class="tip">
                    <i class="el-icon-info" style="padding-right: 3px"></i>
                    演出时间和场次时间均为演出当地时间
                  </div>
                  <br />
                  <div>
                    <i class="myicon myiconchangci"></i>
                    场次
                    <el-radio-group
                      v-model="sessionSelected"
                      @change="sessionChange()"
                      class="sessionGroup"
                      v-for="session in sessionList"
                      :key="session.showSessionId"
                    >
                      <el-radio-button
                        :label="session.showSessionId"
                        class="sessionRadioButton"
                        >{{ session.startTime | formatDateTime }}-{{
                          session.endTime | formatDateTime
                        }}</el-radio-button
                      >
                      <br />
                    </el-radio-group>
                  </div>
                  <!-- <div class="fundText">¥基础票价:{{ show.minPrice }}</div> -->
                  <div
                    v-show="this.classList != [] && this.classList.length != 0"
                  >
                    <div class="fundText">
                      <i
                        class="myicon myiconpiaozhong"
                        style="padding-right: 3px"
                      ></i
                      >票种
                    </div>
                    <el-radio-group
                      v-model="showClassSelected"
                      @change="classChange()"
                      class="classGroup"
                      v-for="showclass in classList"
                      :key="showclass.showClassId"
                    >
                      <el-radio-button
                        :label="showclass.showClassId"
                        class="classRadioButton"
                        >{{ showclass.name }} 票价:{{
                          showclass.price
                        }}
                        票量：{{ showclass.stock }} / {{ showclass.capacity }}
                      </el-radio-button>
                      <br />
                    </el-radio-group>
                    <!-- <div v-show="this.priceSelected != null" class="finalPrice">
                      最终价格: ¥{{ this.priceSelected }}
                    </div> -->
                  </div>

                  <!-- <div class="Buy" v-show="this.priceSelected != null">
                    <el-button
                      type="danger"
                      icon="myicon myicontubiaozhizuomoEban"
                      @click="buyTicket"
                    >
                      购票</el-button
                    >
                  </div> -->
                </div>
              </el-col>
            </el-row>
          </el-card>

          <span slot="footer" class="dialog-footer">
            <el-button @click="updatedialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updatedialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </el-card>
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
      tableData: [],
      dialogVisible: false, //对话框初始不可见
      search: "",
      key: 1, // table key
      formThead: fields, // 默认表头 Default header
      loading: true,
      updatedialogVisible: false,
      dialogInfo: "",
      show: {},
      sessionList: [],
      classList: [],
    };
  },
  methods: {
    //点击查看 按钮  的事件
    handleClick(info) {
      console.log(info);
      this.dialogVisible = true;
      this.dialogInfo = info;
      console.log(this.dialogVisible);
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
      console.log(row.showId);
      try {
        console.log("mounted");
        const res = await axios.post(
          `${api.API_URL}/show/delete/` + row.showId,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log("test");
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
        }
      } catch (err) {
        console.log(err);
      }
      this.tableData.splice(index, 1);
      console.log(index, row);
    },
    async update(info) {
      this.updatedialogVisible = true;
      this.show = info;
      await this.getShow();
      await this.getShowSession();
      await this.getShowClass();
      //   await this.getUser();
      console.log("show", this.show);
      setTimeout(() => {
        this.loading = false;
      }, 500);
      console.log(this.classList);
    },
    async getShow() {
      try {
        const res = await axios.post(
          `${api.API_URL}/show/detail` + "/" + this.show.showId
        );
        console.log(res);
        if (res.data.code === 200) {
          this.show = res.data.data;
        }
      } catch (err) {
        console.log(err);
        this.$message.error("获取演出信息失败");
      }
    },
    async getShowSession() {
      try {
        const res = await axios.post(this.$api.getShowSessionUrl, {
          showId: this.showId,
          pageNum: 1,
          pageSize: 10,
        });
        console.log(res);
        if (res.data.code === 200) {
          this.sessionList = res.data.data.list;
          this.sessionSelected = this.sessionList[0].showSessionId;
        }
      } catch (err) {
        console.log(err);
        this.$message.error("获取演出场次信息失败");
      }
    },

    async getShowClass() {
      try {
        const res = await axios.post(this.$api.getShowClassUrl, {
          sessionId: this.sessionSelected,
          pageNum: 1,
          pageSize: 10,
        });
        console.log(res);
        if (res.data.code === 200) {
          this.classList = res.data.data.list;
          this.showClassSelected = this.classList[0].showClassId;
          //   this.priceSelected = this.classList[0].price;
          //   this.finalPrice = this.priceSelected;
        } else {
          this.classList = [];
          this.showClassSelected = null;
        }
      } catch (err) {
        console.log(err);
        this.$message.error("获取演出票种失败");
      }
    },
    async reload() {
      try {
        console.log("mounted");
        const res = await axios.get(`${api.API_URL}/show/list`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log("res", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          for (var i = 0; i < this.tableData.length; i++) {
            this.getCategory(this.tableData[i].categoryId, i);
          }
          // console.log(this.tableData)
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
        console.log("mounted");
        const res = await axios.get(
          `${api.API_URL}/category/list/` + categoryId,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
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
