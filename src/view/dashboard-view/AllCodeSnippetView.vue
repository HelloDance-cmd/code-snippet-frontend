<template>
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
    <Menu mode="inline" default-selected-keys="['1']" :items="snippetItems"
      @click="(codeSnippetSelection as MenuClickEventHandler)" />
  </Layout.Sider>
</template>

<script setup lang="ts">
import { Layout, Menu, ItemType, Button } from 'ant-design-vue';
import { ref, toRef } from 'vue';
import { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';

interface Props {
  currentChooseId: string,
  keyMap: Map<string, string>,
  snippetItems: ItemType[]
}

const { currentChooseId, keyMap, snippetItems } = defineProps<Props>()
const chooseId = toRef<string>(currentChooseId);
const markdownText = ref<string>()

function codeSnippetSelection({ item, key, keyPath }) {
  chooseId.value = key;
  markdownText.value = keyMap.get(key) as string;
}

</script>