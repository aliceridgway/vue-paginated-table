<script setup>
import { defineEmits, defineProps, computed } from "vue";

const emit = defineEmits(["page-number-changed"]);

// PROPS

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const currentPage = computed(() => parseInt(props.currentPage));
const totalPages = computed(() => parseInt(props.totalPages));

if (currentPage > totalPages) {
  throw new Error(
    "currentPage cannot be larger than the total number of pages",
  );
}

const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(() => currentPage.value >= totalPages.value);

const showLeftElipses = computed(() => currentPage.value > 3);
const showRightElipses = computed(
  () => currentPage.value + 1 < totalPages.value,
);

const updatePage = (page) => {
  const newPage = Math.min(page, totalPages);

  if (page == newPage) {
    return;
  }

  emit("page-number-changed", page);
};
</script>

<template>
  <nav aria-label="...">
    <ul class="pagination">
      <li v-if="!isFirstPage" class="page-item">
        <a class="page-link" @click="updatePage(currentPage - 1)" tabindex="-1"
          >Previous</a
        >
      </li>

      <li v-if="showLeftElipses" class="page-item">
        <a class="page-link" @click="updatePage(1)" tabindex="-1">1</a>
      </li>

      <li v-if="showLeftElipses" class="page-item disabled">
        <a class="page-link" tabindex="-1" aria-disabled="true">...</a>
      </li>

      <li v-if="!isFirstPage" class="page-item">
        <a class="page-link" @click="updatePage(currentPage - 1)">{{
          currentPage - 1
        }}</a>
      </li>

      <li class="page-item active" aria-current="page">
        <a class="page-link" @click="updatePage(currentPage)">{{
          currentPage
        }}</a>
      </li>

      <li v-if="!isLastPage" class="page-item">
        <a class="page-link" @click="updatePage(currentPage + 1)">{{
          currentPage + 1
        }}</a>
      </li>

      <li v-if="showRightElipses" class="page-item disabled">
        <a class="page-link" tabindex="-1" aria-disabled="true">...</a>
      </li>

      <li v-if="showRightElipses" class="page-item">
        <a class="page-link" @click="updatePage(totalPages)">{{
          totalPages
        }}</a>
      </li>

      <li v-if="!isLastPage" class="page-item">
        <a class="page-link" @click="updatePage(currentPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>
