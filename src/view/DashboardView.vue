<template>
  <div class="app-container">
    <Layout>
      <LayoutSider class="site-layout-background" v-model:collapsed="collapsed" :trigger="null" collapsible>
        <Menu mode="inline" default-selected-keys="['1']">
          <MenuItem>
            <span @click="collapsed = !collapsed">折叠此面板</span>
          </MenuItem>
          <MenuItem key="1">
            <a href="#">创建代码片段</a>
          </MenuItem>
          <MenuItem key="2">
            <a href="#">仪表板</a>
          </MenuItem>
          <MenuItem key="3">
            <a href="#">文件夹</a>
          </MenuItem>
          <MenuItem key="4">
            <a href="#">语言</a>
          </MenuItem>
          <MenuItem key="5">
            <a href="#">设置</a>
          </MenuItem>
        </Menu>
      </LayoutSider>
      <LayoutContent style="padding: 24px; min-height: 90vh;">
        <Spin />
      </LayoutContent>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import {
  Spin,
  Menu,
  MenuItem,
  LayoutSider,
  Layout,
  LayoutContent
} from 'ant-design-vue';
import { ref } from "vue";

const collapsed = ref<boolean>(true);
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-layout-background {
  background: #fff;
}

.register {
  margin-top: 16px;
  display: block;
  color: #1890ff;
}
</style>