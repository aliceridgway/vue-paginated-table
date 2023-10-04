<script setup>
const emit = defineEmits(["rowSelectionsUpdated"])
const props = defineProps({
    rows: {
        type: Array,
        required: true
    },
    selectedRows: {
        type: Array,
        required: true
    }
})

const handleRowSelectionEvent = () => emit("rowSelectionsUpdated", rowIdentifier)

</script>

<template>
<slot
    name="rows"
    :rows="rows"
    :selectedRows="selectedRows"
    :handleRowSelectionEvent="handleRowSelectionEvent"
>
    <DefaultRow
        v-for="row in rows"
        :row="row"
        :key="row.id"
        @row-selection-toggled="handleRowSelectionEvent"
    />
</slot>
</template>