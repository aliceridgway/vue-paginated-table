<template>
  <!-- <div>
    <h1>Hi</h1>
  </div> -->
  <div class="pgt-loading-overlay__spinner-wrapper">
    <div class="pgt-loading-overlay__spinner spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style>
.pgt-loading-overlay__spinner-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: none !important;
}

.pgt-loading-overlay__spinner {
  color: rgb(64, 118, 192);
}
</style>
