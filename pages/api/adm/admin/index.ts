import { NextApiRequest, NextApiResponse } from "next";
import { adminHandler } from "@/server/middleware/admin-handler";
import { createAdmin, getAllAdmin, Admin } from "@/server/models/admin";
import { ResponseError, ResponseSuccess } from "@/utils/response";
import { createAdminSchema } from "@/utils/schema/admin";
import { validate } from "@/utils/validate";
import { generateHashPassword } from "@/utils/password";
import { ObjectId } from "mongodb";
import { AdminStatus } from "@/utils/var";

const ListAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { page, search } = req.query;
    const data = await getAllAdmin(false, {
      page: page,
      q: search,
    });
    res.json({ success: true, msg: "get data success", data });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error fetching data" });
  }
};

const CreateAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { errors } = await validate(createAdminSchema, req.body);
    if (errors !== null) {
      return ResponseError(res, 422, "input invalid", errors);
    }
    //update or create user-password
    const hashPassword = await generateHashPassword(req.body.password);

    //create
    const data: Admin = {
      _id: new ObjectId(),
      _created: new Date(),
      _modified: new Date(),
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashPassword,
      status: AdminStatus.ACTIVE,
    };

    await createAdmin(data);

    ResponseSuccess(res, "create data success", null);
  } catch (error) {
    ResponseError(res, 500, "internal server error", null);
  }
};

export default adminHandler({
  GET: ListAdmin,
  POST: CreateAdmin,
});
