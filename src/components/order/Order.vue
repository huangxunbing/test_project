<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orederList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="700px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <!-- 操作区 -->
        <el-table-column label="操作" prop="order_number">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog(scope.row)"
            ></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showlogistics"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="info.pagenum"
        :page-sizes="[1, 3, 5, 10, 15, 20]"
        :page-size="info.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="修改地址" :visible.sync="dialogVisible1" width="50%" @close="outcit">
      <!-- 表单区域 -->
      <el-form :model="UPruleForm" :rules="rules" ref="UpruleForm" label-width="100px">
        <el-form-item label="省市区/县" prop="name">
          <el-cascader :options="citData" v-model="UPruleForm.name"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prsop="address">
          <el-input v-model="UPruleForm.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog title="物流进度" :visible.sync="dialogVisible2" width="50%">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in logisticsData"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http/index.js'
import cit from './citydata.js'
export default {
  created() {
    this.getOrder()
  },
  data() {
    return {
      // ajax参数
      info: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      // total
      total: 1,
      // 订单列表
      orederList: [],
      // 修改地址对话框
      dialogVisible1: false,
      dialogVisible2: false,
      // 修改地址表单
      UPruleForm: {
        name: '',
        address: ''
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      citData: cit,
      logisticsData: [],
      reverse: false
    }
  },
  methods: {
    // 获取表单数据
    getOrder() {
      http.get('getOrderList', this.info, res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取信息失败!')
        this.total = res.data.data.total
        this.orederList = res.data.data.goods
      })
    },
    // 下拉分页监听
    handleSizeChange(newSize) {
      this.info.pagesize = newSize
      this.getOrder()
    },
    // 分页监听
    handleCurrentChange(newPage) {
      this.info.pagenum = newPage
      this.getOrder()
    },
    // 修改地址
    showDialog(row) {
      this.dialogVisible = true
    },
    // 关闭对话框清空数据
    outcit() {
      this.$refs.UpruleForm.resetFields()
    },
    // 物流对话框
    showlogistics() {
      http.get('getlogistics', res => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取物流失败')
        this.logisticsData = res.data.data
      })
      this.dialogVisible2 = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>