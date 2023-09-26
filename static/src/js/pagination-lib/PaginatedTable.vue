<script setup>
// VUE
import { ref, onMounted, computed, watch } from "vue";

// COMPONENTS
import PageSelector from "./PageSelector.vue";
import ResultsPerPageSelector from "./ResultsPerPageSelector.vue";
import DataTable from "./DataTable.vue";

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
const total = ref(undefined);
const page = ref(1);

const selectedLimit = ref(undefined);

const limit = computed(
  () => selectedLimit.value ? selectedLimit.value : props.resultsPerPageOptions[0],
);
const totalPages = computed(() => Math.ceil(total.value / limit.value))
const offset = computed(() => (page.value - 1) * limit)

// Methods

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
};

const updateLimit = (newLimit) => {
  selectedLimit.value = newLimit;
};

// On Mounted
onMounted(async () => {
  updateTable();
});

watch(limit, async () => {
  console.log("watcher");
  updateTable();
});
</script>

<template>
  <div class="paginated-table">
    <div class="table-wrapper">
      <DataTable
        :headings="props.headings"
        :rows="rows"
        :tableClass="props.tableClass"
      />
    </div>
    <div class="pagination">
      <ResultsPerPageSelector
        :resultsPerPageOptions="props.resultsPerPageOptions"
        :selected="limit"
        @results-per-page-selection-changed="updateLimit"
      />
      <PageSelector :currentPage="page" :totalPages="totalPages" />
    </div>
  </div>
</template>

<style scoped>
.paginated-table {
  height: fit-content;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.table-wrapper {
  overflow-y: scroll;
  overflow-x: scroll;
  padding-bottom: 1rem;
}
.pagination {
  background: white;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
