<template>
  <el-container>
    <el-aside width="200px" style="height: 100%">
      <el-col style="height: 100%">
        <el-menu
          default-active="this.$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="height: 100%"
          router
        >
          <el-menu-item index="home">
            <i class="el-icon-setting"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="order">
            <i class="el-icon-setting"></i>
            <span slot="title">订单</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  height: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>