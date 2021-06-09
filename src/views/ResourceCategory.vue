<template>
  <div class="showView">
    <div v-loading="loading" style="padding: 50px">
      <el-table
        :data="tableData"
        border
        row-key="categoryId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="资源目录编号"> </el-table-column>
        <el-table-column prop="name" label="资源目录名称"> </el-table-column>

        <el-table-column prop="weight" label="资源目录权重"> </el-table-column>
        <!-- <el-table-column prop="status" label="是否启用">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            >
            </el-switch></template
        ></el-table-column> -->
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <!-- <el-button
              size="mini"
              type="info"
              @click="handledelete(scope.$index, scope.row)"
            >
              删除
            </el-button> -->
          </template></el-table-column
        >
      </el-table>
      <el-button type="primary" @click="handleAdd()">添加目录</el-button>

      <el-dialog
        :title="isEdit ? '编辑目录' : '添加目录'"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <el-form :model="categorySelected" label-width="150px" size="small">
          <el-form-item label="资源目录名称:">
            <el-input
              v-model="categorySelected.name"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源目录权重:">
            <el-input
              v-model="categorySelected.weight"
              style="width: 250px"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleDialogConfirm()" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ossClient from "../assets/config/aliyun.oss.client";
import axios from "axios";
import api from "@/assets/api.js";
import qs from "qs";

const defaultCategory = {
  categoryId: "",
  description: "",
  icon: "",
  name: "",
  parentId: 0,
  weight: 1,
  children: [],
};

export default {
  data() {
    return {
      images: [],
      uploadConf: {
        region: null,
        accessKeyId: null,
        accessKeySecret: null,
        bucket: null,
      },
      add: false,
      loading: true,
      dialogVisible: false,
      isEdit: false,
      firstCategory: {
        categoryId: "",
        description: "",
        icon: "",
        name: "",
        parentId: 0,
        weight: 1,
        children: [],
      },
      categorySelected: Object.assign({}, defaultCategory),
      tableData: [],
    };
  },
  methods: {
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.categorySelected = Object.assign({}, row);
    },
    async handledelete(index, row) {
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminCategory/delete/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.reload();
          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        this.$message.error("未知错误");
        console.log(err);
      }
    },
    async handleStatusChange(index, row) {
      console.log("handleStatusChange", index, row, row.id);
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminCategory/changeStatus/` + row.id,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("操作成功");
          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        this.$message.error("未知错误");
        console.log(err);
      }
    },
    async updateCategory(category) {
      this.loading = true;
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminCategory/update/` + category.id,
          {
            name: category.name,
            status: category.status,
            weight: category.weight,
          },
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        );
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("编辑成功");
          this.reload();
          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleDialogConfirm() {
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.isEdit) {
          this.updateCategory(this.categorySelected);
          this.dialogVisible = false;
          this.images = [];
        } else {
          console.log(this.add);
          this.addCategory(this.categorySelected);
          this.dialogVisible = false;
        }
      });
    },
    async handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.categorySelected = Object.assign({}, defaultCategory);
    },

    async addCategory(category) {
      try {
        const res = await axios.post(
          `${api.API_URL}/AdminCategory/create`,
          category
        );
        if (res.status == 200) {
          this.$message.success("添加成功");
          this.reload();
          this.add = false;
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        console.log(err);
        this.$message.error("添加失败");
      }
    },

    async reload() {
      this.loading = true;
      try {
        console.log("reload");
        const res = await axios.post(`${api.API_URL}/AdminCategory/listAll`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        console.log(res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          setTimeout(() => {
            this.loading = false;
          }, 500);
          console.log(this.tableData);
        } else {
          this.$message.error(res.data.code + res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    /**
     * 初始化
     */
    async init() {
      //获取阿里云token  这里是后台返回来的数据
      this.uploadConf.region = "oss-cn-shanghai";
      this.uploadConf.accessKeyId = "LTAI4FzMDhgBN9LMBr71T3Ny";
      this.uploadConf.accessKeySecret = "hTPgQQSyBgEDnfMNe06RPf8ecDafpz";
      this.uploadConf.bucket = "tongji-boying";
    },
    /**
     * 阿里云OSS上传
     */
    uploadHttp({ file }) {
      this.init();
      const { imgName } = "ALIOSS_IMG_";
      const fileName = `${imgName}/${Date.parse(new Date())}`; //定义唯一的文件名
      ossClient(this.uploadConf)
        .put(fileName, file, {
          ContentType: "image/jpeg",
        })
        .then(({ res, url, name }) => {
          if (res && res.status === 200) {
            console.log(`阿里云OSS上传图片成功回调`, res, url, name);
            console.log(url);
            this.categorySelected.icon = url;
          }
        })
        .catch((err) => {
          console.log(`阿里云OSS上传图片失败回调`, err);
        });
    },

    /**
     * 图片限制
     */
    beforeAvatarUpload(file) {
      const isJPEG = file.name.split(".")[1] === "jpeg";
      const isJPG = file.name.split(".")[1] === "jpg";
      const isPNG = file.name.split(".")[1] === "png";
      const isLt500K = file.size / 1024 / 1024 / 5 < 2;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("单张图片大小不能超过 5MB!");
      }
      return (isJPEG || isJPG || isPNG) && isLt500K;
    },

    /**
     * 移除图片
     */
    handleRemove(file, fileList) {
      console.log(`移除图片回调`, fileList);
    },
  },

  async mounted() {
    this.reload();
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>