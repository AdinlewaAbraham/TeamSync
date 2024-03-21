import { jwtDecode } from "jwt-decode";

export default function getTokenExpiration(token: string) {
  const decodedToken = jwtDecode(token);
  if (decodedToken && decodedToken.exp) {
    const expirationTimestamp = decodedToken.exp;
    const expirationDate = new Date(expirationTimestamp * 1000); // Convert Unix timestamp to milliseconds
    return expirationDate;
  }
  return null; // Invalid or missing expiration time
}
