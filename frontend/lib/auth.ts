import jwtDecode from "jwt-decode";

export type JwtPayload = {
  sub: string;
  exp: number;
  iat?: number;
  email?: string;
  [key: string]: any;
};

export type AuthUser = {
  id: string;
  email: string;
  company_id?: string;
  name?: string;
  [key: string]: any;
};

export function decodeJwt(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return true;
  const nowSeconds = Date.now() / 1000;
  return payload.exp < nowSeconds;
}

export function isTokenExpiringSoon(
  payload: JwtPayload | null,
  thresholdSeconds = 60,
): boolean {
  if (!payload?.exp) return true;
  const nowSeconds = Date.now() / 1000;
  return payload.exp - nowSeconds < thresholdSeconds;
}




