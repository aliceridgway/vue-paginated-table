<script setup>
import { defineEmits, defineProps, computed } from "vue";

const emit = defineEmits(["pageNumberChanged"])

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
  throw Error("currentPage cannot be larger than the total number of pages");
}

const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(() => currentPage.value === totalPages.value);

const showLeftElipses = computed(() => currentPage.value > 3);
const showRightElipses = computed(
  () => currentPage.value + 1 < totalPages.value,
);

</script>

<template>
  <nav aria-label="...">
    <ul class="pagination">
      <li v-if="!isFirstPage" class="page-item">
        <a class="page-link" href="#" tabindex="-1" aria-disabled="true"
          >Previous</a
        >
      </li>

      <li v-if="showLeftElipses" class="page-item">
        <a class="page-link" href="#" tabindex="-1">1</a>
      </li>

      <li v-if="showLeftElipses" class="page-item disabled">
        <a class="page-link" href="#" tabindex="-1" aria-disabled="true">...</a>
      </li>

      <li v-if="!isFirstPage" class="page-item">
        <a class="page-link" href="#">{{ currentPage - 1 }}</a>
      </li>

      <li class="page-item active" aria-current="page">
        <a class="page-link" href="#">{{ currentPage }}</a>
      </li>

      <li v-if="!isLastPage" class="page-item">
        <a class="page-link" href="#">{{ currentPage + 1 }}</a>
      </li>

      <li v-if="showRightElipses" class="page-item disabled">
        <a class="page-link" href="#" tabindex="-1" aria-disabled="true">...</a>
      </li>

      <li v-if="showRightElipses" class="page-item">
        <a class="page-link" href="#" tabindex="-1">{{ totalPages }}</a>
      </li>

      <li v-if="!isLastPage" class="page-item">
        <a class="page-link" href="#">Next</a>
      </li>
    </ul>
  </nav>
</template>
