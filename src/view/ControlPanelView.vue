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
      <Space :size="20">
        <Card title="你的文件夹">
          <ul class="directories">
            <li v-for="(item, index) in directories" :key="index" :data-id="item.id" v-on:dblclick="renameDirectory(item)">
              {{ item.name }}
            </li>
          </ul>
        </Card>
        <Card title="登录记录">
          <h2>{{ userInfo?.username }}</h2>
          <List>
            <ListItem v-for="record, index in loginRecords" :key="index">
              {{ convertMessage(record) }}
            </ListItem>
          </List>
        </Card>
      </Space>
    </section>
    <section>
      <Space>
        <Card title="你的Tags占比">
        </Card>
      </Space>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue';
import { Avatar, Card, List, ListItem, Space } from 'ant-design-vue';
import { onMounted, ref } from "vue";
import { type LoginRecoredType, type WhoAmIResponse, fetchLoginRecord, fetchWhoAmI } from '../utils/userReqeust';
import { fetchSnippetDirectories, TDirectory } from '../utils/snippetRequest';


const userInfo = ref<WhoAmIResponse>();
const directories = ref<TDirectory[]>();

const loginRecords = ref<LoginRecoredType>();
const RECORDS_LEN = 5; // 最多显示`LOGIN_RECOREDS_LEN`条记录

function convertMessage(record: any): string {
  const convertDate = (dateStr: string) => new Date(dateStr).toLocaleString()
  return record["登录"] == undefined ? `登出 ${convertDate(record["登出"])}` : `登录  ${convertDate(record["登录"])}`
}

function renameDirectory(item: TDirectory) {
  
}

onMounted(() => {
  fetchWhoAmI()
    .then(response => {
      const { data: { data } } = response;
      userInfo.value = data;
    })

  fetchSnippetDirectories()
    .then(response => {
      const { data: { data } } = response;
      directories.value = data.slice(0, 15);
    })


  fetchLoginRecord()
    .then(response => {
      const { data } = response.data;
      loginRecords.value = data.slice(0, RECORDS_LEN);
    })

})

</script>

<style lang="scss" scoped>
.panel-card {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 20px;

  margin-top: 50px;

  ::v-deep .ant-space-item,
  ::v-deep .ant-space {
    width: 100%;
    max-height: 300px;
    height: 100%;
  }
}

.directories {
  
  li {
    &:hover {
      cursor: pointer;
      background-color: #f1f1f1;
    }

    padding: 10px 0 10px 10px;
    border-radius: 10px;
  }

  
}
</style>