<template>
    <ConfigProvider :theme="ThemeConfig">
        <Navgation />
        <RouterView />
    </ConfigProvider>
</template>

<script setup>
import ThemeConfig from "../public/Ant Design Vue Theme.json"

import { ConfigProvider } from "ant-design-vue";
import Navgation from "./components/Navgation.vue";
</script>

<style lang="scss" scoped></style>