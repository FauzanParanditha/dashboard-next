import { adminHandler } from "@/server/middleware/admin-handler";
import { createCallback } from "@/server/models/callback-privy";
import { verifySignature } from "@/utils/helpers";
import { ResponseError, ResponseSuccess } from "@/utils/response";
import { callbackSchema } from "@/utils/schema/callback-privy";
import { validate } from "@/utils/validate";
import { NextApiRequest, NextApiResponse } from "next";

const CallbackPrivy = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = process.env.SIGNATURE_SECRET;

  if (!secret) {
    return ResponseError(
      res,
      500,
      "Internal server error",
      "Missing secret key"
    );
  }

  if (!verifySignature(req, secret)) {
    return ResponseError(res, 401, "Unauthorized", "Invalid signature");
  }

  try {
    const { errors } = await validate(callbackSchema, req.body);
    if (errors != null) {
      return ResponseError(res, 422, "input invalid", errors);
    }

    await createCallback(req.body);
    ResponseSuccess(res, "create data success", null);
  } catch (error) {
    ResponseError(res, 500, "internal server error", null);
  }
};

export default adminHandler({
  POST: CallbackPrivy,
});
