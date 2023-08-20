
export async function redirectToLogin(status: number, errorMessage: string) {
  if (status === 401 && errorMessage === "REDIRECT_TO_LOGIN") {
    console.log("redirect to login now!!!");
    window.location.href = "/login";

  }
}
