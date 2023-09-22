<script setup>
import { ref, onMounted } from "vue";
import { fetchRows } from "./pagination/ajax";
import { defaultTotalGetter, defaultRowsGetter } from "./pagination/deserialization"

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
    default: defaultTotalGetter
  },

// ROWS GETTER (optional): a function that returns the list of rows from the response
  rowsGetter: {
    type: Function,
    required: false,
    default: defaultRowsGetter
  }
});

// Initial States
const tableData = ref([]);

// On Mounted
onMounted(async () => {
  console.log("I've been mounted!");
  console.log(props.sourceURL)
  const data = await fetchRows(props.sourceURL)

  const total = props.totalGetter(data)
  const rows = props.rowsGetter(data)
  
  console.log(data)
});
</script>

<template>
  <h1>hi</h1>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(heading, index) in headings" :key="index">
          {{ heading.display }}
        </th>
      </tr>
    </thead>
  </table>
</template>
