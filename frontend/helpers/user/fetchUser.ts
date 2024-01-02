import User from "@/interfaces/user";
import { fetchAndHelpRedirect } from "@/helpers/redirect";

export default async function fetchUser() {
  try {
    const response = await fetchAndHelpRedirect("/api/user/", {
      method: "GET",
    });
    const { data, status, _response } = response;
    console.log(_response);
    if (!_response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
