<script setup>
import { ref, onMounted } from "vue";
import { fetchRows } from "./pagination/ajax";
import {
  defaultTotalGetter,
  defaultRowsGetter,
  defaultHttpCodeGetter,
} from "./pagination/deserialization";
import rowUtils from "./pagination/rowUtils";
import PageSelector from "./PageSelector.vue";

// Props
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
});

// Initial States
const rows = ref([]);
const total = ref(0);

// On Mounted
onMounted(async () => {
  console.log("I've been mounted!");

  const data = await fetchRows(props.sourceURL);

  total.value = props.totalGetter(data);

  const rowObjects = props.rowsGetter(data);

  const processedRowObjects = props.rowsPreProcessor(rowObjects);

  rows.value = rowUtils.sortRowData(processedRowObjects, props.headings);

  console.log(data);
});
</script>

<template>
  <div class="paginated-table">
    <div class="table-wrapper">
      <table :class="props.tableClass">
        <thead>
          <tr>
            <th v-for="(heading, index) in headings" :key="index">
              {{ heading.display }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td v-for="(rowItem, i) in row" :key="i">
              {{ rowItem }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
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
