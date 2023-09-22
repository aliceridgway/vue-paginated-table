export async function fetchRows(url) {
    console.log("Fetching rows...")

    const response = await fetch(
        url, {
            "method": "GET",
        }
    )
    const data = await response.json()

    return data
}
