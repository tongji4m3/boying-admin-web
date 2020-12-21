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
          <el-col :span="4">
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
          </el-col>
          <el-col :span="20">
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
                <ve-line
                  :data="chartData"
                  :legend-visible="false"
                  :loading="loading"
                  :data-empty="dataEmpty"
                  :settings="chartSettings"
                ></ve-line>
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

//画图用
const DATA_FROM_BACKEND = {
  columns: ["date", "orderCount", "orderAmount"],
  rows: [
    { date: "2018-11-01", orderCount: 10, orderAmount: 1093 },
    { date: "2018-11-02", orderCount: 20, orderAmount: 2230 },
    { date: "2018-11-03", orderCount: 33, orderAmount: 3623 },
    { date: "2018-11-04", orderCount: 50, orderAmount: 6423 },
    { date: "2018-11-05", orderCount: 80, orderAmount: 8492 },
    { date: "2018-11-06", orderCount: 60, orderAmount: 6293 },
    { date: "2018-11-07", orderCount: 20, orderAmount: 2293 },
    { date: "2018-11-08", orderCount: 60, orderAmount: 6293 },
    { date: "2018-11-09", orderCount: 50, orderAmount: 5293 },
    { date: "2018-11-10", orderCount: 30, orderAmount: 3293 },
    { date: "2018-11-11", orderCount: 20, orderAmount: 2293 },
    { date: "2018-11-12", orderCount: 80, orderAmount: 8293 },
    { date: "2018-11-13", orderCount: 100, orderAmount: 10293 },
    { date: "2018-11-14", orderCount: 10, orderAmount: 1293 },
    { date: "2018-11-15", orderCount: 40, orderAmount: 4293 },
  ],
};

export default {
  data() {
    return {
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
              start.setFullYear(2018);
              start.setMonth(10);
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
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      orderCountDate: "",
      chartSettings: {
        xAxisType: "time",
        area: true,
        axisSite: { right: ["orderAmount"] },
        labelMap: { orderCount: "订单数量", orderAmount: "订单金额" },
      },
      chartData: {
        columns: [],
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
      console.log(res);
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
      console.log(res);
      if (res.data.code == 200) {
        this.todayOrderMoney = res.data.data;
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
      console.log(res);
      if (res.data.code == 200) {
        this.allOrderMoney = res.data.data;
        setTimeout(() => {
          this.loading = false;
        }, 500);
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
      console.log(res);
      if (res.data.code == 200) {
        this.todayUserNum = res.data.data;
      }
    },

    //画图用
    handleDateChange() {
      this.getData();
    },
    initOrderCountDate() {
      let start = new Date();
      start.setFullYear(2018);
      start.setMonth(10);
      start.setDate(1);
      const end = new Date();
      end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
      this.orderCountDate = [start, end];
    },

    getData() {
      setTimeout(() => {
        this.chartData = {
          columns: ["date", "orderCount", "orderAmount"],
          rows: [],
        };
        for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          let item = DATA_FROM_BACKEND.rows[i];
          let currDate = str2Date(item.date);
          let start = this.orderCountDate[0];
          let end = this.orderCountDate[1];
          if (
            currDate.getTime() >= start.getTime() &&
            currDate.getTime() <= end.getTime()
          ) {
            this.chartData.rows.push(item);
          }
        }
        this.dataEmpty = false;
        this.loading = false;
      }, 1000);
    },
  },
};
</script>