<script setup>
const props = defineProps({
  errorMessage: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="pgt-error-overlay">
    <p class="pgt-error-overlay__message">{{ props.errorMessage }}</p>
  </div>
</template>

<style>
.pgt-error-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 5px;
  background: rgba(255, 195, 195, 0.9);
}

.pgt-error-overlay__message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgb(137, 37, 37);
}
</style>
