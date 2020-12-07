<template>
  <div >
    这里是主页
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <i class="el-icon-s-order"></i>
            <div class="total-title">今日订单总数</div>
            <div class="total-value">
              {{todayOrderNum}}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <i class="el-icon-coin"></i>
            <div class="total-title">今日销售总额</div>
            <div class="total-value" >{{todayOrderMoney}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <i class="el-icon-coin"></i>
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">{{YesterOrderMoney}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.text {
  font-size: 20px;
}

.el-icon-s-order {
  font-size: 50px;
  margin-top: 50px;
}

.el-icon-coin {
  font-size: 50px;
  margin-top: 50px;
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

export default {
  data() {
    return {
      todayOrderNum:10,
      todayOrderMoney:10,
      YesterOrderMoney:10,
      date:new Date(),
    };
  },
  mounted:function(){
    this.loadTodayOrder();
    this.loadTodaySale();
  },
  methods: {
    async loadTodayOrder(){
      const res = await axios.post(
          `${api.API_URL}/statistics/dayOrder`,
          this.date,{
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          }}
        );
        console.log(res);
        if (res.data.code == 200) {
          this.todayOrderNum=res.data.data;
        }
    },

    async loadTodaySale(){
      const res = await axios.post(
          `${api.API_URL}/statistics/dayOrderMoney`,
          this.date,{
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          }}
        );
        console.log(res);
        if (res.data.code == 200) {
          this.todayOrderMoney=res.data.data;
        }
    }

    
  },
};
</script>