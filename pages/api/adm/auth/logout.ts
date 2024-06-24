import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { Admin, findAdminByEmail, findAdminById } from "@/server/models/admin";
import { ActivityLog, createActivityLog } from "@/server/models/log_activity";
import { ObjectId } from "mongodb";
import { validate } from "@/utils/validate";
import { logoutValidator } from "@/utils/schema/admin";
import { ResponseError } from "@/utils/response";
import api from "@/api";

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(logoutValidator, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "invalid input", errors);
    }

    //search on user
    const userExist = (await findAdminByEmail(req.body.email)) as Admin;
    if (!userExist) {
      return ResponseError(res, 400, "email or password incorect", null);
    }

    const activity: ActivityLog = {
      _id: new ObjectId(),
      _created: new Date(),
      _modified: new Date(),
      data: {
        admin_id: userExist._id,
        email: userExist.email,
        fullName: userExist.fullName,
      },
      do_time: new Date(),
      do: "logout",
    };

    await createActivityLog(activity);

    // const telegram = await api().post("/adm/telegram", {
    //   message: {
    //     data: activity.data,
    //     do_time: activity.do_time,
    //     do: activity.do,
    //   },
    // });

    return res.status(200).json({
      success: true,
      code: 200,
      msg: "logout success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      msg: "Internal server error",
    });
  }
};

export default adminHandler({
  POST: logout,
});
