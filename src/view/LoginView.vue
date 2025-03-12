<template>
  <Form class="login-form" :model="formData" @submit="handleSubmit">
    <h2>登录</h2>
    <Form.Item>
      <Input v-model:value="formData.username" placeholder="邮箱地址" />
    </Form.Item>
    <Form.Item>
      <Input.Password v-model:value="formData.password" placeholder="密码" />
      <RouterLink to="/forget-password" style="float: right;">忘记密码？</RouterLink>
    </Form.Item>
    <Form.Item>
      <Button type="primary" html-type="submit" block>
        登录
      </Button>
    </Form.Item>
    <RouterLink class="register" to="/register">
      还不是CODE SNIPPPET的用户，点此开始注册
    </RouterLink>
  </Form>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { Form, Input, Button, message } from 'ant-design-vue';
import { fetchUserLogin } from '../utils/userReqeust';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = reactive({
  username: '',
  password: ''
});

const handleSubmit = async () => {
  const resp = await fetchUserLogin(formData.username, formData.password);

  if(resp.status == 200){ 
    message.info("登录成功");
    
    localStorage.setItem("token", resp.data.data);

    router.push("/dashboard");
  }
};

</script>

<style scoped>
h2 {

  font-size: 24px;
  color: #333;
  text-align: center;
}

.login-form {
  max-width: 300px;
  margin: 50px auto;
}

.register {
  margin-top: 16px;
  display: block;
  color: #1890ff;
}
</style>