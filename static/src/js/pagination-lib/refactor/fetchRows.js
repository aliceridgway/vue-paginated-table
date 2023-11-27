// Fetches row data from the endpoint in JSON format

export default async function fetchRowsAsJson(page, resultsPerPage, baseURL, options) {

    const offset = resultsPerPage * (page - 1);

    const url = getURL(baseURL, options, offset, resultsPerPage)

    const data = await callEndpoint(url)

    const rowCount = data["count"]
    const rowData = data["rows"]

    return rowData, rowCount
}

function getURL(baseURL, options, offset, resultsPerPage) {

    return `${baseURL}/?offset=${offset}&limit=${resultsPerPage}`
}

async function callEndpoint(url) {
    const response = await fetch(url, {
        method: "GET",
    });
    const data = await response.json();
    return data;
}