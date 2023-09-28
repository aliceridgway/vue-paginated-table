<script setup>
import Layout from "./Layout.vue";
import PaginatedTable from "./pagination-lib/PaginatedTable.vue";
import ergastAPI from "./ergastAPI";

const headings = [
  {
    key: "givenName",
    display: "First Name",
  },
  {
    key: "familyName",
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
  {
    key: "url",
    display: "URL",
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
    >
      <template v-slot="{ rows }">
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="(cell, i) in row" :key="i">
            {{ cell }}
          </td>
        </tr>
      </template>
    </paginated-table>
  </layout>
</template>

<script>
export default {
  components: { Layout, PaginatedTable },
};
</script>
