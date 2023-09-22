<script setup>
import Layout from "./Layout.vue";
import PaginatedTable from "./PaginatedTable.vue";

const headings = [
  {
    key: "given_name",
    display: "First Name",
  },
  {
    key: "surname",
    display: "Surname",
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
      sourceURL="http://ergast.com/api/f1/drivers.json"
      :headings="headings"
    />
  </layout>
</template>

<script>
export default {
  components: { Layout, PaginatedTable },
};
</script>
