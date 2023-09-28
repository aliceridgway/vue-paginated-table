<template>
    <div class="loading-overlay">
        <div class="loading-overlay__spinner-wrapper">
            <div class="loading-overlay__spinner spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<style>
.loading-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
}

.loading-overlay__spinner-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-overlay__spinner {
  color: rgb(64, 118, 192);
}
</style>