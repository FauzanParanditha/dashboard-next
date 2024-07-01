import { NextApiRequest } from "next";
import CryptoJS from "crypto-js";

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export const alphabets = () => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
};

export const generateReferenceNumber = () => {
  const appId = "PRVID";
  const runningNumber = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, "0");
  return `${appId}${runningNumber}`;
};

export const verifySignature = (req: NextApiRequest, secret: string) => {
  const signature = req.headers["x-signature"] as string;
  console.log(signature);

  const jsonBody = JSON.stringify(req.body).replace(/\s/g, "");
  const bodyMd5 = CryptoJS.MD5(jsonBody).toString(CryptoJS.enc.Base64);
  const hmacSignature = `${bodyMd5}`;
  const hmac = CryptoJS.HmacSHA256(hmacSignature, secret);
  const hmacBase64 = hmac.toString(CryptoJS.enc.Base64);

  const hash = btoa(hmacBase64);

  console.log(hash);
  return hash === signature;
};
