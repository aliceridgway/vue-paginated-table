<script setup>
// VUE
import { ref, onMounted, computed } from "vue";

// COMPONENTS
import PageSelector from "./PageSelector.vue";
import ResultsPerPageSelector from "./ResultsPerPageSelector.vue";
import DataTable from "./DataTable.vue";

import {
  defaultTotalGetter,
  defaultRowsGetter,
  defaultHttpCodeGetter,
} from "./pagination/deserialization";

import rowUtils from "./pagination/rowUtils";

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

  // HTTP CODE GETTER (optional): a function that gets the HTTP code from the response.
  httpCodeGetter: {
    type: Function,
    required: false,
    default: defaultHttpCodeGetter,
  },

  // ROWS PRE-PROCESSOR (optional): a function that will process row data before rendering them.
  rowsPreProcessor: {
    type: Function,
    required: false,
    default: rowUtils.defaultRowsPreprocessor,
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
const limit = ref(undefined);
const initialLimit = computed(() => props.resultsPerPageOptions[0])

// Methods

const updateTable = async () => {
    let _rows
    let _total

  [_total, _rows] = await rowUtils.getRows(
    props.sourceURL,
    props.headings,
    limit.value | initialLimit.value,
    props.totalGetter,
    props.rowsGetter,
    props.rowsPreProcessor,
  )
  
  console.log(_rows)
  console.log(_total)

  rows.value = _rows
  total.value = _total
}

// On Mounted
onMounted(async () => {
  console.log("I've been mounted!");
  updateTable()
});


</script>

<template>
  <div class="paginated-table">
    <div class="table-wrapper">
        <DataTable :headings="props.headings" :rows="rows" :tableClass="props.tableClass" />
    </div>
    <div class="pagination">
      <ResultsPerPageSelector
        :resultsPerPageOptions="props.resultsPerPageOptions"
        :selected="limit | initialLimit"
        @results-per-page-selection-changed="callback" 
      />
      <PageSelector currentPage="4" totalPages="20" />
    </div>
  </div>
</template>

<style scoped>
.paginated-table {
  height: 100%;
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
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
