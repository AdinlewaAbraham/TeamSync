import { redirectToLogin } from "./redirect";

export default async function deleteSection(
  sectionId: string,
  projectId: string
) {
  try {
    const response = await fetch(
      "/api/section/" + projectId + "/" + sectionId,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    await redirectToLogin(response.status, data.error);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }
    return { data, status: response.status };
  } catch (error) {
    console.error(error);
  }
}
