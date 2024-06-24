import { deleteIpById, findIpById, updateIp } from "@/server/models/ip";
import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { validate } from "@/utils/validate";
import { ipValidator } from "@/utils/schema/ip";
import { ObjectId } from "mongodb";
import { ResponseError, ResponseSuccess } from "@/utils/response";

const DetailIp = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = new ObjectId(req.query.id as string);
  // find user by id
  var ip = await findIpById(id);
  if (!ip) {
    return ResponseError(res, 400, "not found", null);
  }
  ResponseSuccess(res, "get data success", ip);
};

const UpdateIp = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(ipValidator, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "invalid input", errors);
    }
    const id = new ObjectId(req.query.id as string);
    var ipExist = await findIpById(id);
    if (!ipExist) {
      return ResponseError(res, 400, "not found", null);
    }
    // update
    ipExist._modified = new Date();
    ipExist.name = req.body.name;
    ipExist.ip = req.body.ip;
    await updateIp(ipExist);

    return ResponseSuccess(res, "update data success", null);
  } catch (err) {
    return ResponseError(res, 500, "internal server error", null);
  }
};

const DeleteIp = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = new ObjectId(req.query.id as string);
    var ip = await findIpById(id);
    if (!ip) {
      return ResponseError(res, 400, "not found", null);
    }
    // delete user
    await deleteIpById(id);
    return ResponseSuccess(res, "delete ip success", null);
  } catch (err) {
    return ResponseError(res, 500, "internal server error", null);
  }
};

export default adminHandler({ GET: DetailIp, PUT: UpdateIp, DELETE: DeleteIp });
