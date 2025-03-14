<template>
  <Layout>
    <!-- <Layout.Sider width="150" theme="light" height="100%">
      <Menu mode="inline" default-selected-keys="['1']">
        <Menu.Item key="1">所有代码片段</Menu.Item>
        <Menu.Item key="3">文件夹</Menu.Item>
        <Menu.Item key="5">最近删除</Menu.Item>
      </Menu>
    </Layout.Sider> -->
    <Layout.Content style="padding: 0 10px;">
      <Layout style="gap: 10px;">

        <Layout.Sider theme="light" style="padding: 5px;">
          <section style="display: flex; justify-content: right;">
            <Button type="ghost" size="small" @click="addFileHandler">
              <template #icon>
                <FileAddOutlined />
              </template>
            </Button>
          </section>
          <Menu mode="inline" default-selected-keys="['1']" :items="snippetItems"
            @click="(codeSnippetSelection as MenuClickEventHandler)" />
        </Layout.Sider>


        <Layout.Content>
          <div class="note-list">
            <Input.Search placeholder="搜索笔记" style="margin-bottom: 16px;" />
          </div>
          <div class="markdown-editor">
            <section style="display: flex; gap: 10px; align-items: center;">
              <Button type="primary" @click="submitMarkdown" class="btn-submit">提交 </Button>
              <span>选择标签</span>
              <Select style="width: 100px;" label-in-value v-model:value="selectedCategory"
                :options="categories" />
            </section>
            <MdEditor v-model="markdownText" :toolbars="['bold', 'title', '=', 'code']" class="editor" />
          </div>
        </Layout.Content>
      </Layout>
    </Layout.Content>
  </Layout>

  <ContextHolder />
</template>

<script setup lang="ts">
import { Layout, Menu, Input, ItemType, Button, message, Select, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, FileAddOutlined } from '@ant-design/icons-vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { h, onMounted, reactive, ref } from 'vue';
import { fetchCategoriesOfSnippet, fetchCreateSnippet, fetchFolderStructureInDashBoard, fetchSnippetContentChange, type SnippetsVo } from '../../utils/useDashboardRequest';
import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';
import { NoticeType } from 'ant-design-vue/es/message';
import { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select';

const markdownText = ref('Hello Editor!');
const keyMap = new Map<string, string>();
const currentChooseId = ref<string>();
const selectedCategory = ref<string>();
let snippetItems = ref<ItemType[]>([]);
let originalSnippetStructure = ref<SnippetsVo[]>();
let snippetName = ref<string>('news')
const categories = ref<DefaultOptionType[]>()


const [modal, ContextHolder] = Modal.useModal();

function addFileHandler() {
  let snippet: SnippetsVo = {
    title: '',
    content: '',
    category: '',
    snippetID: '',
    createAt: Date.now().toString(),
    children: []
  }


  modal.confirm({
    title: '请输入你的snippet名称',
    icon: h(ExclamationCircleOutlined),
    content: h(Input, {
      value: snippetName.value,
      'onUpdate:value': (newValue) => {
        snippetName.value = newValue;
      }
    }),
    onOk: async () => {
      snippet.title = snippet.snippetID = snippet.content = snippetName.value
      keyMap.set(snippet.snippetID, snippet.content);
      if (currentChooseId.value == undefined) {
        await pubshItemBelowIt(snippet, '');
      } else {
        await pubshItemBelowIt(snippet, currentChooseId.value as string)
      }
      await refreshData();
    }
  });
}
function getItem(label: string, key: string, icon?: any, children?: ItemType[], type?: 'group'): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}
function getFolderItems(dataset: SnippetsVo[]): ItemType[] {
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

async function codeSnippetSelection({ item, key, keyPath }) {
  await refreshData();
  currentChooseId.value = key;
  markdownText.value = keyMap.get(key) as string;
  selectedCategory.value = getCategory()

  function getCategory(snippets = originalSnippetStructure.value as SnippetsVo[]) {
    let ans = '';
    for (let snippet of snippets) {
      if (snippet.snippetID == key) {
        return snippet.category;
      } else if (snippet.children.length != 0) {
        ans = getCategory(snippet.children)
      }
    }

    return ans;
  }
}

async function pubshItemBelowIt(item: SnippetsVo, id: string) {
  async function dfs(snippets = originalSnippetStructure.value) {
    for (let snippet of snippets as SnippetsVo[]) {
      if (snippet.snippetID == id) {
        await fetchCreateSnippet({
          parentId: id,
          title: item.title
        })

        snippet.children.push(item);
      } else if (snippet.children.length != 0) {
        dfs(snippet.children)
      }
    }
  }

  if (id == '') {
    await fetchCreateSnippet({
      parentId: null,
      title: item.title
    })
    originalSnippetStructure.value?.push(item);
    snippetItems.value = getFolderItems(originalSnippetStructure.value as SnippetsVo[]);
  } else {
    await dfs()
  }
  snippetItems.value = getFolderItems(originalSnippetStructure.value as SnippetsVo[])
}

/**
 * 提交编辑好的markdown文件
 */
async function submitMarkdown() {
  const id = currentChooseId.value as string; // 当前选择的文件ID
  function isExist(id: string): boolean {
    let arr = originalSnippetStructure.value as SnippetsVo[];
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
  let alertType: NoticeType = 'error';

  if (isExist(id)) {
    let response = await fetchSnippetContentChange(id as string, markdownText.value, selectedCategory.value as string);
    alertMessage = response.data.data ? '更新成功' : '更新失败';
    alertType = response.data.data ? 'info' : 'error';
  }

  message.open({
    content: alertMessage,
    type: alertType
  })
}

async function refreshData() {
  const response = await fetchFolderStructureInDashBoard()
  const { data } = response.data;
  
  originalSnippetStructure.value = data;
  snippetItems.value = getFolderItems(data);

  const { data: { data: categ}  } = await fetchCategoriesOfSnippet();

  categories.value = categ.map(c => ({ label: c, value: c }));


  await Promise.resolve((resolve) => setTimeout(resolve, 2000))

}

onMounted(() => {
  refreshData()
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
  padding: 0 8px 8px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .btn-submit {
    align-self: self-start;
  }

  .editor {
    ::deep .md-editor-toolbar {
      height: 3rem;
    }

    ::deep svg.md-editor-icon {
      width: 1.3rem;
      height: 1.3rem;
    }
  }
}

// .layout-content {
//   min-height: unset;
// }</style>