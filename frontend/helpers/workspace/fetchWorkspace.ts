import { redirectToLogin } from "@/helpers/redirect";

export default async function fetchWorkspace(id: string) {
  try {
    const response = await fetch(`/api/workspace/${id}`, {
      method: "GET",
    });
    const data = await response.json();

    await redirectToLogin(response.status, data?.error);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
