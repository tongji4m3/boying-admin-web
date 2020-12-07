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
</style>


<script>
import axios from "axios";
import api from "@/assets/api.js";
import qs from "qs";
import moment from "moment";

export default {
  data() {
    return {
      todayOrderNum: 10,
      todayOrderMoney: 10,
      allOrderMoney: 10,
      todayUserNum: 10,
      date: new Date(),
      loading: true,
    };
  },
  mounted: function () {
    this.loadTodayOrder();
    this.loadTodaySale();
    this.loadthisMonthSale();
    this.loadTodayUserStatistics();
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
        }, 1000);
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
  },
};
</script>