import User from "@/interfaces/user";
import { redirectToLogin } from "@/helpers/redirect";

export default async function fetchUser() {
  try {
    const response = await fetch("/api/user/", {
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
