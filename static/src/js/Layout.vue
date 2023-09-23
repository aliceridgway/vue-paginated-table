<script setup>
import Sidebar from "./Sidebar.vue";

const menu = [
  {
    label: "About",
    url: "/about",
  },
  {
    label: "Products",
    url: "/products",
  },
  {
    label: "Dashboard",
    url: "/dashboard",
  },
];
</script>

<template>
  <div class="layout">
    <sidebar :menuItems="menu" />
    <section class="main-content-slot">
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  components: { Sidebar },
};
</script>

<style scoped>
.layout {
  background: #fafafa;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  margin: 0;
  padding: 0;
}

.main-content-slot {
  padding: 2rem;
}
</style>
