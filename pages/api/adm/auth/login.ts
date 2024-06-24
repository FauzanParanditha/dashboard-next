import { Admin, findAdminByEmail } from "@/server/models/admin";
import { adminHandler } from "@/server/middleware/admin-handler";
import { adminSignToken } from "@/server/middleware/jwt-middlerware";
import { setCookie } from "@/server/middleware/cookies";
import { compareHashPassword } from "@/utils/password";
import { getCookieOptions } from "@/utils/jwt";
import { validate } from "@/utils/validate";
import { loginValidator } from "@/utils/schema/admin";
import { jwtConfig } from "@/utils/var";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseError, ResponseSuccess } from "@/utils/response";
import { ActivityLog, createActivityLog } from "@/server/models/log_activity";
import telegram from "../telegram";
import { createTelegramLog } from "@/server/models/log_telegram";
import api from "@/api";
import axios from "axios";

const loginByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(loginValidator, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "invalid input", errors);
    }
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // find admin by email
    const adminExist = (await findAdminByEmail(req.body.email)) as Admin;
    if (!adminExist) {
      return ResponseError(res, 400, "email or password incorect", null);
    }

    // check if active
    if (adminExist.status !== "ACTIVE") {
      return ResponseError(res, 400, "user is not active", null);
    }

    const isMatch = await compareHashPassword(
      req.body.password,
      String(adminExist.password)
    );
    if (!isMatch) {
      // failed attemp
      return ResponseError(res, 400, "email or password incorect", null);
    }

    const activity: ActivityLog = {
      _id: new ObjectId(),
      _created: new Date(),
      _modified: new Date(),
      data: {
        admin_id: adminExist._id,
        email: adminExist.email,
        fullName: adminExist.fullName,
      },
      do_time: new Date(),
      do: "login",
    };

    await createActivityLog(activity);

    const currentDate = new Date();
    // admin cookie
    // Create the Access and refresh Tokens
    const { access_token, refresh_token } = await adminSignToken(adminExist, {
      email: adminExist.email,
    });
    const expires = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
    // 1 hours
    // success
    const cookieOptions = getCookieOptions({
      expires: expires,
      maxAge: 1 * 60 * 1000,
    }); // 1 hour
    setCookie(res, jwtConfig.accessAdminTokenName, access_token, cookieOptions);

    // refresh token
    var refresh_expires = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    ); // 7 days
    const cookieRefreshOptions = getCookieOptions({
      expires: refresh_expires,
      maxAge: 7 * 24 * 60 * 1000,
    }); // 7d
    setCookie(
      res,
      jwtConfig.refreshAdminTokenName,
      refresh_token,
      cookieRefreshOptions
    );
    adminExist.password = "NONE";

    // const telegram = await api().post("/adm/telegram", {
    //   message: {
    //     data: activity.data,
    //     do_time: activity.do_time,
    //     do: activity.do,
    //   },
    // });

    // success
    return res.status(200).json({
      success: true,
      data: {
        user: adminExist,
        access_token: access_token,
        token_type: "Bearer",
        expires: expires,
        refresh_token: refresh_token,
      },
      msg: "login success",
    });
  } catch (err) {
    return ResponseError(res, 500, "internal server error", err);
  }
};

// handler
export default adminHandler({ POST: loginByEmail });
