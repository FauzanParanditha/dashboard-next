import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { getAdminLogin } from "@/server/middleware/jwt-middlerware";
import { ResponseError, ResponseSuccess } from "@/utils/response";
import { validate } from "@/utils/validate";
import { updateAdminSchema } from "@/utils/schema/admin";
import { updateAdmin } from "@/server/models/admin";

const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(updateAdminSchema, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "invalid input", errors);
    }
    const adminLogin = await getAdminLogin(req);
    if (!adminLogin) {
      return ResponseError(res, 400, "not found", null);
    }
    // update
    adminLogin._modified = new Date();
    adminLogin.fullName = req.body.fullName;
    adminLogin.email = req.body.email;
    await updateAdmin(adminLogin);

    return ResponseSuccess(res, "update data success", null);
  } catch (err) {
    return ResponseError(res, 500, "internal server error", null);
  }
};

export default adminHandler({ POST: updateProfile });
