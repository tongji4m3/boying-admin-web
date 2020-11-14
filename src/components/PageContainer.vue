<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- <el-col style="height: 100%"> -->
      <el-menu
        default-active="this.$route.path"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#BFCBD9"
        active-text-color="#329EF2"
        style="height: 100%"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="home">
          <i class="el-icon-setting"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="show">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">演出</span>
          </template>

          <el-menu-item index="show">
            <i class="el-icon-location"></i>
            <span slot="title">演出列表</span></el-menu-item
          >
          <el-menu-item index="addShow">
            <i class="el-icon-location"></i>
            <span slot="title">添加演出</span></el-menu-item
          >
          <el-menu-item index="category">
            <i class="el-icon-location"></i>
            <span slot="title">目录管理</span></el-menu-item
          >
        </el-submenu>
        <el-submenu index="order">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">订单</span>
          </template>
          <el-menu-item index="order">
            <i class="el-icon-location"></i>
            <span slot="title">订单列表</span></el-menu-item
          >
        </el-submenu>
        <el-submenu index="user">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="user">用户</span>
          </template>
          <el-menu-item index="user">
            <i class="el-icon-location"></i>
            <span slot="title">用户列表</span></el-menu-item
          >
        </el-submenu>
        <!-- <el-submenu index="security">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="security">权限</span>
          </template>
          <el-menu-item index="show">
            <i class="el-icon-location"></i>
            <span slot="title">用户列表</span></el-menu-item
          >
          <el-menu-item index="show">
            <i class="el-icon-location"></i>
            <span slot="title">角色列表</span></el-menu-item
          >
          <el-menu-item index="show">
            <i class="el-icon-location"></i>
            <span slot="title">菜单列表</span></el-menu-item
          >
          <el-menu-item index="show">
            <i class="el-icon-location"></i>
            <span slot="title">资源列表</span></el-menu-item
          >
        </el-submenu> -->
      </el-menu>
      <!-- </el-col> -->
    </el-aside>
    <el-main style="padding: 0px">
      <el-main style="height: 100%">
        <el-header>
          <!-- <div class="toggle-button" @click="toggleCollapse">|||</div> -->
          <el-breadcrumb separator="/" style="padding-top: 15px">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">演出</a></el-breadcrumb-item>
            <el-breadcrumb-item>查看演出</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <router-view></router-view>
      </el-main>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-menu {
  border-right-width: 0;
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #304156;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 100px;
  padding: 0px;
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
.toggle-button {
  background: #E9EEF3;
  color: #329EF2;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  width: 10px;
  height: 60px;
}
</style>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      breadList: [], // 路由集合
    };
  },
  methods: {
    // 点击切换左侧菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>