<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>

        <el-table-column prop="path" label="路径"></el-table-column>

        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                <el-tag type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
                <el-tag type="warning" v-if="scope.row.level === '2'">三级权限</el-tag>
            </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
import http from '../../http/index.js'
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      // 权限列表数据
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表数据
    getRightsList() {
      // 不带参数,在http里直接写死为list
      http.get('getRightsList1', res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取权限列表失败!请重试!')
        this.rightsList = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>