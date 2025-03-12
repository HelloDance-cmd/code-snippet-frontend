<template>
  <div class="app-container">
    <Layout>
      <LayoutSider class="site-layout-background" v-model:collapsed="collapsed" :trigger="null" collapsible>
        <Menu mode="inline" :selectable="true" v-model:selectedKeys="selectedKeys">
          <MenuItem @click="collapsed = !collapsed" title="展开">
            <MenuUnfoldOutlined v-if="collapsed" />
            <section v-else>
              <MenuFoldOutlined />
              <span>收起</span>
            </section>
          </MenuItem>
          <MenuItem key="1" title="仪表板">
            <RouterLink to="/dashboard/dashboard">
              <DashboardOutlined v-if="collapsed"/>
              <section v-else>
                <DashboardOutlined />  
                <span>仪表板</span>
              </section>
            </RouterLink>
          </MenuItem>
          <MenuItem key="2" title="文件夹">
            <RouterLink to="/dashboard/folder">
              <FolderOpenOutlined v-if="collapsed"/>
              <section v-else>
                <FolderOpenOutlined />
                <span>文件夹</span>
              </section>
            </RouterLink>
          </MenuItem>
          <MenuItem key="3" title="设置">
            <RouterLink to="/dashboard/setting">
              <SettingOutlined v-if="collapsed"/>
              <section v-else>
                <SettingOutlined />
                <span>设置</span>
              </section>
            </RouterLink>
          </MenuItem>
        </Menu>
      </LayoutSider>
      <LayoutContent style="padding: 24px">
        <RouterView />
      </LayoutContent>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import {
  Menu,
  MenuItem,
  LayoutSider,
  Layout,
  LayoutContent,
} from 'ant-design-vue';

import { MenuUnfoldOutlined, MenuFoldOutlined, DashboardOutlined, FolderOpenOutlined, SettingOutlined } from "@ant-design/icons-vue"

import { reactive, ref } from "vue";
import { RouterLink, RouterView } from 'vue-router';

const collapsed = ref<boolean>(true);
let selectedKeys = reactive<string[]>(['2'])

</script>

<style scoped>
.app-container {
  height: calc(100vh - 60px);
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