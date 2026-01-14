import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

export function getAccessTokenFromCookies() {
  const cookieStore = cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export function getRefreshTokenFromCookies() {
  const cookieStore = cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export function hasAuthCookies() {
  const cookieStore = cookies();
  return (
    !!cookieStore.get(ACCESS_TOKEN_COOKIE) &&
    !!cookieStore.get(REFRESH_TOKEN_COOKIE)
  );
}




