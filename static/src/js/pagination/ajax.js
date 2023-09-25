export async function getSourceData(url) {
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}
