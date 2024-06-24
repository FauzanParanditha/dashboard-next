import { NextApiRequest, NextApiResponse } from "next";
import { validate } from "@/utils/validate";
import { Admin, findAdminByEmail } from "@/server/models/admin";
import { adminHandler } from "@/server/middleware/admin-handler";
import { error } from "console";
import {
  SendForgotPassword,
  generateForgotPasswordLink,
  generateVerificationToken,
} from "@/utils/sendMail";
import { VerifiedToken, createToken } from "@/server/models/verified_token";
import { ObjectId } from "mongodb";
import { forgotValidator } from "@/utils/schema/forgot-password";
import { ResponseError } from "@/utils/response";

const forgotPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  const { errors } = await validate(forgotValidator, req.body);
  if (errors !== null) {
    return ResponseError(res, 422, "invalid input", errors);
  }
  const email: string = req.body.email;

  try {
    const userExist = (await findAdminByEmail(email)) as Admin;
    if (!userExist) {
      return res.status(404).json({
        msg: "Email not found",
      });
    }

    try {
      const token = generateVerificationToken();
      const tokenData: VerifiedToken = {
        _id: new ObjectId(),
        _created: new Date(),
        _modified: new Date(),
        admin_id: userExist._id,
        token: token,
      };
      await createToken(tokenData);
      await SendForgotPassword(
        generateForgotPasswordLink(token, userExist.email),
        userExist.email,
        userExist.fullName
      );
      return res.status(200).json({
        success: true,
        code: 200,
        msg: "Send email success",
      });
    } catch (error) {}
    return res.status(500).json({
      code: 500,
      success: false,
      msg: error,
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
  POST: forgotPassword,
});
