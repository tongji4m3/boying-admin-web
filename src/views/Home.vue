<template>
  <div v-loading="loading" style="padding: 50px">
    <div>
      <div class="total-layout">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="total-frame">
              <div class="total-icon">
                <i class="el-icon-s-order"></i>
              </div>
              <div class="total-title">今日订单总数</div>
              <div class="total-value">
                {{ todayOrderNum }}
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="total-frame">
              <div class="total-icon">
                <i class="el-icon-coin"></i>
              </div>
              <div class="total-title">今日销售总额</div>
              <div class="total-value">{{ todayOrderMoney }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="total-frame">
              <div class="total-icon">
                <i class="el-icon-coin"></i>
              </div>
              <div class="total-title">平台销售总额</div>
              <div class="total-value">{{ allOrderMoney }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="total-frame">
              <div class="total-icon">
                <i class="el-icon-user-solid"></i>
              </div>
              <div class="total-title">今日新增用户</div>
              <div class="total-value">{{ todayUserNum }}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="statistics-layout">
        <div class="layout-title">订单统计</div>
        <el-row>
          <!-- <el-col :span="4">
            <div style="padding: 20px">
              <div>
                <div style="color: #909399; font-size: 14px">本月订单总数</div>
                <div style="color: #606266; font-size: 24px; padding: 10px 0">
                  10000
                </div>
                <div>
                  <span class="color-success" style="font-size: 14px"
                    >+10%</span
                  >
                  <span style="color: #c0c4cc; font-size: 14px">同比上月</span>
                </div>
              </div>
              <div style="margin-top: 20px">
                <div style="color: #909399; font-size: 14px">本周订单总数</div>
                <div style="color: #606266; font-size: 24px; padding: 10px 0">
                  1000
                </div>
                <div>
                  <span class="color-danger" style="font-size: 14px">-10%</span>
                  <span style="color: #c0c4cc; font-size: 14px">同比上周</span>
                </div>
              </div>
              <div style="margin-top: 20px">
                <div style="color: #909399; font-size: 14px">本月销售总额</div>
                <div style="color: #606266; font-size: 24px; padding: 10px 0">
                  100000
                </div>
                <div>
                  <span class="color-success" style="font-size: 14px"
                    >+10%</span
                  >
                  <span style="color: #c0c4cc; font-size: 14px">同比上月</span>
                </div>
              </div>
              <div style="margin-top: 20px">
                <div style="color: #909399; font-size: 14px">本周销售总额</div>
                <div style="color: #606266; font-size: 24px; padding: 10px 0">
                  50000
                </div>
                <div>
                  <span class="color-danger" style="font-size: 14px">-10%</span>
                  <span style="color: #c0c4cc; font-size: 14px">同比上周</span>
                </div>
              </div>
            </div>
          </el-col> -->
          <el-col :span="24">
            <div style="padding: 10px; border-left: 1px solid #dcdfe6">
              <el-date-picker
                style="float: right; z-index: 1"
                size="small"
                v-model="orderCountDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDateChange"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
              <div>
                <!-- <ve-line
                  :data="chartData"
                  :legend-visible="false"
                  :loading="loading"
                  :data-empty="dataEmpty"
                  :settings="chartSettings"
                ></ve-line> -->
                <ve-line :data="chartData" :settings="chartSettings"></ve-line>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text {
  font-size: 20px;
}

.total-layout {
  margin-top: 20px;
  /* margin: auto; */
}
.total-frame {
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: 80px;
  padding-right: 130px;
  padding-top: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.total-icon {
  color: #409eff;
  width: 60px;
  height: 60px;
  font-size: 50px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 300px;
  height: 200px;
  display: flex;
  margin-left: 200px;
  margin-top: 100px;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}
.address-content {
  padding: 20px;
  font-size: 18px;
}
</style>


<script>
import axios from "axios";
import api from "@/assets/api.js";
import qs from "qs";
import moment from "moment";
import { str2Date } from "@/utils/date";

// //画图用
// const DATA_FROM_BACKEND = {
//   columns: ["date", "orderCount", "orderAmount"],
// };

export default {
  data() {
    return {
      chartData11: {
        columns: ["日期", "访问用户", "下单用户", "下单率"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
        ],
      },
      todayOrderNum: 10,
      todayOrderMoney: 10,
      allOrderMoney: 10,
      todayUserNum: 10,
      date: new Date(),
      loading: true,

      //画图用
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2021);
              start.setMonth(1);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2021);
              start.setMonth(1);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      orderCountDate: "",
      chartSettings: {
        yAxisType: ["0.[00]a", "0.[00]a"],
        axisSite: {
          right: ["订单量"],
        },
        yAxisName: ["销售额", "订单量"],
      },

      chartData: {
        columns: ["日期", "订单量", "销售额"],
        rows: [],
      },
      dataEmpty: false,
    };
  },
  mounted: function () {
    this.loadTodayOrder();
    this.loadTodaySale();
    this.loadthisMonthSale();
    this.loadTodayUserStatistics();
  },
  created() {
    this.initOrderCountDate();
    this.getData();
  },
  methods: {
    async loadTodayOrder() {
      const res = await axios.post(
        `${api.API_URL}/statistics/dayOrder`,
        this.date,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      //   console.log(res);
      if (res.data.code == 200) {
        this.todayOrderNum = res.data.data;
      }
    },

    async loadTodaySale() {
      const res = await axios.post(
        `${api.API_URL}/statistics/dayOrderMoney`,
        this.date,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      //   console.log(res);
      if (res.data.code == 200) {
        this.todayOrderMoney = res.data.data;
      } else {
        this.$message.error(res.data.code + res.data.message);
      }
    },

    async loadthisMonthSale() {
      const res = await axios.post(
        `${api.API_URL}/statistics/AllOrderMoney`,
        {},
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      //   console.log(res);
      if (res.data.code == 200) {
        this.allOrderMoney = res.data.data;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } else {
        this.$message.error(res.data.code + res.data.message);
      }
    },

    async loadTodayUserStatistics() {
      const res = await axios.post(
        `${api.API_URL}/statistics/userDailyGrowth`,
        this.date,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      //   console.log(res);
      if (res.data.code == 200) {
        this.todayUserNum = res.data.data;
      }
    },

    //画图用
    handleDateChange() {
      console.log("handleDateChange");
      this.getData();
    },
    initOrderCountDate() {
      let start = new Date();
      start.setFullYear(2021);
      start.setMonth(4);
      start.setDate(1);
      const end = new Date();
      end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
      this.orderCountDate = [start, end];
    },

    async getData() {
      this.chartData.rows = [];
      console.log("hello");
      let start = new Date();
      let end = new Date();
      start.setTime(this.orderCountDate[0].getTime());
      end.setTime(this.orderCountDate[1].getTime());
      const res = await axios.post(
        `${api.API_URL}/statistics/periodStatistics`,
        {
          dateStart: start,
          dateEnd: end,
        },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      console.log("/statistics/periodStatistics", res);
      if (res.data.code == 200) {
        for (var i in res.data.data.dataList) {
          console.log(res.data.data.dataList[i].substring(0, 10));
          console.log(res.data.data.orderAmountList[i]);
          console.log(res.data.data.orderCount[i]);
          var item = {
            日期: res.data.data.dataList[i].substring(0, 10),
            订单量: res.data.data.orderAmountList[i],
            销售额: res.data.data.orderCount[i],
          };
          this.chartData.rows.push(item);
        }
        console.log("this.chartData", this.chartData);
      } else {
        this.$message.error(res.data.code + res.data.message);
      }
    },
  },
};
</script>