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

  <section class="panel-card">
    <section>
      <Space class="card" :size="20">
        <Card title="你的文件夹">
          <List :data-source="directories">
            <template #renderItem="{ item }">
              <ListItem>{{ item }}</ListItem>
            </template>
          </List>
        </Card>
        <Card title="登录记录">B</Card>
      </Space>
    </section>
    <section>
      <Space class="card">
        <Card title="你的Tags占比">C</Card>
      </Space>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue';
import { Avatar, Card, List, ListItem, Space } from 'ant-design-vue';
import { onMounted, ref } from "vue";
import { type WhoAmIResponse, fetchWhoAmI } from '../utils/userReqeust';
import { fetchSnippetWhichHasChildren } from '../utils/snippetRequest';

const userInfo = ref<WhoAmIResponse>();
const directories = ref<string[]>();

onMounted(() => {
  fetchWhoAmI()
    .then(response => {
      const { data: { data } } = response;
      userInfo.value = data;
    })

  fetchSnippetWhichHasChildren()
    .then(response => {
      const { data: { data } } = response;
      directories.value = data.slice(0, 15);
    })
})

</script>

<style lang="scss">
.panel-card {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 20px;

  margin-top: 50px;

  .card {
    width: 100%;

    &>div {
      width: 100%;
    }
  }
}
</style>