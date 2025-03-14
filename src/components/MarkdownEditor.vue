<template>
  <div class="markdown-editor">
    <section style="display: flex; gap: 10px; align-items: center;">
      <Button type="primary" @click="submitMarkdown" class="btn-submit">提交 </Button>
      <span>选择标签</span>
      <Select style="width: 100px;" label-in-value v-model:value="selectionComponentValue"
        :options="[{ value: 'Java', label: 'Java' }]" />
    </section>
    <MdEditor v-model="markdownText" :toolbars="['bold', 'title', '=', 'code']" class="editor" />
  </div>

</template>

<script lang="ts" setup>

</script>