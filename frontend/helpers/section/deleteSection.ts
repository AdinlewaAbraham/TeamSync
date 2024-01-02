import { fetchAndHelpRedirect } from "../redirect";

export default async function deleteSection(
  sectionId: string,
  projectId: string,
) {
  try {
    const response = await fetchAndHelpRedirect(
      "/api/section/" + projectId + "/" + sectionId,
      {
        method: "DELETE",
      },
    );
    const { data, status } = response;
    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }
    return { data, status };
  } catch (error) {
    console.error(error);
  }
}
