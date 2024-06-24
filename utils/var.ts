export const jwtConfig = {
  accessTokenExpiresIn: "3h",
  accessTokenName: "_dsnTkn",
  refreshTokenExpiresIn: "7d",
  refreshTokenName: "_rDsnTkn",
  accessAdminTokenName: "_aDsnTkn",
  refreshAdminTokenName: "_arDsnTkn",
};

export const storagePath = "./storage";

export enum AdminStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}
