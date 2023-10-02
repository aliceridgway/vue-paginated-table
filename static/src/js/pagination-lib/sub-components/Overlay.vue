<script setup>
import { computed } from "vue";

const props = defineProps({
  cssClass: {
    type: String,
    required: false,
    default: "",
  },
});

const cssClass = computed(() =>
  props.cssClass ? props.cssClass : "pgt-overlay",
);
</script>

<template>
  <div :class="cssClass">
    <slot></slot>
  </div>
</template>

<style>
.pgt-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
}
</style>
