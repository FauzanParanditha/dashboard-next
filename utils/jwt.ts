import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
  payload: Object,
  key:
    | "accessTokenPrivateKey"
    | "refreshTokenPrivateKey"
    | "adminTokenPrivateKey"
    | "adminRefreshTokenPrivateKey",
  options: SignOptions = {}
) => {
  if (key == "accessTokenPrivateKey") {
    var secreet = process.env.ACCESS_TOKEN_PRIVATE_KEY || "";
  } else if (key == "adminTokenPrivateKey") {
    var secreet = process.env.ADMIN_TOKEN_PRIVATE_KEY || "";
  } else if (key == "adminRefreshTokenPrivateKey") {
    var secreet = process.env.ADMIN_REFRESH_TOKEN_PRIVATE_KEY || "";
  } else {
    var secreet = process.env.REFRESH_TOKEN_PRIVATE_KEY || "";
  }
  const privateKey = Buffer.from(secreet, "base64").toString("ascii");
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "HS256", // "RS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  key:
    | "accessTokenPrivateKey"
    | "refreshTokenPrivateKey"
    | "adminTokenPrivateKey"
    | "adminRefreshTokenPrivateKey"
): T | null => {
  if (key == "accessTokenPrivateKey") {
    var secreet = process.env.ACCESS_TOKEN_PRIVATE_KEY || "";
  } else if (key == "adminTokenPrivateKey") {
    var secreet = process.env.ADMIN_TOKEN_PRIVATE_KEY || "";
  } else if (key == "adminRefreshTokenPrivateKey") {
    var secreet = process.env.ADMIN_REFRESH_TOKEN_PRIVATE_KEY || "";
  } else {
    var secreet = process.env.REFRESH_TOKEN_PRIVATE_KEY || "";
  }
  const publicKey = Buffer.from(secreet, "base64").toString("ascii");
  return jwt.verify(token, publicKey) as T;
};

interface CookieOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  domain?: string;
}

export const getCookieOptions = (options: Partial<CookieOptions> | null) => {
  // check production
  const ishttpOnly = process.env.NEXT_PUBLIC_APP_TYPE == "prod" ? true : false;
  const isSecure = process.env.NEXT_PUBLIC_APP_TYPE == "prod" ? true : false;

  const defaultOptions: CookieOptions = {
    path: "/",
    expires: new Date(0),
    maxAge: -1,
    secure: isSecure,
    httpOnly: ishttpOnly,
    sameSite: "lax",
  };

  const cookieOptions: CookieOptions = {
    ...defaultOptions,
    ...options,
  };

  return cookieOptions;
};
