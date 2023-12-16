import { redirectToLogin } from "./redirect";

export default async function fetchProject(id: string) {
  try {
    const response = await fetch("/api/project/" + id, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data)
    await redirectToLogin(response.status, data.error);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }
    return { data, status: response.status };
  } catch (error) {
    console.error(error);
  }
}
