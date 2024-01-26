export const load = async ({ cookies }) => {
  cookies.delete("auth_session");
  cookies.delete("google_oauth_state");
};
