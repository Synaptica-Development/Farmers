import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
};

export function extractRoleFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
}
