export default async function getRows(
  baseURL,
  headings,
  limit,
  offset,
  totalGetter,
  rowsGetter,
  rowsProcessor,
) {
  console.log("ahoy")
  const url = `${baseURL}?limit=${limit}&offset=${offset}`;

  let totalRows = 0
  let sortedRows = []

  try {
    const data = await getSourceData(url);
    totalRows = parseInt(totalGetter(data));
    const rowObjects = rowsGetter(data);
    const processedRows = rowsProcessor(rowObjects);
    sortedRows = sortRowData(processedRows, headings);

  } catch (error) {
    console.error(error)
  }
  
  return [totalRows, sortedRows];
}

async function getSourceData(url) {
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

function sortRowData(rows, headings) {
  // For each row, order the data by the ordering defined in the headings array
  // discard data that won't appear in the table.

  const heading_keys = headings.map((headingObj) => headingObj.key);

  const sortedRows = rows.map((row) => sortSingleRow(row, heading_keys));

  return sortedRows;
}

function sortSingleRow(row, keys) {
  // for a single row of data, return an Array of values ordered by their keys.
  return keys.map((key) => {
    return key in row ? row[key] : "";
  });
}
