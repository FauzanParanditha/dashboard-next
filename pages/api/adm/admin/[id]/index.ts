import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { validate } from "@/utils/validate";
import { ObjectId } from "mongodb";
import { ResponseError, ResponseSuccess } from "@/utils/response";
import {
  deleteAdminById,
  findAdminById,
  updateAdmin,
} from "@/server/models/admin";
import { updateAdminSchema } from "@/utils/schema/admin";

const DetailAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = new ObjectId(req.query.id as string);
  // find user by id
  var data = await findAdminById(id);
  if (!data) {
    return ResponseError(res, 400, "not found", null);
  }
  data.password = "NONE";
  ResponseSuccess(res, "get data success", data);
};

const UpdateAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(updateAdminSchema, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "invalid input", errors);
    }
    const id = new ObjectId(req.query.id as string);
    var data = await findAdminById(id);
    if (!data) {
      return ResponseError(res, 400, "not found", null);
    }
    // update
    data._modified = new Date();
    data.fullName = req.body.fullName;
    data.status = req.body.status;
    await updateAdmin(data);

    return ResponseSuccess(res, "update data success", null);
  } catch (err) {
    return ResponseError(res, 500, "internal server error", null);
  }
};

const DeleteAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = new ObjectId(req.query.id as string);
    var data = await findAdminById(id);
    if (!data) {
      return ResponseError(res, 400, "not found", null);
    }
    // delete user
    await deleteAdminById(id);
    return ResponseSuccess(res, "delete users success", null);
  } catch (err) {
    return ResponseError(res, 500, "internal server error", null);
  }
};

export default adminHandler({
  GET: DetailAdmin,
  PUT: UpdateAdmin,
  DELETE: DeleteAdmin,
});
