import { fetchAndHelpRedirect } from "../redirect";

export default async function fetchProject(id: string) {
  try {
    const response = await fetchAndHelpRedirect("/api/project/" + id, {
      method: "GET",
    });
    const { data, status } = response;

    return { data, status };
  } catch (error) {
    console.error(error);
  }
}
