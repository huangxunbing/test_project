<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="info.query"
            clearable
            @clear="emptyHan"
          >
            <!-- 添加商品 -->
            <el-button slot="append" icon="el-icon-search" @click="getLoadDataLst"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="addListBox" type="primary" @click="addgoodsHan">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodData" border stripe index-text="#" class="goodstableBox">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="850"></el-table-column>
        <el-table-column prop="goods_number" label="商品价格" width="80"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column prop="add_time" label="添加时间" width="130"></el-table-column>
        <el-table-column prop="goods_id" label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editListHan(scope.row)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteListHan(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="info.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="info.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
  </div>
</template>

<script>
import http from '../../http/index.js'
export default {
  created() {
    // 获取表格数据
    this.getLoadDataLst()
  },
  data() {
    return {
      // 初始表格数据
      goodData: [],
      // 查询参数
      info: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 数据总条数
      total: 1
    }
  },
  methods: {
    // 上树生命周期获取表格数据
    getLoadDataLst() {
      http.get('getGoodsList', this.info, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取商品数据失败!')
        this.goodData = res.data.data.goods
        this.total = res.data.data.total
        this.info.pagenum = Number(res.data.data.pagenum)
      })
    },
    // 下拉分页监听
    handleSizeChange(newSize) {
      this.info.pagesize = newSize
      this.getLoadDataLst()
    },
    // 分页变化监听
    handleCurrentChange(newPage) {
      this.info.pagenum = newPage
      this.getLoadDataLst()
    },
    // list编辑监听
    editListHan(row) {},
    // list删除监听
    async deleteListHan(id) {
      const isdelete = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (isdelete === 'cancel') return this.$message.info('取消删除')
      http.delete('deleteLgoods', id, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('删除失败!')
        this.$message.success('删除成功!')
        this.getLoadDataLst()
      })
    },
    // 搜索按钮监听
    emptyHan() {
      this.info.query = ''
      this.getLoadDataLst()
    },
    // 添加商品路由跳转
    addgoodsHan() {
      this.$router.push({
        path: 'goods/add'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.addListBox {
  margin-left: 15px;
}
.goodstableBox {
  margin: 15px 0px 15px 0px;
}
</style>