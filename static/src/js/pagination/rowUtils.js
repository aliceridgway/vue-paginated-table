function sortRowData(rows, headings) {
    // For each row, order the data by the ordering defined in the headings array
    // discard data that won't appear in the table.

    const heading_keys = headings.map(headingObj => headingObj.key);

    return rows.map(row => sortSingleRow(row, heading_keys))
}

function sortSingleRow(row, keys) {
    // for a single row of data, return an Array of values ordered by their keys.
    return keys.map(key => {
        return (key in row) ? row[key] : ""
    })
}

function defaultRowsPreprocessor(rowObjects) {
    return rowObjects
}

export default {
    defaultRowsPreprocessor,
    sortRowData
}