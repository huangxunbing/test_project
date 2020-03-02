<template>
  <div>
    <!-- 退出按钮 -->
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出按钮
    logout() {
      // 清空token
      // 并跳转到lonin
      window.sessionStorage.clear()
      this.$router.push('/login')
      return this.$message.success('退出成功!')
    }
  }
}
</script>

<style lang="less" scoped>
</style>