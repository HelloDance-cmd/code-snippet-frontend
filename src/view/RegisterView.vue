<template>
  <div class="signup-container">
    <h2>注册新账户</h2>
    <Form :model="formData">
      <Row>
        <Col :span="12">
          <FormItem>
            <Input v-model:value="formData.firstName" placeholder="请输入名字" />
          </FormItem>
        </Col>
        <Col :span="12">
        <FormItem>
          <Input v-model:value="formData.lastName" @change="() => console.log('aa')" required placeholder="请输入姓氏" />
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="24">
        <FormItem style="width: 100%">
          <Input v-model:value="formData.email" required placeholder="请输入电子邮箱地址" type="email" />
        </FormItem>
        </Col>
      </Row>

      <Row>
        <Col :span="24">
        <FormItem style="width: 100%">
          <Input v-model:value="formData.password" required placeholder="请输入密码" type="password" />
        </FormItem>
        </Col>
      </Row>

      <Row>
        <Col :span="24">
        <FormItem style="width: 100%">
          <Input v-model:value="formData.confirmPassword" required placeholder="请再次输入密码" type="password" />
        </FormItem>
        </Col>
      </Row>

      <Row>
        <Col :span="24">
        <Button type="primary" @click="handleSubmit">注册</Button>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form, Row, Col, Input, Button, FormItem, message } from 'ant-design-vue';
import { reactive } from 'vue';
import { fetchUserRegister } from '../utils/userReqeust';
import { useRouter } from 'vue-router';

const router = useRouter();

interface FormDataState {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
}

const formData = reactive<FormDataState>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const handleSubmit = () => {

  if (formData.password != formData.confirmPassword) {
    message.info('两次密码不一致');
    return;
  }

  const username = formData.firstName.concat(' ').concat(formData.lastName);
  const password = formData.password;
  const email = formData.email;


  fetchUserRegister(username, password, email)
    .then(response => {
      
      if (response.status == 200) {
        message.info("注册成功", 3, () => {
          router.push("/login");
        })
      } else {
        message.error("注册失败".concat(response.data.toString()))
      }
    }).catch(reason => {
      message.error("注册失败".concat(reason))
    });
};
</script>

<style scoped>
/* 整体容器样式 */
.signup-container {
  width: 480px;
  margin: 50px auto;
  padding: 30px;
  /* border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  background-color: #fff;
}

/* 标题样式 */
.signup-container h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  text-align: center;
}

/* 表单项样式 */
.ant-form-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 表单项标签样式 */
.ant-form-item-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  float: none;
  width: auto;
  text-align: left;
  line-height: normal;
}

/* 输入框样式 */
.ant-input {
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

/* 复选框样式 */
.ant-checkbox-wrapper {
  font-size: 14px;
  color: #666;
}

/* 按钮样式 */
.ant-btn-primary {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  font-size: 16px;
}

.ant-form-item>div {
  width: 100%;
}
</style>