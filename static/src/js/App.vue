<script setup>
import Layout from "./Layout.vue";
import CustomRow from "./CustomRow.vue";
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
      tableClass="table table-responsive"
      :headings="headings"
      sourceURL="http://ergast.com/api/f1/drivers.json"
      rowIdentificationKey="driverId"
      :usersCanSelectRows="true"
      :rowsGetter="ergastAPI.rowsGetter"
      :totalGetter="ergastAPI.totalGetter"
      :rowsPreProcessor="ergastAPI.rowsPreprocessor"
    >
      <template #rows="{ rows, selectedRows, handleRowSelectionEvent }">
        <custom-row
          v-for="row in rows"
          :key="row.id"
          :row="row"
          :selectedRows="selectedRows"
          @row-selection-toggled="handleRowSelectionEvent"
        />
      </template>
    </paginated-table>
  </layout>
</template>

<script>
export default {
  components: { Layout, PaginatedTable },
};
</script>
