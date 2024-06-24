import { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "@/server/middleware/error-handler";
import { adminJwtMiddleware } from "@/server/middleware/jwt-middlerware";
import { findIpByIp } from "../models/ip";

export const adminHandler = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    if (method !== undefined) {
      const clientIP = req.socket.remoteAddress;
      // console.log(clientIP);
      if (!clientIP) {
        return res.status(400).end("Remote address not found");
      }

      const isWhitelisted = await findIpByIp(clientIP);

      if (!isWhitelisted) {
        return res.status(403).end("Access Forbidden: IP not whitelisted");
      }

      // check handler supports HTTP method
      if (!handler[method])
        return res.status(405).end(`Method ${req.method} Not Allowed`);

      try {
        // global middleware
        await adminJwtMiddleware(req, res);

        // route handler
        await handler[method](req, res);
      } catch (err) {
        // global error handler
        errorHandler(err, res);
      }
    }
  };
};
