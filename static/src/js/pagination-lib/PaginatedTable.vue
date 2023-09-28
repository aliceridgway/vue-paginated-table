<script setup>
// VUE
import { ref, onMounted, computed, watch } from "vue";

// COMPONENTS
import DefaultRow from "./DefaultRow.vue";
import Headings from "./Headings.vue";
import LoadingOverlay from "./LoadingOverlay.vue";
import PageSelector from "./PageSelector.vue";
import ProgressBar from "./ProgressBar.vue";
import ProgressBarPlaceholder from "./ProgressBarPlaceholder.vue";
import ResultSummary from "./ResultSummary.vue";
import ResultsPerPageSelector from "./ResultsPerPageSelector.vue";

import {
  defaultTotalGetter,
  defaultRowsGetter,
  defaultRowsPreprocessor,
} from "./pagination/defaults";

import getRows from "./pagination/rows";

// PROPS

const props = defineProps({
  // HEADINGS: an array of objects.
  // e.g. [{
  //     "key": "first_name"
  //     "display": "Name"
  // }]
  headings: {
    type: Array,
    required: true,
  },

  // SOURCE URL: the URL of the endpoint that will return rows for the table
  sourceURL: {
    type: String,
    required: true,
  },

  // TOTAL GETTER (optional): a function to get the total number of results from the response
  totalGetter: {
    type: Function,
    required: false,
    default: defaultTotalGetter,
  },

  // ROWS GETTER (optional): a function that returns the list of rows from the response
  rowsGetter: {
    type: Function,
    required: false,
    default: defaultRowsGetter,
  },

  // ROWS PRE-PROCESSOR (optional): a function that will process row data before rendering them.
  // e.g. you want to format a date field before rendering
  rowsPreProcessor: {
    type: Function,
    required: false,
    default: defaultRowsPreprocessor,
  },

  // TABLE CLASS (optional): style the table with one or more classes that will be applied to the table element.
  tableClass: {
    type: String,
    required: false,
    default: "table",
  },

  // RESULTS PER PAGE OPTIONS (optional): Array of integers
  resultsPerPageOptions: {
    type: Array,
    required: false,
    default: [10, 25, 50],
  },
});

// Initial States
const rows = ref([]);
const total = ref(0);
const page = ref(1);

const showLoadingOverlay = ref(false);
const showProgressBar = ref(false);

const selectedLimit = ref(undefined);

const limit = computed(() =>
  selectedLimit.value ? selectedLimit.value : props.resultsPerPageOptions[0],
);
const totalPages = computed(() => Math.ceil(total.value / limit.value));
const offset = computed(() => (page.value - 1) * limit.value);

// Methods
const updateLimit = (newLimit) => {
  selectedLimit.value = newLimit;
};

const updatePage = (newPage) => {
  page.value = newPage;
};

const updateTable = async () => {
  let _rows;
  let _total;

  [_total, _rows] = await getRows(
    props.sourceURL,
    props.headings,
    limit.value,
    offset.value,
    props.totalGetter,
    props.rowsGetter,
    props.rowsPreProcessor,
  );

  rows.value = _rows;
  total.value = _total;

  showProgressBar.value = false;
  showLoadingOverlay.value = false;
};

onMounted(async () => {
  updateTable();
});

watch(limit, async () => {
  updateTable();
});

watch(page, async () => {
  showLoadingOverlay.value = true;
  setTimeout(async () => {
    await updateTable();
  }, 500);
});
</script>

<template>
  <div class="paginated-table shadow p-3 mb-5 bg-body rounded">
    <div class="paginated-table__header">
      <ResultsPerPageSelector
        :resultsPerPageOptions="props.resultsPerPageOptions"
        :selected="limit"
        @results-per-page-selection-changed="updateLimit"
      />
    </div>

    <ProgressBarPlaceholder>
      <ProgressBar v-show="showProgressBar" />
    </ProgressBarPlaceholder>

    <div class="paginated-table__wrapper">
      <table :class="props.tableClass">
        <Headings :headings="props.headings" />
        <tbody>
          <slot :rows="rows">
            <DefaultRow v-for="(row, index) in rows" :key="index" />
          </slot>
        </tbody>
      </table>

      <LoadingOverlay v-show="showLoadingOverlay" />
    </div>

    <div class="paginated-table__footer">
      <ResultSummary v-show="total > 0" :limit="limit" :offset="offset" :total="total" />

      <PageSelector
        :currentPage="page"
        :totalPages="totalPages"
        @page-number-changed="updatePage"
      />
    </div>
  </div>
</template>

<style>
.paginated-table {
  height: fit-content;
  width: 100%;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.paginated-table__wrapper {
  position: relative;
  overflow-y: scroll;
  overflow-x: scroll;
  padding-bottom: 1rem;
}

.paginated-table__header {
  background: white;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.paginated-table__footer {
  background: white;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
