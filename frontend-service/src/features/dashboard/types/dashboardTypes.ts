
export interface UserProfile {
  username: string;
  roleId: number;
}

export interface TokenPayload {
  sub: string;
  role: number;
  exp: number;
  iat: number;
}