<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      status-icon
      class="login-page"
      label-position="top"
    >
      <el-form-item label="密码" required prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import qs from 'qs'
import request from '../../request'
import { Vue, Component } from 'vue-property-decorator'
import { Form, Button, FormItem, Input } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

@Component
export default class extends Vue {
  $refs!: {
    form: Form;
  }
  private form = {
    password: ''
  }
  private rules = {
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }

  private submitForm(): void {
    this.$refs.form.validate(valid => {
      if (valid) {
        request
          .post('/api/login', qs.stringify({ password: this.form.password }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(res => {
            const data: boolean = res.data
            if (data) {
              this.$router.push('/')
            } else {
              this.$message.error('登陆失败')
            }
          })
      } else {
        this.$message.error('先填写密码喔~')
        return false
      }
    })
  }
}
</script>

<style scoped>
.login-page {
  width: 300px;
  padding: 20px;
  margin: 100px auto 0;
  border: 1px solid #aaa;
}
</style>
