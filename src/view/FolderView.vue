<template>
  <Layout>
    <Layout.Content style="padding: 0 10px;">
      <Layout style="gap: 10px;">
        <Layout.Sider theme="light" style="padding: 5px;" @click="currentSelectedId = ''">
          <section style="display: flex; justify-content: right;">
            <Button type="ghost" size="small" @click="addSnippetHandler">
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
              <Button type="primary" @click="submitMarkdown" :disabled="markdownText !== 'Nothing'" class="btn-submit">提交</Button>
              <span>选择标签</span>
              <Select style="width: 100px;" label-in-value v-model:value="category" :options="categories" />
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
import { fetchCategoriesOfSnippet, fetchCreateSnippet, fetchFolderStructureInDashBoard, fetchSnippetContentChange, type SnippetsVo } from '../utils/useDashboardRequest';
import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';
import { NoticeType } from 'ant-design-vue/es/message';
import { DefaultOptionType } from 'ant-design-vue/es/select';

const markdownText = ref('Nothing');
const keyToContentMap = new Map<string, string>();
const currentSelectedId = ref<string>('Nothing');
const categories = ref<DefaultOptionType[]>()
const [modal, ContextHolder] = Modal.useModal();
const category = ref<string>();
let snippetItems = ref<ItemType[]>([]);
let snippets = ref<SnippetsVo[]>();
let snippetName = ref<string>('news');

/**
 * 添加Snippet运行的处理函数
 */
function addSnippetHandler() {
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
      keyToContentMap.set(snippet.snippetID, snippet.content);
      if (currentSelectedId.value == undefined) {
        await pubshItemBelowIt(snippet, '');
      } else {
        await pubshItemBelowIt(snippet, currentSelectedId.value as string)
      }
      await refreshData();
    }
  });
}
/**
 * 生成Menu组件所需要的项
 * @see https://www.antdv.com/components/menu-cn/#Menu-
 * @param label 
 * @param key 
 * @param icon 
 * @param children 
 * @param type 
 */
function getItem(label: string, key: string, icon?: any, children?: ItemType[], type?: 'group'): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}/**
 * 将视图对象转换为可以Menu组件可以理解的对象
 * @param dataset 后端传递过来的snippet视图对象
 */
function getFolderItems(dataset: SnippetsVo[]): ItemType[] {
  function dfs() {
    let ans: ItemType[] = []
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].children.length != 0) {
        ans.push(getItem(dataset[i].title, dataset[i].snippetID, null, getFolderItems(dataset[i].children)))
      } else {
        keyToContentMap.set(dataset[i].snippetID, dataset[i].content);
        ans.push(getItem(dataset[i].title, dataset[i].snippetID))
      }
    }
    return ans;
  }

  return dfs();
}

/**
 * 通过ID查找对应树中的项
 * @param id 希望查找的ID
 * @param snippetItems 查找的树结构
 */
function findSnippetItemById(id: string, snippetItems: SnippetsVo[] = snippets.value as SnippetsVo[]): SnippetsVo | null {
  let ans: SnippetsVo | null = null;
  for (let snippet of snippetItems as SnippetsVo[]) {
    if (snippet.snippetID == id)
      return snippet;
    else if (snippet.children.length != 0) {
      ans = findSnippetItemById(id, snippet.children);
    }
  }

  return ans;
}
/**
 * 用户选择snippet的时候运行的处理函数
 */
async function codeSnippetSelection({ item, key, keyPath }) {
  await refreshData();
  currentSelectedId.value = key;
  markdownText.value = keyToContentMap.get(key) as string;
  const { category: gottenCategory } = findSnippetItemById(key) as SnippetsVo;
  category.value = gottenCategory;
}
/**
 * 
 * @param item 点击新建生成的对象
 * @param id 作为哪个结点的子元素
 */
async function pubshItemBelowIt(item: SnippetsVo, id: string) {
  const snippet = findSnippetItemById(id)
  snippet?.children.push(item);

  if (id === null) {
    await fetchCreateSnippet({
      parentId: null,
      title: item.title
    })
    snippets.value?.push(item);
    return;
  }

  if (snippet !== null) {
    snippet.children.push(item);
    await fetchCreateSnippet({
        parentId: id,
        title: item.title
    })
  }

  snippetItems.value = getFolderItems(snippets.value as SnippetsVo[]);
}
/**
 * 提交编辑好的markdown文件
 */
async function submitMarkdown() {
  const id = currentSelectedId.value as string; // 当前选择的文件ID
  function isExist(id: string): boolean {
    let arr = snippets.value as SnippetsVo[];
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
    let response = await fetchSnippetContentChange(id as string, markdownText.value, category.value as string);
    alertMessage = response.data.data ? '更新成功' : '更新失败';
    alertType = response.data.data ? 'info' : 'error';
  }

  message.open({
    content: alertMessage,
    type: alertType
  })
}
/**
 * 出现结构变化需要从后台重新生成ID
 * 需要重新获取ID
 */
async function refreshData() {
  const response = await fetchFolderStructureInDashBoard()
  const { data: { data: categ } } = await fetchCategoriesOfSnippet();

  const { data: snippetsFromBackend } = response.data;

  snippets.value = snippetsFromBackend;
  snippetItems.value = getFolderItems(snippetsFromBackend);


  categories.value = categ.map(c => ({ label: c, value: c }));
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