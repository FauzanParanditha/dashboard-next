import { generateHashPassword } from "@/utils/password";
import { adminHandler } from "@/server/middleware/admin-handler";
import { findAdminByEmail, updateAdmin } from "@/server/models/admin";
import {
  deleteTokenById,
  findTokenByToken,
} from "@/server/models/verified_token";
import { ResponseError } from "@/utils/response";
import { resetValidator } from "@/utils/schema/forgot-password";
import { NextApiRequest, NextApiResponse } from "next";
import { validate } from "@/utils/validate";

const resetPasswordHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { errors } = await validate(resetValidator, req.body);
  if (errors !== null) {
    return ResponseError(res, 422, "invalid input", errors);
  }

  const { email, password } = req.body;

  try {
    const { token } = req.query as { token: string };
    const verified = await findTokenByToken(token);
    if (!verified) {
      return res.status(404).json({
        code: 404,
        success: false,
        msg: "Token not found",
      });
    }
    const userExist = await findAdminByEmail(email);
    if (!userExist) {
      return res.status(404).json({
        code: 404,
        status: false,
        msg: "Admin not found",
      });
    }
    const hash = await generateHashPassword(password);
    userExist.password = hash;
    await updateAdmin(userExist);
    await deleteTokenById(verified._id);
    res.json({
      code: 200,
      success: true,
      msg: "Change password success",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      msg: "Internal server error",
    });
  }
};

export default adminHandler({
  POST: resetPasswordHandler,
});
