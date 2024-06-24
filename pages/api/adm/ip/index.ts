import { createIp, getAllIp, Ip } from "@/server/models/ip";
import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { validate } from "@/utils/validate";
import { ipValidator } from "@/utils/schema/ip";
import { ObjectId } from "mongodb";
import { ResponseError, ResponseSuccess } from "@/utils/response";

const ListIp = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { page, search } = req.query;
    const tlds = await getAllIp(false, {
      page: page,
      q: search,
    });
    ResponseSuccess(res, "get data success", tlds);
  } catch (error) {
    ResponseError(res, 500, "internal server error", null);
  }
};

const CreateIp = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(ipValidator, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "input invalid", errors);
    }
    //create
    const ip: Ip = {
      _id: new ObjectId(),
      _created: new Date(),
      _modified: new Date(),
      name: req.body.name,
      ip: req.body.ip,
    };
    await createIp(ip);

    ResponseSuccess(res, "create data success", null);
  } catch (error) {
    ResponseError(res, 500, "internal server error", null);
  }
};

export default adminHandler({
  GET: ListIp,
  POST: CreateIp,
});
