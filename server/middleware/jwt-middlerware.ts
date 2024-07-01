import { signJwt, verifyJwt } from "@/utils/jwt";
import { jwtConfig } from "@/utils/var";
import { expressjwt } from "express-jwt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import util from "util";
import { Admin, findAdminById } from "@/server/models/admin";

export const adminJwtMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Load the private key for signing the token
  var secreet = process.env.ADMIN_TOKEN_PRIVATE_KEY || "";
  const privateKey = Buffer.from(secreet, "base64").toString("utf-8");
  const middleware = expressjwt({
    secret: privateKey,
    algorithms: ["HS256"],
    getToken: function fromHeaderOrCookies(req) {
      const token = req.cookies[jwtConfig.accessAdminTokenName];
      if (token) {
        // 1. from cookies
        return token;
      } else if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        // 2.form authorization headers
        return req.headers.authorization.split(" ")[1];
      }
      return null;
    },
  }).unless({
    path: [
      // public routes that don't require authentication
      "/api/adm/auth/login",
      "/api/adm/telegram",
      "/api/adm/auth/forgot-password",
      "/api/adm/auth/reset-password",
      "/api/callback",
    ],
  });
  return util.promisify(middleware)(req, res);
};

// Sign Token
export const adminSignToken = async (admin: Admin, data = {}) => {
  // Sign the access token
  const access_token = signJwt(
    {
      sub: admin._id,
      ...data,
    },
    "adminTokenPrivateKey",
    { expiresIn: jwtConfig.accessTokenExpiresIn }
  );

  // Sign the refresh token
  const refresh_token = signJwt(
    {
      sub: admin._id,
      ...data,
    },
    "adminRefreshTokenPrivateKey",
    { expiresIn: jwtConfig.refreshTokenExpiresIn }
  );

  // Return access token
  return { access_token, refresh_token };
};

// get user login
export const getAdminLogin = async (req: NextApiRequest) => {
  // Get the access token from cookie
  var access_token = req.cookies[jwtConfig.accessAdminTokenName] as string;
  if (!access_token) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    }
  }
  // Validate the Refresh token
  const decoded = verifyJwt<{
    sub: string;
  }>(access_token, "adminTokenPrivateKey");
  if (!decoded) {
    return null;
  }
  var data = decoded as {
    [key: string]: any;
  };
  // find user by email
  const userExist = (await findAdminById(new ObjectId(data.sub))) as Admin;
  return userExist;
};
