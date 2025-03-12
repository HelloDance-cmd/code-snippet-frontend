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
        <Layout.Sider theme="light" style="padding: 5px;">
         <section style="display: flex; justify-content: right;">
            <Button type="ghost" size="small">
              <template #icon>
                <FileAddOutlined />
              </template>
            </Button>
            
            <Button type="ghost" size="small">
              <template #icon>
                <FolderAddOutlined />
              </template>
            </Button>
         </section>
          <Menu mode="inline" default-selected-keys="['1']" :items="folderItems" @click="(chooseFolder as MenuClickEventHandler)" />
        </Layout.Sider>
        <Layout.Content>
          <div class="note-list">
            <Input.Search placeholder="搜索笔记" style="margin-bottom: 16px;" />
          </div>
          <div class="markdown-editor">
            <Button type="primary" @click="submitMarkdown"> 提交 </Button>
            <MdEditor v-model="text" :toolbars="['bold', 'title', '=', 'code']" class="editor" />
          </div>
        </Layout.Content>
      </Layout>
    </Layout.Content>
  </Layout>
</template>

<script setup lang="ts">
import { Layout, Menu, Input, ItemType, Button, message } from 'ant-design-vue';
import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons-vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { onMounted, ref, watch } from 'vue';
import { fetchFolderStructureInDashBoard, fetchSnippetContentChange, SnippetsVo } from '../../utils/useDashboardRequest';
import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';
import { NoticeType } from 'ant-design-vue/es/message';
import { log } from 'console';
const text = ref('Hello Editor!');
const keyMap = new Map<string, string>();
const currentChooseId = ref<string>();
let folderItems = ref<ItemType[]>([]);
let folderSturcture = ref<SnippetsVo[]>();

watch(currentChooseId, () => {});

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
  currentChooseId.value = key;
  text.value = keyMap.get(key) as string;
}

/**
 * 提交编辑好的markdown文件
 */
async function submitMarkdown() {
  const id = currentChooseId.value as string; // 当前选择的文件ID

  function isExist(id: string):boolean {
    let arr = folderSturcture.value as SnippetsVo[];
    let mockStack: SnippetsVo[][] = [arr]

    while (mockStack.length != 0) {
      let datas = mockStack.pop() as SnippetsVo[]

      for (let data of datas) {
        if (data.snippetID == id)
          return true;
        if (data.children.length != 0)
          mockStack.push(data.children);
      }
    }

    return false;
  }

  let alertMessage;
  let alertType: NoticeType;

  if (isExist(id)) {
    let response = await fetchSnippetContentChange(id as string, text.value);
    alertMessage = response.data.data ? '更新成功' : '更新失败';
    alertType = response.data.data ? 'info' : 'error';
  } else {
    // 新增
    alertType = 'error'
    // 父ID
    // 
    // 文件名
  }

  message.open({
    content: alertMessage,
    type: alertType
  })
}

onMounted(async () => {
  const response = await fetchFolderStructureInDashBoard()
  const { data } = response.data;
  folderSturcture.value = data;
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
  display: flex;
  flex-direction: column;
  gap: 1rem;

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

::v-deep li[data-menu-id] {
  background-color: black;
  color: white;

  color: v-bind(currentChooseId);
}

.layout-content {
  min-height: unset;
}
</style>