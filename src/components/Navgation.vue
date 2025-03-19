<template>
  <nav>
    <section class="panel">
      <section>
        <RouterLink to="/">
          Code Snippet
        </RouterLink>
      </section>
      <Button type="primary" size="large">
        <RouterLink to="/dashboard">
          面板
        </RouterLink>
      </Button>
    </section>
    
    <section class="user-control" v-if="signInStatus">
      <Button type="primary">
        <RouterLink to="/register">注册</RouterLink>
      </Button>
      <Button>
        <RouterLink to="/login">登录</RouterLink>
      </Button>
    </section>
    <section class="user-control" v-else>
      <span>欢迎你，</span>
      <span>{{ username }}</span>
    </section>
  </nav>
</template>

<script lang="ts" setup>
import { Button } from 'ant-design-vue';
import { fetchTokenIsExpired, fetchWhoAmI } from '../utils/userReqeust';
import { onMounted, ref } from 'vue';

const signInStatus = ref<boolean>(false);
const username = ref<string>();
const UNAUTHORIZED_CODE = 401;

onMounted(() => {
  fetchTokenIsExpired()
    .then(response => {
      console.log(response)
      const statusCode = response.data.code;
      signInStatus.value = statusCode != UNAUTHORIZED_CODE;
    });

  fetchWhoAmI()
    .then((response) => {
      const {username: uName} = response.data.data
      username.value = uName;
    })
})


</script>

<style scoped lang="scss">
  nav {
    $gap: 10px;
    width: 100%;
    height: 60px;
    background-color: white;
    padding: 0 20px;

    display: flex;
    flex-direction: row;

    align-items: center;

    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    & > section {
      width: 40%;
    }

    .panel {
      a {
        all: unset;
      }
      display: flex;
      
      align-items: center;
      gap: $gap;
      flex: 1;

      text-transform: uppercase;
      font-weight: bold;
    }

    .user-control {
      display: flex;
      flex-direction: row;
      justify-self: end;
      gap: $gap;
      justify-content: flex-end;
    }
  }
</style>