import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { getAdminLogin } from "@/server/middleware/jwt-middlerware";
import { ResponseError, ResponseSuccess } from "@/utils/response";
import { validate } from "@/utils/validate";
import { updateAdminSchema, updatePasswordSchema } from "@/utils/schema/admin";
import { updateAdmin } from "@/server/models/admin";
import { compareHashPassword, generateHashPassword } from "@/utils/password";

const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(updatePasswordSchema, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "invalid input", errors);
    }
    const adminLogin = await getAdminLogin(req);
    if (!adminLogin) {
      return ResponseError(res, 400, "not found", null);
    }

    //check old password
    const isMatch = await compareHashPassword(
      req.body.old_password,
      String(adminLogin.password)
    );
    if (!isMatch) {
      // failed attemp
      return ResponseError(res, 400, "old password incorect", null);
    }

    const hashPassword = await generateHashPassword(req.body.password);
    // update
    adminLogin._modified = new Date();
    adminLogin.password = hashPassword;
    await updateAdmin(adminLogin);

    return ResponseSuccess(res, "update data success", null);
  } catch (err) {
    return ResponseError(res, 500, "internal server error", null);
  }
};

export default adminHandler({ POST: updateProfile });
