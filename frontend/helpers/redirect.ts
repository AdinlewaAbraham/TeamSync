export async function fetchAndHelpRedirect(url: string, options: object) {
  const response = await fetch(url, {
    ...options,
  });
  const data = await response.json();
  console.log(data);
  if (response.status === 401 && data?.error === "REDIRECT_TO_LOGIN") {
    window.location.href = "/login";
    return { status: response.status, data, _response: response };
  }
  return { status: response.status, data, _response: response };
}
