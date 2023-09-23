<script setup>
import Layout from "./Layout.vue";
import PaginatedTable from "./PaginatedTable.vue";
import ergastAPI from "./ergastAPI";

const headings = [
  {
    key: "name",
    display: "Name",
  },
  {
    key: "dateOfBirth",
    display: "Date of Birth",
  },
  {
    key: "nationality",
    display: "Nationality",
  },
];
</script>

<template>
  <layout>
    <paginated-table
      tableClass="table table-striped table-hover table-responsive"
      :headings="headings"
      sourceURL="http://ergast.com/api/f1/drivers.json"
      :rowsGetter="ergastAPI.rowsGetter"
      :totalGetter="ergastAPI.totalGetter"
      :rowsPreProcessor="ergastAPI.rowsPreprocessor"
    />
  </layout>
</template>

<script>
export default {
  components: { Layout, PaginatedTable },
};
</script>
