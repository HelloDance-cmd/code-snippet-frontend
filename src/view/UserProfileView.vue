<template>
    <Space>
        <Avatar :size="128">
        <template #icon>
            <UserOutlined />
        </template>
        </Avatar>
        <Space direction="vertical">
        <section style="font-size: 160%">
            {{ userInfo?.username }}
        </section>
        <section>
            {{ userInfo?.email }}
        </section>
        </Space>
  </Space>
</template>

<script setup lang="ts">
import {Avatar } from "ant-design-vue"
import { fetchWhoAmI, WhoAmIResponse } from "../utils/userReqeust";
import { onMounted, ref } from "vue";

const userInfo = ref<WhoAmIResponse>();

onMounted(() => {
  fetchWhoAmI()
    .then(response => {
      const { data: { data } } = response;
      userInfo.value = data;
    })
});
</script>

<style lang="scss" scoped>

</style>