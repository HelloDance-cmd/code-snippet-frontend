<template>
  <Layout>
    <Layout.Sider width="150" theme="light" height="100%">
      <Menu mode="inline" default-selected-keys="['1']">
        <Menu.Item key="1">所有代码片段</Menu.Item>
        <Menu.Item key="2">未分类</Menu.Item>
        <Menu.Item key="3">文件夹</Menu.Item>
        <Menu.Item key="5">最近删除</Menu.Item>
      </Menu>
    </Layout.Sider>
    <Layout.Content style="padding: 0 10px;">
      <Layout style="gap: 10px;">
        <Layout.Sider theme="light">
          <Menu mode="inline" default-selected-keys="['1']" :items="folderItems" @click="chooseFolder as MenuClickEventHandler">
          </Menu>
        </Layout.Sider>

        <Layout.Content>
          <div class="note-list">
            <Input.Search placeholder="搜索笔记" style="margin-bottom: 16px;" />
          </div>
          <div class="markdown-editor">
            <MdEditor v-model="text" :toolbars="['bold', 'title', '=', 'code']" class="editor" />
          </div>
        </Layout.Content>
      </Layout>
    </Layout.Content>
  </Layout>
</template>

<script setup lang="ts">
import { Layout, Menu, Input, ItemType } from 'ant-design-vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { onMounted, ref } from 'vue';
import { fetchFolderStructureInDashBoard, SnippetsVo } from '../../utils/useDashboardRequest';
import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';
const text = ref('Hello Editor!');
const keyMap = new Map<string, string>();

function getItem( label: string, key: string, icon?: any, children?: ItemType[], type?: 'group'): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}
function getFolderItems(dataset: SnippetsVo[]): ItemType[] {
  let itemCounter = 0;
  function dfs() {
    let ans: ItemType[] = []
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].children.length != 0) {
        ans.push(getItem(dataset[i].title, dataset[i].snippetID, null, getFolderItems(dataset[i].children)))
      } else {
        keyMap.set(dataset[i].snippetID, dataset[i].content);
        ans.push(getItem(dataset[i].title, dataset[i].snippetID))
      }
    }
    return ans;
  }

  return dfs();
}
function chooseFolder({item, key, keyPath}) {
  text.value = keyMap.get(key) as string;
}


let folderItems = ref<ItemType[]>([])

onMounted(async () => {
  const response = await fetchFolderStructureInDashBoard()
  const { data } = response.data;

  folderItems.value = getFolderItems(data);  
})

</script>

<style scoped lang="scss">
.notes-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.note-list {
  margin-bottom: 24px;
}

.markdown-editor {
  /* 为Markdown编辑器留出足够的空间 */
  height: 400px;
  border: 1px solid #d9d9d9;
  padding: 8px;
  overflow-y: auto;

  .editor {
    ::v-deep .md-editor-toolbar {
      height: 3rem;
    }

    ::v-deep svg.md-editor-icon {
      width: 1.3rem;
      height: 1.3rem;
    }
  }
}

.layout-content {
  min-height: unset;
}
</style>