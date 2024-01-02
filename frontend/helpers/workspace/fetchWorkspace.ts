import { fetchAndHelpRedirect } from "../redirect";

export default async function fetchWorkspace(id: string) {
  try {
    const response = await fetchAndHelpRedirect(`/api/workspace/${id}`, {
      method: "GET",
    });
    const { data, status } = response;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
