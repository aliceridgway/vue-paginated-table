export async function fetchRows(url) {
  console.log("Fetching rows...");

  const response = await fetch(url, {
    method: "GET",
  });
  console.log(response);
  const data = await response.json();
  console.log(data);
  return data;
}
